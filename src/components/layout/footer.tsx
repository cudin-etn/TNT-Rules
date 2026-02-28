import { Link } from "@/i18n/routing";
import Image from "next/image";
import { MapPin, Phone, Mail, ShieldCheck, ChevronRight, Facebook, Youtube, Instagram, Truck, CreditCard } from "lucide-react";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export function Footer() {
  return (
    // Đã FIX: Nền bg-slate-50/50 ở Light Theme để thẻ Card trắng đứng lên rõ hơn
    <footer className="relative w-full border-t border-border/40 bg-slate-50/50 dark:bg-background/80 backdrop-blur-xl pt-16 pb-6 mt-10">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* CARD 1: CÔNG TY & SOCIAL */}
          {/* Đã FIX: shadow kết hợp ring-1 để sắc nét tuyệt đối ở Light Theme */}
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-transparent dark:border-white/10 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-none transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(249,115,22,0.3),0_20px_50px_-12px_rgba(249,115,22,0.15)]">
            <Link href="/" className="relative block h-10 w-32 mb-6">
              <Image src="/images/logo.png" alt="TNT Lures" fill className="object-contain dark:brightness-0 dark:invert" />
            </Link>
            <div className="text-sm text-muted-foreground mb-8 space-y-4">
              <p><strong className="text-foreground text-base tracking-tight">CÔNG TY TNHH VFG</strong></p>
              <p className="text-[12px] font-medium">MST: 0110061421 - Cấp ngày 14/07/2022 tại Sở KH&ĐT TP. Hà Nội</p>
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-start gap-3"><MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" /> <span className="font-medium">46 Louis XVI - LK50, KĐT Hoàng Văn Thụ, Hoàng Mai, HN</span></div>
                <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-orange-500 shrink-0" /> <span className="font-medium">0948.610.988 - 0946.646.515</span></div>
                <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-orange-500 shrink-0" /> <span className="font-medium">tntlures.vn@gmail.com</span></div>
              </div>
            </div>
            
            <div className="flex gap-3">
              {[
                { icon: Facebook, color: "hover:bg-[#1877F2]", label: "FB" },
                { icon: Youtube, color: "hover:bg-[#FF0000]", label: "YT" },
                { icon: TikTokIcon, color: "hover:bg-black", label: "TT" },
                { icon: Instagram, color: "hover:bg-[#E4405F]", label: "IG" }
              ].map((s, i) => (
                <Link key={i} href="#" className={`h-11 w-11 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-white/10 text-muted-foreground transition-all hover:text-white hover:-translate-y-1.5 shadow-sm` + " " + s.color}>
                  <s.icon className="h-5 w-5" strokeWidth={2.5} />
                </Link>
              ))}
            </div>
          </div>

          {/* CARD 2: CHÍNH SÁCH */}
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-transparent dark:border-white/10 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-none">
            <h3 className="font-black text-foreground text-lg mb-8 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><ShieldCheck className="h-5 w-5" /></div>
              Hỗ Trợ & Chính Sách
            </h3>
            <ul className="grid grid-cols-1 gap-y-4 text-sm font-bold text-muted-foreground">
              {["Chính sách đổi trả", "Chính sách bảo mật", "Chính sách vận chuyển", "Chính sách kiểm hàng", "Hướng dẫn thanh toán", "Hướng dẫn mua hàng"].map((text, i) => (
                <li key={i} className="group/item">
                  <Link href="#" className="flex items-center hover:text-orange-500 transition-colors">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover/item:bg-orange-500 mr-3 transition-colors" />
                    {text}
                    <ChevronRight className="h-4 w-4 ml-auto opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CARD 3: VẬN CHUYỂN & THANH TOÁN */}
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-transparent dark:border-white/10 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-none flex flex-col justify-between">
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-black text-foreground mb-4 uppercase tracking-widest opacity-70">
                  <Truck className="h-4 w-4 text-emerald-500" /> Vận chuyển nhanh
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[10px] font-black text-muted-foreground uppercase">Viettel Post</div>
                  <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[10px] font-black text-muted-foreground uppercase">GHTK</div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[11px] font-black text-foreground mb-4 uppercase tracking-widest opacity-70">
                  <CreditCard className="h-4 w-4 text-indigo-500" /> Thanh toán linh hoạt
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[10px] font-black text-blue-600">VNPAY</div>
                  <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[10px] font-black text-indigo-600">MB BANK</div>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-100 dark:border-white/5">
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.15em] shadow-sm">
                <ShieldCheck className="h-4 w-4" /> Đã thông báo Bộ Công Thương
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 pt-6 border-t border-slate-200/50 dark:border-white/5 gap-4">
          <span>Copyright © 2026 TNT Lures. All rights reserved.</span>
          <div className="flex items-center gap-1">
            <span>Developed by</span>
            <Link href="https://tdev.site" className="text-foreground hover:text-orange-500 transition-colors">T-Dev</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}