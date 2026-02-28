"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { UserCircle2, Chrome } from "lucide-react";

export function AuthModal() {
  const t = useTranslations("Auth");

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
              <TabsTrigger value="login">{t("login")}</TabsTrigger>
              <TabsTrigger value="register">{t("register")}</TabsTrigger>
            </TabsList>

            {/* FORM ĐĂNG NHẬP */}
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" type="email" placeholder="name@example.com" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input id="password" type="password" className="bg-background/50" />
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                {t("submitLogin")}
              </Button>
            </TabsContent>

            {/* FORM ĐĂNG KÝ */}
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label>{t("fullName")}</Label>
                <Input placeholder="Nguyễn Văn A" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label>{t("email")}</Label>
                <Input type="email" placeholder="name@example.com" className="bg-background/50" />
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
                <Input type="password" className="bg-background/50" />
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                {t("submitRegister")}
              </Button>
            </TabsContent>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* ĐĂNG NHẬP GOOGLE */}
            <Button variant="outline" className="w-full bg-background/50 hover:bg-background/80 transition-all border-border/50">
              <Chrome className="mr-2 h-4 w-4 text-orange-500" />
              {t("googleLogin")}
            </Button>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}