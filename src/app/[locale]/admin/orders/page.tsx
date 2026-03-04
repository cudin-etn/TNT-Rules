"use client";

import { useMemo, useState } from "react";
import { Search, Filter, BadgeCheck, Clock, Truck, XCircle } from "lucide-react";

type OrderStatus = "pending" | "paid" | "shipping" | "cancelled";

type OrderRow = {
  id: string;
  customer: string;
  phone: string;
  channel: "Website" | "Zalo" | "Facebook" | "Instagram";
  status: OrderStatus;
  total: number;
  createdAt: string;
};

const statusMeta: Record<
  OrderStatus,
  { label: string; icon: any; cls: string }
> = {
  pending: {
    label: "Chờ xử lý",
    icon: Clock,
    cls: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
  },
  paid: {
    label: "Đã thanh toán",
    icon: BadgeCheck,
    cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  },
  shipping: {
    label: "Đang giao",
    icon: Truck,
    cls: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  },
  cancelled: {
    label: "Đã hủy",
    icon: XCircle,
    cls: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
  },
};

const mockOrders: OrderRow[] = [
  { id: "TN-10021", customer: "Nguyễn Văn H.", phone: "09xx-xxx-321", channel: "Zalo", status: "pending", total: 345000, createdAt: "Hôm nay 10:12" },
  { id: "TN-10020", customer: "Trần Minh K.", phone: "09xx-xxx-110", channel: "Website", status: "paid", total: 89000, createdAt: "Hôm nay 09:40" },
  { id: "TN-10019", customer: "Lê Quốc A.", phone: "09xx-xxx-778", channel: "Facebook", status: "shipping", total: 219000, createdAt: "Hôm qua 18:05" },
  { id: "TN-10018", customer: "Phạm Thị L.", phone: "09xx-xxx-444", channel: "Instagram", status: "cancelled", total: 65000, createdAt: "Hôm qua 13:22" },
  { id: "TN-10017", customer: "Hoàng Nam", phone: "09xx-xxx-905", channel: "Website", status: "paid", total: 109000, createdAt: "2 ngày trước" },
];

export default function AdminOrdersPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");

  const rows = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return mockOrders.filter((o) => {
      const matchQ =
        !keyword ||
        o.id.toLowerCase().includes(keyword) ||
        o.customer.toLowerCase().includes(keyword) ||
        o.phone.toLowerCase().includes(keyword);

      const matchStatus = status === "all" ? true : o.status === status;
      return matchQ && matchStatus;
    });
  }, [q, status]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Đơn hàng
          </h1>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
            Danh sách đơn gần đây (mock) để demo quy trình vận hành.
          </p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[12px] font-semibold shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all">
          Tạo đơn mới
        </button>
      </div>

      <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm p-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo mã đơn / tên / SĐT..."
              className="w-full h-10 pl-10 pr-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 outline-none text-[13px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 h-10 px-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10">
              <Filter className="h-4 w-4 text-slate-500" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="bg-transparent outline-none text-[13px] font-semibold text-slate-700 dark:text-slate-200"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="paid">Đã thanh toán</option>
                <option value="shipping">Đang giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-2 font-semibold">Mã đơn</th>
                <th className="py-2.5 px-2 font-semibold">Khách</th>
                <th className="py-2.5 px-2 font-semibold">Kênh</th>
                <th className="py-2.5 px-2 font-semibold">Trạng thái</th>
                <th className="py-2.5 px-2 font-semibold">Tổng</th>
                <th className="py-2.5 px-2 font-semibold">Thời gian</th>
                <th className="py-2.5 px-2 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => {
                const meta = statusMeta[o.status];
                const Icon = meta.icon;
                return (
                  <tr
                    key={o.id}
                    className="border-t border-white/40 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-2.5 px-2 font-semibold text-slate-900 dark:text-white">
                      {o.id}
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {o.customer}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {o.phone}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 font-medium text-slate-700 dark:text-slate-200">
                      {o.channel}
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${meta.cls}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {meta.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-semibold text-slate-900 dark:text-white">
                      {o.total.toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="py-2.5 px-2 text-slate-600 dark:text-slate-300 font-medium">
                      {o.createdAt}
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <button className="h-8 px-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-[11px] hover:opacity-90 transition">
                        Xem
                      </button>
                    </td>
                  </tr>
                );
              })}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-slate-500 dark:text-slate-400 font-bold"
                  >
                    Không có đơn phù hợp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Hiển thị {rows.length} / {mockOrders.length} đơn
          </div>
          <div className="flex items-center gap-2">
            <button className="h-8 px-3 rounded-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 font-semibold text-[11px]">
              Trước
            </button>
            <button className="h-8 px-3 rounded-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 font-semibold text-[11px]">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}