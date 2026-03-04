"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, ShoppingCart, Package, MessageSquare, Settings, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const adminPath = pathname.includes("/admin") ? pathname.slice(pathname.indexOf("/admin")) : pathname;
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/");
      else setLoading(false);
    });
  }, [router]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a]"><Loader2 className="animate-spin h-8 w-8 text-orange-500" /></div>;

  const menu = [
    { name: "Tổng quan", icon: LayoutDashboard, path: "/admin", color: "text-blue-600 dark:text-blue-400", from: "from-blue-500", to: "to-blue-600", shadow: "shadow-blue-500/30" },
    { name: "Đơn hàng", icon: ShoppingCart, path: "/admin/orders", color: "text-orange-600 dark:text-orange-400", from: "from-orange-500", to: "to-orange-600", shadow: "shadow-orange-500/30" },
    { name: "Kho mồi", icon: Package, path: "/admin/products", color: "text-emerald-600 dark:text-emerald-400", from: "from-emerald-500", to: "to-emerald-600", shadow: "shadow-emerald-500/30" },
    { name: "Chat đa kênh", icon: MessageSquare, path: "/admin/chat", color: "text-purple-600 dark:text-purple-400", from: "from-purple-500", to: "to-purple-600", shadow: "shadow-purple-500/30" },
    { name: "Cài đặt", icon: Settings, path: "/admin/settings", color: "text-slate-600 dark:text-slate-400", from: "from-slate-500", to: "to-slate-600", shadow: "shadow-slate-500/30" },
  ];

  return (
    <>
      {/* ĐỘC CHIÊU: Ép ẩn Header/Footer của trang chủ và khóa cuộn nền */}
      <style dangerouslySetInnerHTML={{ __html: `
        header, footer { display: none !important; }
        body { overflow: hidden !important; }
      `}} />

      <div className="flex h-screen w-full overflow-hidden relative bg-slate-50 dark:bg-[#0f172a]">
        
        {/* NỀN GRADIENT: Trong trẻo cho Light, Sáng sủa hơn cho Dark */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-500/30 dark:bg-blue-500/40 rounded-full blur-[120px]" />
          <div className="absolute top-[15%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-500/30 dark:bg-fuchsia-400/30 rounded-full blur-[140px]" />
          <div className="absolute -bottom-[10%] left-[5%] w-[45%] h-[45%] bg-orange-500/30 dark:bg-orange-500/30 rounded-full blur-[120px]" />
          <div className="absolute -bottom-[15%] -right-[10%] w-[55%] h-[55%] bg-cyan-400/30 dark:bg-cyan-400/30 rounded-full blur-[140px]" />
        </div>

        {/* SIDEBAR */}
        <aside className="relative z-10 w-[260px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-r border-white/50 dark:border-white/10 flex flex-col shadow-lg">
          <div className="h-20 flex items-center px-8 shrink-0">
            <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">
              TNT Admin
            </span>
          </div>
          <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
            <AnimatePresence>
              {menu.map((item, index) => {
                const isActive = adminPath === item.path || (item.path !== "/admin" && adminPath.startsWith(item.path));
                const isHovered = hoveredIndex === index;
                const showBg = isHovered || (isActive && hoveredIndex === null);

                return (
                  <div 
                    key={item.path}
                    className="relative group"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {showBg && (
                      <motion.div
                        layoutId="admin-sidebar-indicator"
                        className={`absolute inset-0 rounded-xl -z-10 bg-gradient-to-r ${item.from} ${item.to} shadow-md ${item.shadow}`}
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Link 
                      href={item.path} 
                      className={`relative z-10 flex items-center gap-3 px-4 py-2 rounded-xl text-[13px] font-medium transition-colors duration-300 ${
                        showBg ? "text-white" : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div className={`transition-transform duration-300 ${showBg ? "text-white" : item.color}`}>
                        <item.icon className="h-4 w-4" strokeWidth={showBg ? 2.5 : 2} />
                      </div>
                      {item.name}
                    </Link>
                  </div>
                )
              })}
            </AnimatePresence>
          </nav>
        </aside>

      {/* MAIN CONTENT */}
        <main className="relative z-10 flex-1 overflow-y-auto p-8 scroll-smooth">
          {/* THÊM h-full VÀO ĐÂY */}
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
        
      </div>
    </>
  );
}