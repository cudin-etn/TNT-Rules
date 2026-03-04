"use client";

import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Dữ liệu mock
const revenueData = [
  { name: 'T2', total: 4500000 },
  { name: 'T3', total: 6000000 },
  { name: 'T4', total: 5500000 },
  { name: 'T5', total: 8000000 },
  { name: 'T6', total: 12500000 },
  { name: 'T7', total: 15000000 },
  { name: 'CN', total: 18000000 },
];

const recentOrders = [
  { id: "#TNT001", customer: "Nguyễn Văn A", product: "Nhái hơi Toán Nhà Quê", total: "150.000đ", status: "Chờ xử lý", badge: "text-orange-600 bg-orange-500/20 border-orange-500/30" },
  { id: "#TNT002", customer: "Trần Thị B", product: "Cá sắt 15g", total: "85.000đ", status: "Đang giao", badge: "text-blue-600 bg-blue-500/20 border-blue-500/30" },
  { id: "#TNT003", customer: "Lê Văn C", product: "Combo Mồi mềm", total: "250.000đ", status: "Hoàn thành", badge: "text-emerald-600 bg-emerald-500/20 border-emerald-500/30" },
  { id: "#TNT004", customer: "Hà Quang Tùng", product: "Máy ngang Daiwa PR100", total: "1.250.000đ", status: "Hoàn thành", badge: "text-emerald-600 bg-emerald-500/20 border-emerald-500/30" },
];

// Tooltip kính mờ cho biểu đồ
// Khai báo kiểu dữ liệu cho Tooltip để hết báo đỏ
interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/50 dark:border-white/10 p-3 rounded-2xl shadow-xl z-50">
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">{`Ngày: ${label ?? ""}`}</p>
        <p className="text-blue-600 dark:text-blue-400 font-semibold text-[13px]">
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const stats = [
    { title: "Doanh thu hôm nay", value: "12.500.000đ", icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/20", glow: "hover:shadow-emerald-500/30", path: "/admin/orders" },
    { title: "Đơn chờ xử lý", value: "24", icon: ShoppingBag, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/20", glow: "hover:shadow-orange-500/30", path: "/admin/orders" },
    { title: "Khách hàng mới", value: "156", icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/20", glow: "hover:shadow-blue-500/30", path: "/admin/customers" },
    { title: "Tỷ lệ chốt sale", value: "4.2%", icon: TrendingUp, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/20", glow: "hover:shadow-purple-500/30", path: "/admin/reports" },
  ];

  return (
    // THAY VÌ space-y, DÙNG FLEX CỘT VÀ h-full ĐỂ ÉP KHUNG
    <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* KHỐI HEADER (shrink-0 để không bị bóp méo) */}
      <div className="shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Tổng quan hệ thống
        </h1>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
          Theo dõi các chỉ số và hoạt động kinh doanh hôm nay.
        </p>
      </div>

      {/* 4 THẺ THỐNG KÊ (shrink-0) */}
      <div className="shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <Link 
            href={s.path}
            key={i} 
            className={`group block relative overflow-hidden p-4 rounded-3xl bg-white/60 dark:bg-slate-900/50 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1 ${s.glow}`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[13px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {s.title}
                </p>
                <h3 className="text-[18px] font-semibold text-slate-800 dark:text-white tracking-tight">
                  {s.value}
                </h3>
              </div>
              <div className={`p-2.5 rounded-2xl ${s.bg} ${s.color} transition-transform duration-300 group-hover:scale-110`}>
                <s.icon className="h-4 w-4" strokeWidth={2.5} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* KHỐI BIỂU ĐỒ & ĐƠN HÀNG (flex-1 để tự động hút cạn phần khoảng trống còn lại) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-3 gap-6 pb-2">
         
         {/* BIỂU ĐỒ RECHARTS (Ép h-full) */}
         <div className="xl:col-span-2 h-full bg-white/60 dark:bg-slate-900/50 backdrop-blur-2xl rounded-3xl border border-white/60 dark:border-white/10 shadow-sm p-4 flex flex-col transition-all duration-300 hover:shadow-md">
            <div className="shrink-0 flex items-center justify-between mb-4">
              <h2 className="text-[13px] font-semibold text-slate-800 dark:text-white">Doanh thu 7 ngày qua</h2>
            </div>
            {/* Chỗ vẽ biểu đồ */}
            <div className="flex-1 min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* DANH SÁCH ĐƠN HÀNG (Ép h-full, phần danh sách tự scroll) */}
         <div className="h-full bg-white/60 dark:bg-slate-900/50 backdrop-blur-2xl rounded-3xl border border-white/60 dark:border-white/10 shadow-sm p-4 flex flex-col transition-all duration-300 hover:shadow-md">
            <div className="shrink-0 flex items-center justify-between mb-4">
              <h2 className="text-[13px] font-semibold text-slate-800 dark:text-white">Đơn hàng mới</h2>
              <Link href="/admin/orders" className="text-[12px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
              {recentOrders.map((order, i) => (
                <div key={i} className="shrink-0 flex items-center justify-between p-2.5 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-white/40 dark:hover:border-white/10 cursor-pointer group">
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                      {order.customer}
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">{order.id}</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 truncate max-w-[150px]">{order.product}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[13px] font-semibold text-slate-800 dark:text-white">{order.total}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${order.badge}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
         </div>
         
      </div>
    </div>
  );
}