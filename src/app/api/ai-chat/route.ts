import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ProductRow = {
  id: string | number; name?: string | null; slug?: string | null;
  price?: number | string | null; category?: string | null;
  description?: string | null; images?: unknown; image_url?: unknown;
};

function getFirstImageUrl(images: unknown): string {
  const fallback = "/images/placeholder.png";
  if (!images) return fallback;
  if (Array.isArray(images)) {
    const first = images.find((x) => typeof x === "string" && x.trim() !== "");
    return typeof first === "string" ? first.trim() : fallback;
  }
  if (typeof images === "string") {
    const s = images.trim();
    if (!s) return fallback;
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) {
          const first = parsed.find((x) => typeof x === "string" && x.trim() !== "");
          return typeof first === "string" ? first.trim() : fallback;
        }
      } catch {}
    }
    return s;
  }
  return fallback;
}

function toSuggestion(p: ProductRow, reason?: string) {
  return {
    id: p.id, name: String(p.name ?? "Sản phẩm"), slug: p.slug ?? null,
    price: Number(p.price) || 0, image: getFirstImageUrl(p.images ?? p.image_url), reason,
  };
}

async function fetchProductsForRag(query: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !serviceKey) return { products: [] as ProductRow[] };

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const kw = query.trim();
  
  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug,price,category,description,images,image_url")
    .or(`name.ilike.%${kw}%,slug.ilike.%${kw}%,category.ilike.%${kw}%`)
    .limit(8);

  if (error || !data || data.length === 0) {
    const { data: fallback } = await supabase.from("products").select("*").limit(8);
    return { products: (fallback ?? []) as ProductRow[] };
  }
  return { products: data as ProductRow[] };
}

async function callGemini(userMessage: string, products: ProductRow[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Thiếu GEMINI_API_KEY");

  // Rút gọn bối cảnh để gửi đi
  const context = products.map((p) => ({
    id: p.id, name: p.name, slug: p.slug, price: Number(p.price) || 0, description: p.description,
  }));

  // Gộp toàn bộ lệnh hệ thống và câu hỏi thành 1 chuỗi văn bản duy nhất (an toàn 100%)
const prompt = `Bạn là chuyên viên tư vấn của shop đồ câu TNT Lures.
NGUYÊN TẮC TỐI THƯỢNG:
1. CHỈ tư vấn về: đồ câu, mồi giả, kỹ thuật câu, địa hình, các loại cá săn mồi, và thông tin sản phẩm của shop.
2. TỪ CHỐI MỌI CÂU HỎI NGOÀI LỀ (như lập trình, máy tính, Mac mini, chính trị, v.v.). Nếu khách hỏi ngoài lề, hãy lịch sự từ chối và lái câu chuyện về đồ câu. 
   (Ví dụ: "Dạ em chỉ là AI tư vấn mồi câu của TNT Lures nên không rành về vấn đề này ạ. Anh/chị có đang tìm mồi câu cá lóc không?")
3. CHỈ ĐƯỢC CHỌN SẢN PHẨM TRONG DANH SÁCH CÓ SẴN SAU: ${JSON.stringify(context)}.

Câu hỏi của khách: "${userMessage}"

BẮT BUỘC TRẢ VỀ ĐÚNG CẤU TRÚC JSON SAU (không dùng markdown \`\`\`json):
{
  "reply": "câu trả lời tư vấn hoặc từ chối của bạn",
  "suggestions": [
    {"id": "id sản phẩm", "name": "tên", "slug": "slug", "price": 100000, "reason": "lý do gợi ý ngắn gọn"}
  ]
}`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await res.json();
  
  // IN LỖI RA TERMINAL NẾU GOOGLE TỪ CHỐI API
  if (!res.ok) {
    console.error("====== LỖI TỪ GOOGLE GEMINI ======\n", JSON.stringify(data, null, 2));
    throw new Error(data?.error?.message || "Lỗi kết nối Gemini");
  }

  let outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!outputText) throw new Error("AI không trả về dữ liệu");

  // Vặt sạch râu ria markdown để Next.js không bị lỗi Parse
  outputText = outputText.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(outputText);
  
  const suggestions = Array.isArray(parsed.suggestions)
    ? parsed.suggestions.slice(0, 3).map((s: any) => {
        const found = products.find((p) => String(p.id) === String(s.id) || p.slug === s.slug);
        return {
          id: s.id, name: String(s.name ?? found?.name), slug: s.slug ?? found?.slug ?? null,
          price: Number(s.price) || 0, reason: s.reason,
          image: found ? getFirstImageUrl(found.images ?? found.image_url) : "/images/placeholder.png",
        };
      })
    : products.slice(0, 3).map((p) => toSuggestion(p));

  return { text: String(parsed.reply), suggestions };
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null));
  const message = body?.message?.trim();
  const mode = body?.mode ?? "demo";

  if (!message) return NextResponse.json({ error: "Missing message" }, { status: 400 });

  const { products } = await fetchProductsForRag(message);

  if (mode === "live") {
    try {
      const liveData = await callGemini(message, products);
      return NextResponse.json(liveData);
    } catch (e: any) {
      console.error("Lỗi bao ngoài:", e.message);
      return NextResponse.json({ 
        text: `[Lỗi API AI]: ${e.message}. Tạm chuyển về phản hồi mặc định.`, 
        suggestions: products.slice(0, 3).map((p) => toSuggestion(p))
      });
    }
  }

  return NextResponse.json({
    text: `Dạ (đang ở mode Demo), với câu hỏi "${message}", em thấy vài mẫu này rất nhạy cá:`,
    suggestions: products.slice(0, 3).map((p) => toSuggestion(p, "Mồi nhạy, chống vướng tốt."))
  });
}