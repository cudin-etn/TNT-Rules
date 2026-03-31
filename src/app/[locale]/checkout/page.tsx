"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ChevronLeft, MapPin, Phone, User, QrCode, CheckCircle2, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, removeItem } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "qr">("form");
  const [orderInfo, setOrderInfo] = useState({ code: "", total: 0 });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: ""
  });

  // Nếu giỏ hàng trống mà cố vào trang này thì đá về kho mồi
  useEffect(() => {
    if (items.length === 0 && step === "form") {
      router.replace("/products");
    }
  }, [items, router, step]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderCode = "TNT-" + Math.floor(10000 + Math.random() * 90000);
      const totalAmount = totalPrice();

      // 1. GỌI AI ĐỌC GHI CHÚ TRƯỚC KHI LƯU
      let aiTags: string[] = [];
      if (formData.note.trim() !== "") {
        const aiRes = await fetch("/api/analyze-note", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note: formData.note })
        });
        if (aiRes.ok) {
          const aiData = await aiRes.json();
          aiTags = aiData.tags || [];
        }
      }

      // 2. LƯU VÀO BẢNG ORDERS (Đã nhét thêm mảng ai_tags vào)
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_code: orderCode,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          customer_note: formData.note,
          ai_tags: aiTags, // <-- Lõi ăn tiền ở đây
          total_amount: totalAmount,
          status: "pending",
          payment_method: "bank_transfer"
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. LƯU CHI TIẾT ĐƠN HÀNG
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      // 4. CHUYỂN SANG BƯỚC QUÉT QR
      setOrderInfo({ code: orderCode, total: totalAmount });
      setStep("qr");

    } catch (error) {
      console.error("Lỗi tạo đơn:", error);
      alert("Có lỗi xảy ra khi lên đơn. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step === "form") return null;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 min-h-[calc(100vh-10rem)]">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors mb-8">
        <ChevronLeft className="h-4 w-4" /> Quay lại kho hàng
      </Link>

      {step === "form" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/50 dark:border-white/10 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="text-orange-500 h-6 w-6" /> Thông tin nhận hàng
              </h2>
              
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" /> Họ và tên *
                    </label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-[14px]" placeholder="Vd: Nguyễn Văn A" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-emerald-500" /> Số điện thoại *
                    </label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-[14px]" placeholder="Vd: 0912 345 678" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-rose-500" /> Địa chỉ giao hàng *
                  </label>
                  <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-[14px]" placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố" />
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Ghi chú thêm (Nếu có)</label>
                  <textarea value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full h-24 p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-[14px] resize-none" placeholder="Vd: Giao ngoài giờ hành chính, gọi trước khi giao..." />
                </div>
              </form>
            </div>
          </div>

          {/* CỘT PHẢI: BILL & NÚT THANH TOÁN */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/50 dark:border-white/10 shadow-sm sticky top-24">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200/50">
                      <Image src={String(item.image_url || '/images/placeholder.png')} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</div>
                      <div className="text-[12px] text-slate-500">Số lượng: {item.quantity}</div>
                    </div>
                    <div className="text-[13px] font-black text-slate-900 dark:text-white">
                      {(Number(item.price) * (item.quantity || 1)).toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-white/10 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Tạm tính</span>
                  <span className="font-bold">{Number(totalPrice()).toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Phí vận chuyển</span>
                  <span className="font-bold text-emerald-600">Miễn phí</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-black">Tổng cộng</span>
                  <span className="text-2xl font-black text-orange-600">{Number(totalPrice()).toLocaleString("vi-VN")} ₫</span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="checkout-form"
                disabled={loading}
                className="group w-full h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-black text-base shadow-xl shadow-orange-500/20 transition-all hover:-translate-y-1 hover:shadow-orange-500/40"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" /> Đặt hàng & Thanh toán
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* BƯỚC 2: HIỂN THỊ MÃ QR */
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-emerald-500/30 shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)] text-center animate-in zoom-in-95 duration-500">
            <div className="h-20 w-20 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
              Lên đơn thành công!
            </h2>
            <p className="text-slate-600 dark:text-slate-300 font-medium mb-8">
              Mã đơn hàng của bạn là: <span className="font-black text-orange-600">{orderInfo.code}</span>
            </p>

            <div className="bg-white p-6 rounded-3xl inline-block shadow-lg border border-slate-100 mb-8 relative group">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />
              {/* Dùng API VietQR tạo mã động: Truyền số tiền và nội dung CK */}
              {/* MBBank (Mã BIN 970422), STK lấy demo là 0948610988 của TNT */}
              <Image 
                  src={`https://img.vietqr.io/image/970422-7901888881988-compact2.png?amount=${orderInfo.total}&addInfo=${orderInfo.code}&accountName=TNT LURES`}
                alt="QR Code Thanh Toán"
                width={250}
                height={250}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
              <p>Mở App Ngân hàng bất kỳ để quét mã QR phía trên.</p>
              <p>Hệ thống sẽ tự động xác nhận đơn ngay khi nhận được thanh toán.</p>
            </div>

            <div className="mt-10">
              <Button 
                onClick={() => {
                  useCartStore.setState({ items: [] }); // Dọn sạch giỏ hàng
                  router.push("/products");
                }} 
                variant="outline" 
                className="rounded-xl h-12 px-8 font-bold border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}