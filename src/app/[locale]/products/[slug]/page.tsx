import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import { AddToCartGroup } from "@/components/add-to-cart-group";

export const revalidate = 0;

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const params = await props.params;
  const slug = params.slug;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-8 min-h-[calc(100vh-4rem)]">
      <Link href="/products" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-orange-500 transition-colors mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại kho hàng
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <div className="relative w-full aspect-[4/3] md:aspect-square bg-muted rounded-[2rem] border border-border/50 overflow-hidden shadow-2xl">
          <Image 
            src={product.image_url} 
            alt={product.name} 
            fill 
            className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
            priority
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-500/10 rounded-full border border-orange-500/20">
              {product.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
            {product.name}
          </h1>

          <div className="text-3xl md:text-4xl font-extrabold text-orange-600 mb-6">
            {product.price.toLocaleString('vi-VN')} <span className="text-2xl underline align-top">đ</span>
          </div>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 border-b border-border/50 pb-8">
            {product.description}
          </p>

          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <ShieldCheck className="mr-3 h-5 w-5 text-green-500" /> Sản phẩm chính hãng 100%
            </div>
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <Truck className="mr-3 h-5 w-5 text-blue-500" /> Giao hàng hỏa tốc toàn quốc
            </div>
          </div>

          {/* ĐÃ SỬA: Truyền nguyên object 'product' thay vì chỉ productName */}
          <AddToCartGroup product={product} />
        </div>
      </div>
    </div>
  );
}