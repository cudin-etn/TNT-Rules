"use client";

import { useMemo, useState } from "react";
import { Sparkles, Send, Loader2, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { Link } from "@/i18n/routing";

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
};

type Msg = { role: "user" | "assistant"; text: string };

async function readJsonSafe(res: Response): Promise<{ ok: boolean; status: number; bodyText: string; json: any | null }> {
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

export default function AiChatPage() {
  const addItem = useCartStore((s) => s.addItem);

  const [mode, setMode] = useState<"demo" | "live">("demo");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text:
        "Em là AI tư vấn mồi câu TNT Lures. Anh/chị câu hồ hay sông? Nước đục hay trong? Nhắm cá gì ạ?",
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
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, mode }),
      });

      const { ok, status, bodyText, json } = await readJsonSafe(res);

      if (!ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text:
              `AI API lỗi (${status}).\n` +
              `Nếu đang demo: kiểm tra route tồn tại (/src/app/api/ai-chat/route.ts) và restart dev server.\n\n` +
              `Response: ${bodyText.slice(0, 500)}`,
          },
        ]);
        setSuggestions([]);
        return;
      }

      const data = (json ?? {}) as ApiResp;
      setMessages((prev) => [...prev, { role: "assistant", text: data.text ?? "(không có nội dung)" }]);
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
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            AI Tư vấn sản phẩm
          </h1>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
            Demo: RAG nhẹ từ Supabase products + trả lời theo ngữ cảnh.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-10 px-3 rounded-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="bg-transparent outline-none text-[13px] font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="demo">demo</option>
              <option value="live">live</option>
            </select>
          </div>
          <Link
            href="/admin/chat"
            className="h-10 px-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-[12px] inline-flex items-center hover:opacity-90 transition"
          >
            Về Inbox
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        {/* Chat box */}
        <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col min-h-[520px]">
          <div className="p-3 border-b border-white/40 dark:border-white/10">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-white/70 dark:bg-white/5 border-white/50 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/10 transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-3 space-y-3 overflow-y-auto">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[82%] rounded-xl px-3 py-2.5 text-[13px] border ${
                  m.role === "assistant"
                    ? "bg-white/70 dark:bg-white/5 border-white/50 dark:border-white/10 text-slate-900 dark:text-white"
                    : "ml-auto bg-orange-500/10 border-orange-500/20 text-slate-900 dark:text-white"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/40 dark:border-white/10">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập câu hỏi…"
                className="flex-1 h-10 px-3 rounded-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 outline-none text-[13px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") send(input);
                }}
              />
              <button
                onClick={() => send(input)}
                className="h-10 px-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-[12px] inline-flex items-center gap-2 hover:opacity-90 transition"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Gửi
              </button>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm p-4">
          <div className="text-[13px] font-semibold text-slate-900 dark:text-white mb-2">
            Gợi ý sản phẩm
          </div>

          {suggestions.length === 0 ? (
            <div className="text-[12px] font-medium text-slate-600 dark:text-slate-300">
              AI sẽ đề xuất 1–3 sản phẩm tại đây.
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((s, i) => (
                <div
                  key={`${s.slug ?? s.id ?? i}`}
                  className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 p-3"
                >
                  <div className="text-[13px] font-semibold text-slate-900 dark:text-white">
                    {s.name}
                  </div>
                  <div className="mt-1 text-[12px] font-medium text-slate-600 dark:text-slate-300">
                    {(Number(s.price) || 0).toLocaleString("vi-VN")} ₫
                  </div>
                  {s.reason && (
                    <div className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {s.reason}
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    {s.slug ? (
                      <Link
                        href={`/products/${s.slug}`}
                        className="h-9 px-3 rounded-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 font-semibold text-[12px] hover:opacity-90 transition inline-flex items-center"
                      >
                        Xem
                      </Link>
                    ) : (
                      <button
                        className="h-9 px-3 rounded-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 font-semibold text-[12px] opacity-60 cursor-not-allowed"
                        disabled
                      >
                        Xem
                      </button>
                    )}

                    <button
                      onClick={() =>
                        addItem({
                          id: s.id ?? s.slug ?? `${i}`,
                          name: s.name,
                          slug: s.slug ?? undefined,
                          price: Number(s.price) || 0,
                          image_url: s.image,
                        } as any)
                      }
                      className="h-9 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold text-[12px] inline-flex items-center gap-2 hover:opacity-90 transition"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Live mode cần OPENAI_API_KEY. Demo mode luôn chạy được.
          </div>
        </div>
      </div>
    </div>
  );
}