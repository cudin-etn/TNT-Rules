"use client";

import { useEffect, useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAiStore } from "@/lib/ai-store"; // Dùng Store chung

export function FloatingAI() {
  const [mounted, setMounted] = useState(false);
  const openAi = useAiStore((s) => s.openAi); // Lấy lệnh mở từ Store

  // Chống lỗi Hydration của Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.8 }}
        className="fixed bottom-28 right-8 z-[60]"
      >
        <button
          onClick={openAi} // Gọi lệnh mở từ Store
          className="relative flex items-center justify-center h-14 w-14 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-[0_10px_40px_-10px_rgba(15,23,42,0.6)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 group border border-white/20 dark:border-white/10"
          aria-label="Mở AI chat"
        >
          {/* Icon Bot biến hình khi hover cho sinh động */}
          <div className="relative">
            <Bot className="h-6 w-6 transition-transform group-hover:scale-0 duration-300" />
            <Sparkles className="h-6 w-6 absolute inset-0 scale-0 group-hover:scale-110 transition-transform duration-300 text-orange-500" />
          </div>

          {/* Badge thông báo AI */}
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm animate-bounce">
            AI
          </span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}