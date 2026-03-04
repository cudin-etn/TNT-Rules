"use client";

import { useMemo } from "react";
import { TrendingUp, Percent, ShoppingCart, Sparkles } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "T2", revenue: 4500000, orders: 18, ai: 6 },
  { name: "T3", revenue: 6000000, orders: 22, ai: 9 },
  { name: "T4", revenue: 5500000, orders: 20, ai: 8 },
  { name: "T5", revenue: 8000000, orders: 26, ai: 12 },
  { name: "T6", revenue: 12500000, orders: 40, ai: 19 },
  { name: "T7", revenue: 15000000, orders: 46, ai: 23 },
  { name: "CN", revenue: 18000000, orders: 55, ai: 28 },
];

export default function AdminReportsPage() {
  const totalRevenue = useMemo(
    () => data.reduce((s, d) => s + d.revenue, 0),
    []
  );
  const totalOrders = useMemo(() => data.reduce((s, d) => s + d.orders, 0), []);
  const aiOrders = useMemo(() => data.reduce((s, d) => s + d.ai, 0), []);
  const aiRate = totalOrders ? Math.round((aiOrders / totalOrders) * 100) : 0;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Báo cáo
        </h1>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
          Biểu đồ & KPI demo (mock). Sau khi ký deal sẽ nối dữ liệu thật + AI analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI
          icon={TrendingUp}
          title="Doanh thu 7 ngày"
          value={`${totalRevenue.toLocaleString("vi-VN")} ₫`}
          tone="blue"
        />
        <KPI
          icon={ShoppingCart}
          title="Tổng đơn"
          value={`${totalOrders}`}
          tone="orange"
        />
        <KPI
          icon={Sparkles}
          title="Đơn từ AI"
          value={`${aiOrders}`}
          tone="purple"
        />
        <KPI
          icon={Percent}
          title="Tỷ lệ AI hỗ trợ"
          value={`${aiRate}%`}
          tone="emerald"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold text-slate-900 dark:text-white">
              Doanh thu theo ngày
            </h2>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Đơn vị: VND
            </div>
          </div>

          <div className="min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopOpacity={0.35} />
                    <stop offset="95%" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${Math.round(Number(v) / 1000000)}M`}
                />
                <Tooltip
                  formatter={(value: any) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(Number(value) || 0)
                  }
                />
                <Area type="monotone" dataKey="revenue" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm p-4">
          <h2 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">
            Insight (demo)
          </h2>
          <ul className="space-y-2 text-[12px] font-medium text-slate-700 dark:text-slate-200">
            <li className="rounded-xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 p-3">
              AI tạo <span className="font-semibold">{aiOrders}</span> đơn (ước tính) trong 7 ngày.
            </li>
            <li className="rounded-xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 p-3">
              Tỷ lệ AI hỗ trợ chốt: <span className="font-semibold">{aiRate}%</span>.
            </li>
            <li className="rounded-xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 p-3">
              Ngày cao nhất: <span className="font-semibold">CN</span> (traffic cao).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function KPI({
  icon: Icon,
  title,
  value,
  tone,
}: {
  icon: any;
  title: string;
  value: string;
  tone: "blue" | "orange" | "purple" | "emerald";
}) {
  const toneMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    orange:
      "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
    purple:
      "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
    emerald:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  };

  return (
    <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-4 shadow-sm">
      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        {title}
      </div>
      <div className="mt-1 text-[18px] font-semibold text-slate-900 dark:text-white">
        {value}
      </div>
      <div className={`mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${toneMap[tone]}`}>
        <Icon className="h-3.5 w-3.5" />
        {tone.toUpperCase()}
      </div>
    </div>
  );
}