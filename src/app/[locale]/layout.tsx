import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css"; // Đã sửa lại đường dẫn trỏ ra ngoài
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingCart } from "@/components/floating-cart";
import { CartDrawer } from "@/components/cart-drawer";
import { FloatingAI } from "@/components/floating-ai";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TNT Lures - Đồ Câu Cao Cấp",
  description: "Chuyên thiết bị và mồi câu cá",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Next.js 15 yêu cầu params là Promise
}>) {
  const { locale } = await params;

  // Kiểm tra nếu ngôn ngữ không hợp lệ thì báo lỗi 404
  if (!routing.locales.includes(locale as "vi" | "en")) {
    notFound();
  }

  // Lấy từ điển dựa trên ngôn ngữ
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
           {/* SIÊU PHẨM BACKGROUND: VIBRANT MESH + SVG PATTERN */}
        <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-[#020617] overflow-hidden pointer-events-none">
          
          {/* TẦNG 1: MESH GRADIENT (Lõi màu rực rỡ) */}
          <div className="absolute inset-0 z-0">
            <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-500/40 dark:bg-blue-600/30 rounded-full blur-[120px]" />
            <div className="absolute top-[15%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-500/40 dark:bg-fuchsia-500/30 rounded-full blur-[140px]" />
            <div className="absolute -bottom-[10%] left-[5%] w-[45%] h-[45%] bg-orange-500/40 dark:bg-orange-600/30 rounded-full blur-[120px]" />
            <div className="absolute -bottom-[15%] -right-[10%] w-[55%] h-[55%] bg-cyan-400/40 dark:bg-cyan-500/30 rounded-full blur-[140px]" />
          </div>

          {/* TẦNG 2: LỚP PHỦ ÉP MỎNG (Kìm màu lại 1 chút để dễ đọc chữ, tuyệt đối không dùng blur) */}
          <div className="absolute inset-0 z-10 bg-white/40 dark:bg-black/40 transition-colors duration-500"></div>

          {/* TẦNG 3: SVG PATTERN (Nằm trên cùng, giữ nguyên thông số chuẩn của anh) */}
          <div 
            className="absolute inset-0 z-20 bg-repeat opacity-60 dark:opacity-30 dark:invert transition-all duration-500"
            style={{ backgroundImage: "url('/images/bg-pattern.svg')" }}
          ></div>
          
        </div>

            <Header />
            
            <main className="flex-1">
              {children}
            </main>
            
            <Footer />
            <FloatingCart />
            <FloatingAI />
            <CartDrawer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}