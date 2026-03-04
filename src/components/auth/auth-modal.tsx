"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { UserCircle2, Chrome, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function AuthModal() {
  const t = useTranslations("Auth");
  
  // State quản lý form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Đăng nhập Google
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/vi/auth/callback` }, // Đã fix thêm /vi
    });
    if (error) setMessage({ type: "error", text: "Lỗi kết nối Google!" });
  };

  // Đăng nhập Email/Pass
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage({ type: "", text: "" });
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage({ type: "error", text: "Sai email hoặc mật khẩu!" });
    } else {
      window.location.reload(); // F5 để Header tự nhận diện Avatar/User
    }
    setLoading(false);
  };

  // Đăng ký Email/Pass
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage({ type: "", text: "" });

    const { error } = await supabase.auth.signUp({
      email, 
      password,
      options: { data: { full_name: fullName } } // Lưu thêm tên user
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Đăng ký thành công! Hãy chuyển sang Đăng nhập." });
      // Reset form
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
          <UserCircle2 className="h-5 w-5 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none bg-background/80 backdrop-blur-2xl shadow-2xl [&>button]:hidden">
        <div className="bg-gradient-to-br from-orange-500/10 via-transparent to-purple-500/10 p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
              <TabsTrigger value="login" onClick={() => setMessage({type: "", text: ""})}>{t("login")}</TabsTrigger>
              <TabsTrigger value="register" onClick={() => setMessage({type: "", text: ""})}>{t("register")}</TabsTrigger>
            </TabsList>

            {/* HIỂN THỊ THÔNG BÁO LỖI / THÀNH CÔNG */}
            {message.text && (
              <div className={`p-3 mb-4 text-sm rounded-lg font-medium ${message.type === "error" ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                {message.text}
              </div>
            )}

            {/* FORM ĐĂNG NHẬP */}
            <TabsContent value="login">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t("email")}</Label>
                  <Input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">{t("password")}</Label>
                  <Input id="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-background/50" />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("submitLogin")}
                </Button>
              </form>
            </TabsContent>

            {/* FORM ĐĂNG KÝ */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("fullName")}</Label>
                  <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyễn Văn A" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>{t("email")}</Label>
                  <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>{t("gender")}</Label>
                  <RadioGroup defaultValue="male" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="font-normal cursor-pointer">{t("male")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="font-normal cursor-pointer">{t("female")}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>{t("password")}</Label>
                  <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="bg-background/50" />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("submitRegister")}
                </Button>
              </form>
            </TabsContent>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><Separator /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-muted-foreground">Hoặc</span>
              </div>
            </div>

            {/* ĐĂNG NHẬP GOOGLE */}
            <Button onClick={handleGoogleLogin} type="button" variant="outline" className="w-full bg-background/50 hover:bg-background/80 transition-all border-border/50">
              <Chrome className="mr-2 h-4 w-4 text-orange-500" />
              {t("googleLogin")}
            </Button>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}