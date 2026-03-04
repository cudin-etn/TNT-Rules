"use client";

import { useMemo, useState } from "react";
import { Search, Plus, AlertTriangle, Tag, Pencil, Trash2 } from "lucide-react";

type ProductRow = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  updatedAt: string;
};

const mockProducts: ProductRow[] = [
  { id: "P-001", name: "Nhái hơi TNT Pro 8cm", sku: "TNT-FROG-08", category: "Nhái hơi", price: 109000, stock: 12, updatedAt: "Hôm nay" },
  { id: "P-002", name: "Cá sắt Blade 14g", sku: "TNT-BLADE-14", category: "Cá sắt", price: 89000, stock: 5, updatedAt: "Hôm nay" },
  { id: "P-003", name: "Mồi mềm Swimbait 9cm", sku: "TNT-SWIM-09", category: "Mồi mềm", price: 65000, stock: 2, updatedAt: "Hôm qua" },
  { id: "P-004", name: "Combo 5 mồi + phụ kiện", sku: "TNT-COMBO-05", category: "Combo", price: 345000, stock: 20, updatedAt: "3 ngày trước" },
];

export default function AdminProductsPage() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return mockProducts.filter((p) => {
      if (!keyword) return true;
      return (
        p.name.toLowerCase().includes(keyword) ||
        p.sku.toLowerCase().includes(keyword) ||
        p.category.toLowerCase().includes(keyword)
      );
    });
  }, [q]);

  const lowStock = rows.filter((p) => p.stock <= 3).length;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Kho mồi
          </h1>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
            Quản lý sản phẩm & tồn kho (mock) để demo.
          </p>
        </div>

        <button className="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-[12px] shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tổng sản phẩm</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{rows.length}</div>
        </div>
        <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sắp hết hàng</div>
          <div className="mt-1 text-3xl font-black text-rose-600 dark:text-rose-400 inline-flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {lowStock}
          </div>
        </div>
        <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Danh mục</div>
          <div className="mt-1 text-3xl font-black text-slate-900 dark:text-white inline-flex items-center gap-2">
            <Tag className="h-5 w-5 text-emerald-500" />
            6
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm p-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tên / SKU / danh mục..."
              className="w-full h-10 pl-10 pr-3 rounded-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 outline-none text-[13px]"
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-2 font-semibold">Sản phẩm</th>
                <th className="py-2.5 px-2 font-semibold">SKU</th>
                <th className="py-2.5 px-2 font-semibold">Danh mục</th>
                <th className="py-2.5 px-2 font-semibold">Giá</th>
                <th className="py-2.5 px-2 font-semibold">Tồn</th>
                <th className="py-2.5 px-2 font-semibold">Cập nhật</th>
                <th className="py-2.5 px-2 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-white/40 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-2.5 px-2">
                    <div className="font-semibold text-slate-900 dark:text-white">{p.name}</div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{p.id}</div>
                  </td>
                  <td className="py-2.5 px-2 font-medium text-slate-700 dark:text-slate-200">{p.sku}</td>
                  <td className="py-2.5 px-2 font-medium text-slate-700 dark:text-slate-200">{p.category}</td>
                  <td className="py-2.5 px-2 font-semibold text-slate-900 dark:text-white">{p.price.toLocaleString("vi-VN")} ₫</td>
                  <td className="py-2.5 px-2">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-semibold ${
                        p.stock <= 3
                          ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-slate-600 dark:text-slate-300 font-medium">{p.updatedAt}</td>
                  <td className="py-2.5 px-2 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button className="h-8 w-8 rounded-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 hover:opacity-90 transition flex items-center justify-center">
                        <Pencil className="h-3.5 w-3.5 text-slate-700 dark:text-slate-200" />
                      </button>
                      <button className="h-8 w-8 rounded-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 hover:opacity-90 transition flex items-center justify-center">
                        <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 dark:text-slate-400 font-semibold">
                    Không có sản phẩm phù hợp.
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