"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ShoppingBag, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";

type CartProduct = {
  id?: string | number;
  name?: string | null;
  slug?: string | null;
  price?: number | string | null;
  images?: unknown;
  image_url?: unknown;
  [key: string]: unknown;
};

export function AddToCartGroup({ product }: { product: CartProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const productName = useMemo(() => (product?.name ? String(product.name) : "Sản phẩm"), [product]);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
  addItem(product);
  setShowToast(true);
  setTimeout(() => setShowToast(false), 3000);
};

const handleBuyNow = () => {
  addItem(product);
  openCart();
};

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 w-full relative z-10">
        <Button 
          onClick={handleAddToCart}
          size="lg" 
          className="group flex-1 h-14 rounded-2xl sm:rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-base font-bold shadow-xl shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-500/40 border-0 focus-visible:ring-2 focus-visible:ring-purple-400/40"
        >
          <ShoppingCart className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-rotate-12 group-hover:animate-bounce" /> 
          Thêm vào giỏ
        </Button>

        <Button 
          onClick={handleBuyNow}
          size="lg" 
          className="group flex-1 h-14 rounded-2xl sm:rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white text-base font-bold shadow-xl shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-orange-500/40 border-0 focus-visible:ring-2 focus-visible:ring-orange-400/40"
        >
          <Zap className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:animate-bounce" /> 
          Mua ngay
        </Button>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(5px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-6 py-4 rounded-full bg-slate-900/95 dark:bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(249,115,22,0.6)]"
          >
            <div className="relative flex items-center justify-center shrink-0">
               <div className="absolute inset-0 bg-orange-500/40 blur-[8px] rounded-full scale-150 animate-pulse" />
               <ShoppingBag className="h-6 w-6 text-orange-500 dark:text-orange-600 relative z-10 animate-bounce" strokeWidth={2.5} />
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-white dark:text-slate-900 leading-tight">
                Đã vào túi đồ
              </span>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 truncate max-w-[200px] md:max-w-[300px]">
                {productName}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}