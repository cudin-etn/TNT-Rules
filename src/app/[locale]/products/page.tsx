import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Link } from "@/i18n/routing";

type ProductRow = {
  id: string | number;
  slug: string;
  name?: string | null;
  description?: string | null;
  price?: number | string | null;
  images?: unknown;
  image_url?: unknown;
};

export const revalidate = 0;

export default async function ProductsPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return <div>Có lỗi xảy ra khi tải sản phẩm.</div>;

  const productRows = (products ?? []) as ProductRow[];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-black mb-8 tracking-tight">
        Tất cả mồi câu
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {productRows.map((product) => {
          // Image URL fallback: supports string URL, JSON-stringified array, or string[]
          const getFirstImageUrl = (images: unknown): string => {
            const fallback = "/images/placeholder.png";
            if (!images) return fallback;

            // Case: already an array of strings
            if (Array.isArray(images)) {
              const first = images.find((x) => typeof x === "string" && x.trim() !== "");
              return typeof first === "string" ? first.trim() : fallback;
            }

            // Case: a single string (either URL or JSON array)
            if (typeof images === "string") {
              const s = images.trim();
              if (!s) return fallback;

              // Try parse as JSON array
              if (s.startsWith("[") && s.endsWith("]")) {
                try {
                  const parsed = JSON.parse(s);
                  if (Array.isArray(parsed)) {
                    const first = parsed.find((x) => typeof x === "string" && x.trim() !== "");
                    return typeof first === "string" ? first.trim() : fallback;
                  }
                } catch {
                  // fall through to treat as plain URL
                }
              }

              return s;
            }

            return fallback;
          };

          const imgUrl = getFirstImageUrl(product.images ?? product.image_url);
          const priceNumber = Number(product.price) || 0;

          return (
            <Link href={`/products/${product.slug}`} key={product.id} className="group flex flex-col bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-white/10 overflow-hidden hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1">
              
              <div className="relative aspect-square bg-muted overflow-hidden">
                <Image 
                  src={imgUrl} 
                  alt={product.name || "Sản phẩm"} 
                  fill 
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-sm md:text-base line-clamp-2 mb-1 group-hover:text-orange-500 transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 flex-1">
                  {product.description}
                </p>
                <div className="font-black text-orange-600 dark:text-orange-500 text-lg">
                  {priceNumber.toLocaleString("vi-VN")} ₫
                </div>
              </div>

            </Link>
          );
        })}
      </div>
    </div>
  );
}