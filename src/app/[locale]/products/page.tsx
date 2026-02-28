import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Link } from "@/i18n/routing";

// Bật chế độ tự động cập nhật data mới nhất (không cache cứng)
export const revalidate = 0; 

export default async function ProductsPage() {
  // 1. Dùng hàm này để móc toàn bộ dữ liệu từ bảng 'products'
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Lỗi lấy dữ liệu:", error);
    return <div>Có lỗi xảy ra khi tải sản phẩm.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-black mb-8 tracking-tight">
        Tất cả mồi câu
      </h1>
      
      {/* 2. Dàn trang dạng Lưới (Grid) - Tự động co giãn theo thiết bị */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products?.map((product) => (
          <Link href={`/products/${product.slug}`} key={product.id} className="group flex flex-col bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            
            {/* Ảnh sản phẩm */}
            <div className="relative aspect-square bg-muted overflow-hidden">
              <Image 
                src={product.image_url} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            </div>

            {/* Thông tin sản phẩm */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-sm md:text-base line-clamp-2 mb-1 group-hover:text-orange-500 transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                {product.description}
              </p>
              <div className="font-black text-orange-600 text-lg">
                {product.price.toLocaleString('vi-VN')} ₫
              </div>
            </div>

          </Link>
        ))}
      </div>
    </div>
  );
}