"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Loader2, Sparkles, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { Link } from "@/i18n/routing";
import { useAiStore } from "@/lib/ai-store";

type Suggestion = {
  id?: string | number;
  name: string;
  slug?: string | null;
  price?: number;
  image?: string;
  reason?: string;
};

type ApiResp = { 
  text: string; 
  suggestions: Suggestion[];
  order?: { code: string; total: number } 
};

type Msg = { 
  role: "user" | "assistant"; 
  text: string;
  order?: { code: string; total: number }
};

async function readJsonSafe(res: Response): Promise<{
  ok: boolean;
  status: number;
  bodyText: string;
  json: any | null;
}> {
  const status = res.status;
  const ok = res.ok;
  const bodyText = await res.text();
  try {
    const json = bodyText ? JSON.parse(bodyText) : null;
    return { ok, status, bodyText, json };
  } catch {
    return { ok, status, bodyText, json: null };
  }
}

export function AiChatDrawer() {
  const { isOpen, closeAi } = useAiStore();
  const addItem = useCartStore((s) => s.addItem);
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Em là AI tư vấn mồi câu TNT Lures. Anh/chị câu hồ hay sông? Nước đục hay trong? Nhắm cá gì ạ?",
    },
  ]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const quickPrompts = useMemo(
    () => [
      "Câu cá lóc nước đục buổi chiều nên dùng mồi gì?",
      "Combo 500k câu cá rô/cá lóc gồm những gì?",
      "Mồi nhái hơi size 8cm loại nào dễ trúng?",
      "Cá sắt 14g dùng ở hồ sâu có ổn không?",
    ],
    []
  );

  async function send(text: string) {
    const msg = text.trim();
    if (!msg || loading) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");

    try {
      // Lấy lịch sử chat hiện tại để gửi kèm cho AI
      const historyToSend = messages.map(m => ({ role: m.role, text: m.text }));

      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: historyToSend }),
      });
      const { ok, status, bodyText, json } = await readJsonSafe(res);

      if (!ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `AI API lỗi (${status}). Vui lòng thử lại sau.`,
          },
        ]);
        setSuggestions([]);
        return;
      }

      const data = (json ?? {}) as ApiResp;
      
      // ĐÃ FIX: Lưu cả nội dung chữ và dữ liệu mã QR vào state
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          text: data.text ?? "(không có nội dung)",
          order: data.order 
        },
      ]);
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `Có lỗi khi gọi AI: ${String(e?.message ?? e)}` },
      ]);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[80] backdrop-blur-sm"
            onClick={closeAi}
          />

          <motion.aside
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed top-4 bottom-4 right-4 w-[calc(100%-2rem)] sm:w-[440px] z-[90] rounded-[24px] shadow-2xl flex flex-col overflow-hidden border border-white/20 dark:border-white/10"
          >
            <div className="absolute inset-0 z-0 bg-slate-50 dark:bg-[#0f172a] pointer-events-none">
              <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-500/30 dark:bg-blue-500/40 rounded-full blur-[100px]" />
              <div className="absolute top-[15%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-500/30 dark:bg-fuchsia-400/30 rounded-full blur-[120px]" />
              <div className="absolute -bottom-[10%] left-[5%] w-[45%] h-[45%] bg-orange-500/30 dark:bg-orange-500/30 rounded-full blur-[100px]" />
              <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col h-full w-full">
              <div className="p-4 border-b border-white/30 dark:border-white/10 flex items-center justify-between gap-3 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                <div className="min-w-0">
                  <div className="text-[15px] font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    AI Tư vấn sản phẩm
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                    Hệ thống tư vấn thông minh TNT Lures
                  </div>
                </div>
                <button onClick={closeAi} className="h-9 w-9 rounded-xl bg-white/80 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 border border-white/50 dark:border-white/10 text-slate-700 dark:text-slate-200 inline-flex items-center justify-center transition-colors shadow-sm">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-3 border-b border-white/20 dark:border-white/5 shrink-0">
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((p) => (
                    <button key={p} onClick={() => send(p)} className="text-[11px] font-semibold px-3 py-1.5 rounded-full border bg-white/60 hover:bg-white dark:bg-white/5 border-white/50 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-colors shadow-sm backdrop-blur-md">
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* ĐÃ FIX: Chỉ giữ lại MỘT khối render tin nhắn */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto scroll-smooth">
                {messages.map((m, idx) => {
                  const isAI = m.role === "assistant";
                  return (
                    <div
                      key={idx}
                      className={`max-w-[85%] p-3.5 shadow-sm ${
                        isAI
                          ? "mr-auto bg-gradient-to-br from-orange-500/90 to-rose-500/90 rounded-2xl rounded-bl-sm text-white"
                          : "ml-auto bg-gradient-to-br from-blue-500/90 to-cyan-500/90 rounded-2xl rounded-br-sm text-white"
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-medium text-[13.5px] leading-relaxed">{m.text}</div>
                      
                      {/* ĐÃ FIX: Hiển thị mã QR đẹp lộng lẫy nếu có Đơn Hàng */}
                      {m.order && (
                        <div className="mt-4 p-4 bg-white rounded-xl shadow-inner text-center animate-in zoom-in duration-300 text-slate-900">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Quét mã thanh toán</p>
                          <img 
                            src={`https://img.vietqr.io/image/970422-7901888881988-compact2.png?amount=${m.order.total}&addInfo=${m.order.code}&accountName=TNT LURES`}
                            alt="QR"
                            className="w-full max-w-[150px] mx-auto rounded-lg border border-slate-200"
                          />
                          <p className="text-orange-600 font-black mt-2 text-sm">{m.order.total.toLocaleString("vi-VN")} ₫</p>
                          <p className="text-slate-600 font-bold text-[11px] mt-0.5">Mã đơn: {m.order.code}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-white/30 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[13px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-orange-500" />
                    Gợi ý cho bạn
                  </div>
                  <Link href="/products" className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    Xem kho mồi
                  </Link>
                </div>

                {suggestions.length === 0 ? (
                  <div className="text-[12px] font-medium text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-dashed border-slate-300 dark:border-white/20 text-center">
                    AI sẽ đề xuất sản phẩm tại đây.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
                    {suggestions.slice(0, 3).map((s, i) => (
                      <div key={`${s.slug ?? s.id ?? i}`} className="rounded-xl p-[1px] bg-gradient-to-br from-orange-500/30 to-rose-500/30 shadow-sm">
                        <div className="h-full w-full rounded-[11px] bg-white/95 dark:bg-slate-900/95 p-3 flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-bold text-[13px] text-slate-900 dark:text-white leading-tight">{s.name}</div>
                            <div className="font-black text-[12px] text-orange-600 dark:text-orange-500">{(Number(s.price) || 0).toLocaleString("vi-VN")} ₫</div>
                          </div>
                          {s.reason && <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{s.reason}</div>}
                          <div className="flex items-center gap-2 mt-1">
                            {s.slug ? (
                              <Link href={`/products/${s.slug}`} className="h-8 px-4 rounded-lg bg-slate-100 dark:bg-white/5 font-bold text-[11px] flex items-center text-slate-700 dark:text-slate-200">Chi tiết</Link>
                            ) : (
                              <button className="h-8 px-4 rounded-lg bg-slate-100 font-bold text-[11px] text-slate-400" disabled>Chi tiết</button>
                            )}
                            <button onClick={() => addItem({ id: s.id ?? s.slug ?? `${i}`, name: s.name, slug: s.slug ?? undefined, price: Number(s.price) || 0, image_url: s.image } as any)} className="h-8 flex-1 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-[11px] shadow-md shadow-orange-500/20 transition-transform hover:-translate-y-0.5">
                              Thêm vào giỏ
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập câu hỏi..."
                    className="flex-1 h-11 px-4 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-white/10 outline-none focus:border-orange-500 text-[13px] shadow-inner font-medium text-slate-900 dark:text-white"
                    onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
                  />
                  <button onClick={() => send(input)} className="h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold text-[13px] transition-all shadow-md hover:-translate-y-0.5">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}