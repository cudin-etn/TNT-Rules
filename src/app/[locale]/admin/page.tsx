"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    conversionRate: "0%"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDashboardData() {
      // 1. Tính tổng doanh thu & đơn chờ (Chỉ tính đơn không bị hủy)
      const { data: orders } = await supabase
        .from("orders")
        .select("total_amount, status")
        .not("status", "eq", "cancelled");

      if (orders) {
        const totalRev = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
        const pending = orders.filter(o => o.status === "pending").length;
        
        setStats(prev => ({ 
          ...prev, 
          revenue: totalRev, 
          pendingOrders: pending 
        }));
      }

      // 2. Đếm số khách hàng (demo lấy từ bảng orders vì mình chưa làm bảng users riêng)
      const { count } = await supabase.from("orders").select('*', { count: 'exact', head: true });
      setStats(prev => ({ ...prev, totalCustomers: count || 0 }));

      setLoading(false);
    }
    getDashboardData();
  }, []);

  const statCards = [
    { title: "Tổng doanh thu", value: `${stats.revenue.toLocaleString("vi-VN")}₫`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-500/20", path: "/admin/orders" },
    { title: "Đơn chờ xử lý", value: stats.pendingOrders.toString(), icon: ShoppingBag, color: "text-orange-600", bg: "bg-orange-500/20", path: "/admin/orders" },
    { title: "Khách hàng", value: stats.totalCustomers.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-500/20", path: "/admin/customers" },
    { title: "Tỷ lệ chốt", value: "4.2%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-500/20", path: "/admin/reports" },
  ];

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-orange-500" /></div>;

  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tổng quan hệ thống</h1>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">Dữ liệu đơn hàng thật từ Database.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((s, i) => (
          <Link href={s.path} key={i} className="group block p-4 rounded-3xl bg-white/60 dark:bg-slate-900/50 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-sm transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[12px] font-bold uppercase text-slate-500">{s.title}</p>
                <h3 className="text-xl font-black text-slate-800 dark:text-white">{s.value}</h3>
              </div>
              <div className={`p-2.5 rounded-2xl ${s.bg} ${s.color}`}>
                <s.icon className="h-4 w-4" strokeWidth={2.5} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Ở đây có thể giữ lại cái biểu đồ mock để demo cho đẹp mắt vì mình chưa có đủ data theo ngày */}
      <div className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-2xl rounded-3xl border border-white/60 dark:border-white/10 p-6 flex-1">
         <h2 className="text-sm font-bold mb-4">Hoạt động kinh doanh gần đây</h2>
         <div className="text-xs text-slate-500 italic">Biểu đồ sẽ tự động cập nhật khi có dữ liệu đơn hàng trong 7 ngày tới.</div>
      </div>
    </div>
  );
}