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
            {/* Background SVG + Google Ambient Style */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-background overflow-hidden">
              
              {/* LỚP 1: SVG Pattern - Tăng độ đậm lên một chút (60% Light / 30% Dark) */}
              <div 
                className="absolute inset-0 z-0 bg-repeat opacity-60 dark:opacity-30 dark:invert transition-all duration-300"
                style={{ backgroundImage: "url('/images/bg-pattern.svg')" }}
              ></div>
              
              {/* LỚP 2: Ánh sáng góc trên trái (Tone Xanh Google) */}
              <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/30 dark:bg-blue-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen transition-all duration-500"></div>

              {/* LỚP 3: Ánh sáng góc dưới phải (Tone Đỏ/Hồng Google) */}
              <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-rose-400/30 dark:bg-rose-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen transition-all duration-500"></div>
              
              {/* LỚP 4: Ép mỏng lớp phủ, XÓA HẲN backdrop-blur để không bị nhòe SVG */}
              <div className="absolute inset-0 z-1 bg-background/20 dark:bg-background/40"></div>
            </div>

            <Header />
            
            <main className="flex-1">
              {children}
            </main>
            
            <Footer />
            <FloatingCart />
            <CartDrawer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}