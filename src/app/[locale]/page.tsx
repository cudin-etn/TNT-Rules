import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Sparkles, Fish, ShieldCheck, ArrowRight } from "lucide-react";
import { HeroSlider } from "@/components/hero-slider";

export default function Home() {
  const t = useTranslations("Hero");

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] overflow-hidden bg-transparent py-6 md:py-8">
      
      {/* SECTION 1: NỘI DUNG CHỮ */}
      <section className="flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto z-10 px-6">
        
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-1.5 text-[11px] md:text-xs font-bold text-orange-600 dark:text-orange-400 mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          {t("badge")}
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-white/40 leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {t("title")}
        </h1>

        <p className="text-sm md:text-lg text-muted-foreground max-w-xl leading-relaxed mb-8 md:mb-10 px-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          {t("description")}
        </p>

        {/* Nút bấm tự động dàn hàng ngang/dọc theo thiết bị */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-2 sm:px-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Button asChild size="lg" className="group h-14 sm:h-12 rounded-2xl sm:rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white border-0 px-8 text-sm font-bold shadow-xl shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-orange-500/40">
            <Link href="/products" className="flex items-center justify-center">
              <Fish className="mr-2 h-5 w-5 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12" />
              {t("primaryBtn")}
              {/* Mũi tên chỉ hiện trên màn hình lớn */}
              <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 hidden sm:inline-block" />
            </Link>
          </Button>
          
          <Button asChild size="lg" className="group h-14 sm:h-12 rounded-2xl sm:rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 px-8 text-sm font-bold shadow-xl shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-500/40">
            <Link href="/ai-chat" className="flex items-center justify-center">
              <Sparkles className="mr-2 h-5 w-5 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12" /> 
              {t("secondaryBtn")}
            </Link>
          </Button>
        </div>
      </section>

     {/* SECTION 2: SLIDER (Hạ z-index xuống 0 để không đè Giỏ hàng) */}
      <section className="w-full max-w-5xl z-0 px-4 mt-8 md:mt-4 shrink-0">
        <HeroSlider />
      </section>

      {/* Trang trí nền */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.03)_0%,transparent_70%)] pointer-events-none -z-10" />
    </div>
  );
}