"use client";

import { useMemo, useState } from "react";
import { Search, Star, MessageSquare, Phone, MapPin } from "lucide-react";

type Customer = {
  id: string;
  name: string;
  phone: string;
  city: string;
  segment: "VIP" | "Tiềm năng" | "Mới";
  orders: number;
  spent: number;
  lastSeen: string;
  note: string;
};

const mockCustomers: Customer[] = [
  {
    id: "C-001",
    name: "Nguyễn Văn H.",
    phone: "09xx-xxx-321",
    city: "TP.HCM",
    segment: "VIP",
    orders: 18,
    spent: 7850000,
    lastSeen: "Hôm nay",
    note: "Thích nhái hơi, hay mua combo."
  },
  {
    id: "C-002",
    name: "Trần Minh K.",
    phone: "09xx-xxx-110",
    city: "Đồng Nai",
    segment: "Tiềm năng",
    orders: 6,
    spent: 1920000,
    lastSeen: "Hôm qua",
    note: "Quan tâm cá sắt 14g, hỏi nhiều về màu."
  },
  {
    id: "C-003",
    name: "Lê Quốc A.",
    phone: "09xx-xxx-778",
    city: "Cần Thơ",
    segment: "Mới",
    orders: 1,
    spent: 219000,
    lastSeen: "2 ngày trước",
    note: "Lần đầu mua mồi mềm."
  },
  {
    id: "C-004",
    name: "Phạm Thị L.",
    phone: "09xx-xxx-444",
    city: "Bình Dương",
    segment: "Tiềm năng",
    orders: 4,
    spent: 980000,
    lastSeen: "3 ngày trước",
    note: "Hay hỏi chính sách đổi trả."
  }
];

const segmentStyle: Record<Customer["segment"], string> = {
  VIP: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  "Tiềm năng": "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  "Mới": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
};

export default function AdminCustomersPage() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return mockCustomers.filter((c) => {
      if (!kw) return true;
      return (
        c.name.toLowerCase().includes(kw) ||
        c.phone.toLowerCase().includes(kw) ||
        c.city.toLowerCase().includes(kw) ||
        c.id.toLowerCase().includes(kw)
      );
    });
  }, [q]);

  const totalSpent = rows.reduce((s, c) => s + c.spent, 0);
  const vipCount = rows.filter((c) => c.segment === "VIP").length;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Khách hàng
          </h1>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
            CRM demo (mock) để show phân nhóm khách, lịch sử mua và gợi ý chăm sóc.
          </p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-[12px] hover:opacity-90 transition">
          Tạo khách
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Tổng khách hiển thị
          </div>
          <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
            {rows.length}
          </div>
        </div>
        <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            VIP
          </div>
          <div className="mt-1 text-2xl font-semibold text-purple-700 dark:text-purple-300 inline-flex items-center gap-2">
            <Star className="h-4 w-4" />
            {vipCount}
          </div>
        </div>
        <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Tổng chi tiêu (demo)
          </div>
          <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
            {totalSpent.toLocaleString("vi-VN")} ₫
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo tên / SĐT / thành phố / mã..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 outline-none text-[13px]"
          />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-2 font-semibold">Khách</th>
                <th className="py-2.5 px-2 font-semibold">Phân nhóm</th>
                <th className="py-2.5 px-2 font-semibold">Đơn</th>
                <th className="py-2.5 px-2 font-semibold">Chi tiêu</th>
                <th className="py-2.5 px-2 font-semibold">Lần gần nhất</th>
                <th className="py-2.5 px-2 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-white/40 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-2.5 px-2">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {c.name}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {c.phone}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {c.city}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span>{c.id}</span>
                    </div>
                    <div className="mt-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      {c.note}
                    </div>
                  </td>
                  <td className="py-2.5 px-2">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-semibold ${segmentStyle[c.segment]}`}
                    >
                      {c.segment}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-medium text-slate-700 dark:text-slate-200">
                    {c.orders}
                  </td>
                  <td className="py-2.5 px-2 font-semibold text-slate-900 dark:text-white">
                    {c.spent.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="py-2.5 px-2 font-medium text-slate-700 dark:text-slate-200">
                    {c.lastSeen}
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <button className="h-8 px-3 rounded-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 font-semibold text-[11px] hover:opacity-90 transition inline-flex items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-purple-500" />
                      Nhắn
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-slate-500 dark:text-slate-400 font-semibold"
                  >
                    Không có khách phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}