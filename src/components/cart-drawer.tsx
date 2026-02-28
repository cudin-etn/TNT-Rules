"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Ép Z-index lên cao nhất để không bị banner đè */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-"
          />

          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-2xl z- flex flex-col border-l border-border/50"
          >
            <div className="p-6 flex items-center justify-between border-b border-border/50 bg-slate-50/50 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-orange-500" />
                <h2 className="text-xl font-black uppercase tracking-tighter">Giỏ hàng của bạn</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={closeCart} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 italic">
                  Chưa có sản phẩm nào...
                </div>
              ) : (
                items.map((item, index) => (
                  // Thêm index vào key để đảm bảo tính duy nhất tuyệt đối
                  <motion.div layout key={`${item.id}-${index}`} className="flex gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-white/5 border border-border/40 group">
                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-border/50 shrink-0">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold leading-tight line-clamp-2 uppercase">{item.name}</h3>
                        <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-rose-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-border/50 rounded-full p-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10"><Minus className="h-3 w-3" /></button>
                          <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10"><Plus className="h-3 w-3" /></button>
                        </div>
                        <span className="font-black text-orange-600">{(Number(item.price) * item.quantity).toLocaleString()}đ</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-8 border-t border-border/50 space-y-4 bg-slate-50/50 dark:bg-white/5">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Tổng thanh toán</span>
                <span className="text-3xl font-black text-foreground leading-none">{totalPrice().toLocaleString()}đ</span>
              </div>
              <Button size="lg" className="w-full h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:-translate-y-1 transition-all border-0">
                Thanh toán ngay
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}