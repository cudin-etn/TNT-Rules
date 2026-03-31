import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Khởi tạo Supabase Admin để chèn đơn hàng
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

function getFirstImageUrl(images: unknown): string {
  const fallback = "/images/placeholder.png";
  if (!images) return fallback;
  if (Array.isArray(images)) return typeof images[0] === "string" ? images[0] : fallback;
  if (typeof images === "string") {
    if (images.startsWith("[")) {
      try { const p = JSON.parse(images); return Array.isArray(p) && p[0] ? p[0] : fallback; } catch {}
    }
    return images;
  }
  return fallback;
}

function toSuggestion(p: any, reason?: string) {
  return {
    id: p.id, name: String(p.name ?? "Sản phẩm"), slug: p.slug ?? null,
    price: Number(p.price) || 0, image: getFirstImageUrl(p.images ?? p.image_url), reason,
  };
}

async function fetchProductsForRag(query: string) {
  const kw = query.trim();
  const { data, error } = await supabase.from("products").select("*").or(`name.ilike.%${kw}%,category.ilike.%${kw}%`).limit(8);
  if (error || !data || data.length === 0) {
    const { data: fallback } = await supabase.from("products").select("*").limit(8);
    return { products: fallback ?? [] };
  }
  return { products: data };
}

// ĐÃ SỬA: Nhận thêm biến history
async function callGemini(userMessage: string, products: any[], history: any[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Thiếu GEMINI_API_KEY");

  const context = products.map((p) => ({ id: p.id, name: p.name, price: Number(p.price) || 0 }));

  const systemPrompt = `Bạn là nhân viên bán hàng xuất sắc của TNT Lures. 
Danh sách sản phẩm hiện có: ${JSON.stringify(context)}.

NHIỆM VỤ ĐẶC BIỆT (CHỐT ĐƠN):
Nếu khách có ý định mua hàng VÀ cung cấp ĐỦ thông tin (Tên, SĐT, Địa chỉ giao hàng) dựa trên toàn bộ lịch sử trò chuyện, hãy kích hoạt lệnh tạo đơn. Nếu thiếu thông tin, hãy hỏi thêm.

BẠN PHẢI TRẢ VỀ CHUẨN JSON SAU:
{
  "reply": "Câu trả lời của bạn (Nếu tạo đơn, hãy báo tổng tiền và bảo khách quét mã QR bên dưới)",
  "suggestions": [ {"id": "id sản phẩm", "reason": "lý do"} ],
  "order_action": {
    "is_ordering": true hoặc false,
    "customer_name": "Tên khách",
    "customer_phone": "SĐT",
    "customer_address": "Địa chỉ",
    "items": [ {"id": "id sản phẩm", "quantity": 1, "price": 100000} ]
  }
}`;

  // 1. CHUYỂN ĐỔI LỊCH SỬ CHAT SANG ĐỊNH DẠNG CỦA GEMINI
  const formattedContents = history
    .filter((m: any) => m.role === "user" || m.role === "assistant")
    .map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }]
    }));

  // 2. NHÉT CÂU HỎI MỚI CỦA KHÁCH + SYSTEM PROMPT VÀO CUỐI
  formattedContents.push({
    role: "user",
    parts: [{ text: `[HƯỚNG DẪN CỦA HỆ THỐNG]:\n${systemPrompt}\n\n[KHÁCH HÀNG NÓI]: "${userMessage}"` }]
  });

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: formattedContents, generationConfig: { response_mime_type: "application/json" } })
  });

  if (!res.ok) throw new Error("Lỗi gọi Google API");
  const data = await res.json();
  const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = JSON.parse(outputText);

  let orderResult = null;

  if (parsed.order_action && parsed.order_action.is_ordering) {
    const action = parsed.order_action;
    const orderCode = "TNT-" + Math.floor(10000 + Math.random() * 90000);
    const totalAmount = action.items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);

    const { data: newOrder, error } = await supabase.from("orders").insert({
      order_code: orderCode,
      customer_name: action.customer_name || "Khách mua qua AI",
      customer_phone: action.customer_phone || "",
      customer_address: action.customer_address || "",
      total_amount: totalAmount,
      status: "pending",
      ai_tags: ["Chốt qua AI"]
    }).select().single();

    if (!error && newOrder) {
      const orderItems = action.items.map((i: any) => ({
        order_id: newOrder.id, product_id: i.id, product_name: "Sản phẩm", quantity: i.quantity, price: i.price
      }));
      await supabase.from("order_items").insert(orderItems);
      orderResult = { code: orderCode, total: totalAmount };
    }
  }

  const suggestions = parsed.suggestions ? parsed.suggestions.slice(0,2).map((s: any) => {
    const found = products.find(p => p.id === s.id);
    return found ? toSuggestion(found, s.reason) : null;
  }).filter(Boolean) : [];

  return { text: String(parsed.reply), suggestions, order: orderResult };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const message = body?.message?.trim();
  // LẤY LỊCH SỬ CHAT TỪ FRONTEND (Mặc định là mảng rỗng nếu chưa có)
  const history = body?.history || []; 

  if (!message) return NextResponse.json({ error: "Missing message" }, { status: 400 });

  const { products } = await fetchProductsForRag(message);
  try {
    const liveData = await callGemini(message, products, history);
    return NextResponse.json(liveData);
  } catch (e: any) {
    return NextResponse.json({ text: `Lỗi AI: ${e.message}`, suggestions: [] });
  }
}