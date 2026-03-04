"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, PackageOpen, ArrowRight, Store } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } = useCartStore();

  const totalQty = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  const handleContinueShopping = () => {
    closeCart();
    router.push("/products");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[80] backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer Container */}
          <motion.aside
            initial={{ x: "100%", scale: 0.985, opacity: 0 }}
            animate={{ x: 0, scale: 1, opacity: 1 }}
            exit={{ x: "100%", scale: 0.985, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-4 bottom-4 right-4 w-[calc(100%-2rem)] sm:w-[420px] z-[90] rounded-[28px] shadow-2xl flex flex-col overflow-hidden border border-white/20 dark:border-white/10"
          >
            {/* LỚP NỀN MESH GRADIENT */}
            <div className="absolute inset-0 z-0 bg-slate-50 dark:bg-[#0f172a] pointer-events-none">
              <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-500/30 rounded-full blur-[100px]" />
              <div className="absolute top-[15%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-500/30 rounded-full blur-[120px]" />
              <div className="absolute -bottom-[10%] left-[5%] w-[45%] h-[45%] bg-orange-500/30 rounded-full blur-[100px]" />
              <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col h-full w-full">
              {/* Header */}
              <div className="p-5 border-b border-white/30 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-black tracking-tight leading-none text-slate-800 dark:text-white">
                      Giỏ Hàng
                    </h2>
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                      {totalQty} sản phẩm
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeCart}
                  className="rounded-xl bg-white/50 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 shadow-sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-14 text-slate-600 dark:text-slate-300">
                    <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                      <ShoppingBag className="h-10 w-10 opacity-30" />
                    </div>
                    <p className="font-medium text-[13px]">Chưa có sản phẩm nào</p>
                    <Button
                      onClick={handleContinueShopping}
                      variant="outline"
                      className="group rounded-full font-bold text-xs bg-white/70 dark:bg-white/5 border-white/40 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/10 shadow-sm"
                    >
                      <Store className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                      Tiếp Tục Mua Sắm
                    </Button>
                  </div>
                ) : (
                  items.map((item, index) => {
                    const uniqueKey = item.id ? `${item.id}-${index}` : `cart-item-${index}`;
                    const safePrice = Number(item.price) || 0;
                    const safeQty = Number(item.quantity) || 1;

                    const getFirstImageUrl = (images: unknown): string => {
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
                    };

                    const itemWithImages = item as typeof item & { images?: unknown; image_url?: unknown; };
                    const imgSrc = getFirstImageUrl(itemWithImages.images ?? itemWithImages.image_url);
                    const hasImage = typeof imgSrc === "string" && imgSrc.trim() !== "";

                    return (
                      <motion.div
                        layout
                        key={uniqueKey}
                        // Viền gradient 1px
                        className="group rounded-2xl p-[1px] bg-gradient-to-br from-orange-500/30 to-rose-500/30 shadow-sm"
                      >
                        <div className="relative flex gap-3 p-3 rounded-[15px] bg-white/95 dark:bg-slate-900/95 overflow-hidden">
                          {/* Ảnh */}
                          <div className="relative h-20 w-20 rounded-[10px] bg-slate-100 dark:bg-black/50 overflow-hidden shrink-0 flex items-center justify-center border border-white/50 dark:border-white/5">
                            {hasImage ? (
                              <Image src={imgSrc} alt={item.name || "Sản phẩm"} fill className="object-cover transition-transform group-hover:scale-110" />
                            ) : (
                              <PackageOpen className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="font-bold text-[13px] leading-tight text-slate-900 dark:text-white line-clamp-2 pr-2">
                                  {item.name || "Sản phẩm"}
                                </h3>
                                <p className="text-[12px] font-black text-orange-600 mt-1">
                                  {safePrice.toLocaleString("vi-VN")} ₫
                                </p>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.id)}
                                className="h-6 w-6 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 shrink-0"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>

                            {/* Qty */}
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-lg bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm"
                                onClick={() => updateQuantity(item.id, Math.max(1, safeQty - 1))}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </Button>

                              <div className="h-7 min-w-8 px-2 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-black">
                                {safeQty}
                              </div>

                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-lg bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm"
                                onClick={() => updateQuantity(item.id, safeQty + 1)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-4 border-t border-white/30 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-bold text-slate-600 dark:text-slate-400">
                      Tạm tính
                    </span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      {Number(totalPrice()).toLocaleString("vi-VN")} ₫
                    </span>
                  </div>

                  <Button className="w-full h-12 rounded-xl font-black text-[13px] bg-gradient-to-r from-orange-500 to-rose-500 text-white border-0 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all hover:-translate-y-0.5">
                    Thanh toán
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}