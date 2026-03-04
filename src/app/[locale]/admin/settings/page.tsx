"use client";

import { useState } from "react";
import { Save, KeyRound, Truck, ShieldCheck, Link2, Sparkles } from "lucide-react";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("TNT Lures");
  const [hotline, setHotline] = useState("090x xxx xxx");
  const [address, setAddress] = useState("TP. Hồ Chí Minh");
  const [shippingNote, setShippingNote] = useState("Giao nhanh toàn quốc • Cho kiểm tra khi nhận");
  const [aiMode, setAiMode] = useState<"demo" | "live">("demo");

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Cài đặt
          </h1>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
            Cấu hình demo. Khi ký deal sẽ nối thật (ship, AI, đa kênh).
          </p>
        </div>

        <button className="h-10 px-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-[12px] shadow hover:opacity-90 transition inline-flex items-center gap-2">
          <Save className="h-3.5 w-3.5" />
          Lưu
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Store info */}
        <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm p-4">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 dark:text-white">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Thông tin cửa hàng
          </div>

          <div className="mt-4 space-y-3">
            <Field label="Tên cửa hàng" value={storeName} onChange={setStoreName} />
            <Field label="Hotline" value={hotline} onChange={setHotline} />
            <Field label="Địa chỉ" value={address} onChange={setAddress} />
          </div>
        </div>

        {/* Shipping */}
        <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm p-4">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 dark:text-white">
            <Truck className="h-4 w-4 text-blue-500" />
            Vận chuyển
          </div>

          <div className="mt-4 space-y-3">
            <Field label="Ghi chú hiển thị" value={shippingNote} onChange={setShippingNote} />
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              (Demo) Khi ký deal sẽ tích hợp đối tác vận chuyển + tracking.
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm p-4">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 dark:text-white">
            <Link2 className="h-4 w-4 text-purple-500" />
            Kết nối kênh (đa kênh)
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ToggleCard title="Zalo OA" subtitle="Chưa kết nối" />
            <ToggleCard title="Facebook Page" subtitle="Chưa kết nối" />
            <ToggleCard title="Instagram" subtitle="Chưa kết nối" />
          </div>
        </div>

        {/* AI */}
        <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm p-4">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 dark:text-white">
            <Sparkles className="h-4 w-4 text-orange-500" />
            AI tư vấn
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2.5">
              <div>
                <div className="text-[13px] font-semibold text-slate-900 dark:text-white">Chế độ</div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">demo (mock) / live (gọi model thật)</div>
              </div>
              <select
                value={aiMode}
                onChange={(e) => setAiMode(e.target.value as any)}
                className="h-9 px-3 rounded-xl bg-transparent border border-white/50 dark:border-white/10 font-semibold text-[13px]"
              >
                <option value="demo">demo</option>
                <option value="live">live</option>
              </select>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2.5">
              <KeyRound className="h-3.5 w-3.5 text-slate-500" />
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                API key sẽ cấu hình ở server env (không nhập trực tiếp tại UI).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-4 rounded-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 outline-none text-[13px] font-semibold"
      />
    </label>
  );
}

function ToggleCard({ title, subtitle }: { title: string; subtitle: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`text-left rounded-xl border backdrop-blur-xl p-3 transition ${
        on
          ? "bg-emerald-500/10 border-emerald-500/20"
          : "bg-white/70 dark:bg-white/5 border-white/40 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/10"
      }`}
    >
      <div className="text-[13px] font-semibold text-slate-900 dark:text-white">{title}</div>
      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
        {on ? "Đã bật (demo)" : subtitle}
      </div>
    </button>
  );
}