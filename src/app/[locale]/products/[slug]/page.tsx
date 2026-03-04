"use client";

import { use, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Loader2,
  Package,
  RefreshCcw,
  Headphones,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AddToCartGroup } from "@/components/add-to-cart-group";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number | string;
  original_price?: number | string;
  description: string;
  images: string[] | string;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale?: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  // toast giữ lại nếu anh muốn, hoặc bỏ cũng OK
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        setProduct(null);
        setLoading(false);
        router.replace("/products");
        return;
      }

      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [slug, router]);

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
            const first = parsed.find(
              (x) => typeof x === "string" && x.trim() !== ""
            );
            return typeof first === "string" ? first.trim() : fallback;
          }
        } catch {
          // fall through
        }
      }
      return s;
    }

    return fallback;
  };

  const finalImageSrc = useMemo(() => {
    if (imgError) return "/images/placeholder.png";
    return getFirstImageUrl(product?.images);
  }, [product?.images, imgError]);

  const priceNumber = useMemo(() => Number(product?.price) || 0, [product?.price]);
  const originalPriceNumber = useMemo(
    () => Number(product?.original_price) || 0,
    [product?.original_price]
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
      </div>
    );
  }

  // ✅ Guard này làm TS hiểu product chắc chắn không null -> hết đỏ ở AddToCartGroup
  if (!product) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 md:px-8 min-h-screen relative">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors mb-8"
      >
        <ChevronLeft className="h-4 w-4" />
        Quay lại kho hàng
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* IMAGE */}
        <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-white/60 dark:bg-slate-900/40 border border-border/50 shadow-sm">
          <Image
            src={finalImageSrc}
            alt={product.name}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
            priority
          />
        </div>

        {/* INFO */}
        <div className="flex flex-col justify-center">
          <div className="mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black bg-orange-500/10 text-orange-600 border border-orange-500/20">
              {product.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-black text-orange-600 dark:text-orange-500">
              {priceNumber.toLocaleString("vi-VN")} ₫
            </span>
            {originalPriceNumber > priceNumber && (
              <span className="text-sm font-medium text-slate-400 line-through mt-1">
                {originalPriceNumber.toLocaleString("vi-VN")} ₫
              </span>
            )}
          </div>

          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {product.description}
          </p>

         {/* CTA */}
          <div className="mb-8">
            <AddToCartGroup product={product!} />
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
            <div className="rounded-2xl border border-border/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white mb-1">
                <Package className="h-4 w-4 text-orange-500" /> Đóng gói chuẩn
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Hàng được đóng gói kỹ, hỗ trợ kiểm tra khi nhận.
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white mb-1">
                <RefreshCcw className="h-4 w-4 text-emerald-500" /> Đổi trả linh hoạt
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Hỗ trợ đổi trả theo chính sách. Nhắn chat để được hướng dẫn nhanh.
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white mb-1">
                <Headphones className="h-4 w-4 text-indigo-500" /> Tư vấn 1-1
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Gợi ý mồi theo loại cá, địa hình và thời điểm câu.
              </p>
            </div>
          </div>

          {/* BULLETS */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <ShieldCheck className="mr-3 h-5 w-5 text-green-500" /> Sản phẩm
              chính hãng 100%
            </div>
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <Truck className="mr-3 h-5 w-5 text-blue-500" /> Giao hàng hỏa tốc
              toàn quốc
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl px-5 py-3 flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-black text-slate-900 dark:text-white">
                Đã vào túi đồ
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[240px]">
                {product.name}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}