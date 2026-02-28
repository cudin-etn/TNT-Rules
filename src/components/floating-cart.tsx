"use client";

import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/cart-store";

export function FloatingCart() {
  const { openCart, totalItems: getTotalItems } = useCartStore();
  const count = getTotalItems();
  
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.5 }}
          // Ép Z-index cao để luôn nổi trên Footer
          className="fixed bottom-8 right-8 z-"
        >
          <button 
            onClick={openCart}
            className="relative flex items-center justify-center h-14 w-14 rounded-full bg-orange-500 text-white shadow-[0_10px_40px_-10px_rgba(249,115,22,0.8)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 group border border-white/20 dark:border-white/10"
          >
            <ShoppingBag className="h-6 w-6 transition-transform group-hover:-rotate-12" />
            <motion.span 
              key={count} initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -top-1 -right-1 h-5 w-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[10px] font-black flex items-center justify-center rounded-full ring-2 ring-background shadow-sm"
            >
              {count}
            </motion.span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}