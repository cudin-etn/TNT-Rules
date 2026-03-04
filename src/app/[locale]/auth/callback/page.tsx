"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  useEffect(() => {
    let isMounted = true;

    const handleAuth = async () => {
      // Chờ Supabase nuốt cái token trên URL vào Local Storage
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && isMounted) {
        // Có phiên đăng nhập -> Dùng window.location để ép reload trang chủ, xóa sạch rác trên URL
        window.location.href = "/vi";
      }
    };

    handleAuth();

    // Phương án dự phòng 1: Bắt sự kiện Real-time
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && isMounted) {
        window.location.href = "/vi";
      }
    });

    // Phương án dự phòng 2: Nếu mạng lag kẹt quá 3 giây, tự động sút về trang chủ
    const timer = setTimeout(() => {
      if (isMounted) window.location.href = "/vi";
    }, 3000);

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
        <p className="font-bold text-lg text-foreground animate-pulse tracking-tight">
          Đang xác thực tài khoản Google...
        </p>
      </div>
    </div>
  );
}