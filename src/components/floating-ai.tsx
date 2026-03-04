"use client";

import { useEffect, useState } from "react";
import { Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AiChatDrawer } from "@/components/ai-chat-drawer";

export function FloatingAI() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <AiChatDrawer open={open} onClose={() => setOpen(false)} modeDefault="demo" />

      <AnimatePresence>
        {mounted && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.8 }}
            className="fixed bottom-28 right-8 z-[60]"
          >
            <button
              onClick={() => setOpen(true)}
              className="relative flex items-center justify-center h-14 w-14 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-[0_10px_40px_-10px_rgba(15,23,42,0.6)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 group border border-white/20 dark:border-white/10"
              aria-label="Mở AI chat"
            >
              <Bot className="h-6 w-6 transition-transform group-hover:-rotate-6" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-white text-[10px] font-semibold flex items-center justify-center ring-2 ring-background shadow-sm">
                AI
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}