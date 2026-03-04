"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { 
  Home, Fish, Newspaper, Tag, Info, PhoneCall, 
  ChevronDown, Menu, LogOut, UserCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Header() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // --- BẮT ĐẦU LOGIC AUTH ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };
  // --- KẾT THÚC LOGIC AUTH ---

  const navItems = [
    { label: t("home"), href: "/", icon: Home, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-500/20" },
    { 
      label: t("products"), 
      href: "/products", 
      icon: Fish,
      color: "text-orange-600 dark:text-orange-400", 
      bg: "bg-orange-100 dark:bg-orange-500/20",
      children: [
        { label: t("subProducts.nhaiHoi"), href: "/products/nhai-hoi" },
        { label: t("subProducts.caSat"), href: "/products/ca-sat" },
        { label: t("subProducts.moiMem"), href: "/products/moi-mem" },
        { label: t("subProducts.deMay"), href: "/products/de-may" },
        { label: t("subProducts.mu"), href: "/products/mu" },
        { label: t("subProducts.quaTang"), href: "/products/qua-tang" },
      ]
    },
    { label: t("news"), href: "/news", icon: Newspaper, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-500/20" },
    { label: t("promotions"), href: "/promotions", icon: Tag, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-500/20" },
    { label: t("about"), href: "/about", icon: Info, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-500/20" },
    { label: t("contact"), href: "/contact", icon: PhoneCall, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-500/20" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 md:px-8 mx-auto flex h-16 items-center justify-between">
        
        {/* NHÓM TRÁI: MOBILE MENU + LOGO */}
        <div className="flex items-center flex-shrink-0">
          <div className="lg:hidden mr-2">
            <Sheet>
              <SheetTrigger asChild>
                {/* ĐÃ TRẢ LẠI NÚT MENU GỐC */}
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-background/95 backdrop-blur-xl border-r-border/40 w-72">
                <div className="flex flex-col gap-6 mt-10">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="flex items-center gap-3 text-lg font-semibold px-4 py-2 hover:bg-accent rounded-xl transition-colors">
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" className="group relative">
            <div className="relative flex items-center justify-center px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5">
              <div className="relative h-7 w-24 md:h-8 md:w-28 transition-transform duration-300 group-hover:scale-105">
                <Image src="/images/logo.png" alt="TNT Lures Logo" fill className="object-contain" priority />
              </div>
            </div>
          </Link>
        </div>
        
        {/* NHÓM GIỮA: DESKTOP NAV */}
        <nav className="hidden md:flex items-center mx-auto gap-0 lg:gap-1 relative">
          <AnimatePresence>
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const isHovered = hoveredIndex === index;
              const showBg = isHovered || (isActive && hoveredIndex === null);

              return (
                <div 
                  key={item.href}
                  className="relative group shrink-0"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {showBg && (
                    <motion.div
                      layoutId="magic-indicator"
                      className={`absolute inset-0 rounded-lg -z-10 transition-colors duration-500 ${item.bg}`}
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  <Link 
                    href={item.href} 
                    className={`flex items-center gap-1 px-2 lg:px-3 py-2 text-[12px] lg:text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                      isActive || isHovered ? item.color : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5 lg:h-4 lg:w-4 shrink-0" />
                    <span>{item.label}</span>
                    {item.children && <ChevronDown className="h-3 w-3 opacity-50 shrink-0 transition-transform group-hover:rotate-180" />}
                  </Link>

                  {item.children && (
                    <div className="absolute top-full left-0 mt-2 w-48 p-1 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-50">
                      <div className="bg-background/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl overflow-hidden">
                        {item.children.map((child) => (
                          <Link key={child.href} href={child.href} className="block px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </AnimatePresence>
        </nav>

        {/* NHÓM PHẢI: TOOLS (Gọn gàng sạch sẽ) */}
        <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden border border-border/50 p-0 shadow-sm">
                  {user?.user_metadata?.avatar_url ? (
                    <Image src={user.user_metadata.avatar_url} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white font-black text-sm uppercase">
                      {(user?.user_metadata?.full_name || user?.email || "K").charAt(0)}
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <div className="px-3 py-2 border-b border-border/50 mb-1">
                  <p className="text-sm font-bold truncate">{user?.user_metadata?.full_name || "Khách hàng"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuItem onClick={handleLogout} className="text-rose-500 hover:text-rose-600 focus:text-rose-600 cursor-pointer font-medium">
                  <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthModal />
          )}

          <div className="h-4 w-[1px] bg-border mx-0.5 hidden sm:block" />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}