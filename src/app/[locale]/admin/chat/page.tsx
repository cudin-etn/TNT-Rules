"use client";

import { useState } from "react";
import { Search, Send, MoreVertical, Phone, Image as ImageIcon, Smile, CheckCheck } from "lucide-react";
import Image from "next/image";

// 1. Phân kênh (Thêm TikTok để test độ bao phủ)
const CHANNELS = [
  { id: "all", label: "Tất cả" },
  { id: "zalo", label: "Zalo OA", color: "bg-blue-500" },
  { id: "facebook", label: "Facebook", color: "bg-blue-600" },
  { id: "instagram", label: "Instagram", color: "bg-pink-600" },
  { id: "tiktok", label: "TikTok", color: "bg-black dark:bg-white" },
];

// 2. Danh sách khách hàng
const CHAT_LIST = [
  { id: 1, name: "Nguyễn Văn A", platform: "zalo", platformColor: "bg-blue-500", avatar: "/images/placeholder.png", lastMsg: "Shop cho mình hỏi mồi nhái hơi...", time: "10:24", unread: 2 },
  { id: 2, name: "Trần Thị B", platform: "facebook", platformColor: "bg-blue-600", avatar: "/images/placeholder.png", lastMsg: "Cá sắt 15g còn hàng không em?", time: "09:15", unread: 0 },
  { id: 3, name: "Hoàng C", platform: "instagram", platformColor: "bg-pink-600", avatar: "/images/placeholder.png", lastMsg: "Ship COD SG bao lâu tới ạ?", time: "Hôm qua", unread: 0 },
];

// 3. Data tin nhắn giả lập (Đổi theo từng khách)
const MESSAGES_DB: Record<number, { sender: "customer" | "shop", text: string, time: string }[]> = {
  1: [
    { sender: "customer", text: "Shop cho mình hỏi mồi nhái hơi Toán Nhà Quê còn màu xanh lính không ạ?", time: "10:24" },
    { sender: "shop", text: "Dạ chào anh, mẫu Toán Nhà Quê màu xanh lính bên em vẫn còn hàng ạ. Anh lấy mấy con để em lên đơn luôn nhé?", time: "10:26" }
  ],
  2: [
    { sender: "customer", text: "Cá sắt 15g còn hàng không em?", time: "09:15" },
    { sender: "shop", text: "Dạ cá sắt 15g TNT em sẵn đủ màu ạ. Chị chuộng màu nào để em tư vấn?", time: "09:20" }
  ],
  3: [
    { sender: "customer", text: "Shop ở đâu vậy ạ?", time: "14:00" },
    { sender: "shop", text: "Dạ shop em ở TP.HCM, có ship COD toàn quốc kiểm hàng trước khi thanh toán ạ.", time: "14:15" },
    { sender: "customer", text: "Ship COD SG bao lâu tới ạ?", time: "Hôm qua" }
  ]
};

export default function AdminChatPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeChatId, setActiveChatId] = useState(1);

  // Lấy data chat của người đang được chọn
  const activeChatInfo = CHAT_LIST.find(c => c.id === activeChatId) || CHAT_LIST[0];
  const currentMessages = MESSAGES_DB[activeChatId] || [];

  return (
    <div className="flex h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-2">
      
      {/* ================= CỘT TRÁI: DANH SÁCH CHAT ================= */}
      <div className="w-full md:w-[380px] flex flex-col bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden shrink-0">
        
        {/* Header & Thanh tìm kiếm dạng Pill (Tương phản mạnh) */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-transparent">
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-4">Chat đa kênh</h2>
          <div className="relative">
            {/* Icon Kính lúp có màu cam để sinh động */}
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500 font-bold" />
            <input 
              type="text" 
              placeholder="Tìm kiếm khách hàng, sđt..." 
              // Pill shape: rounded-full, Nền trắng viền cứng
              className="w-full h-12 pl-12 pr-4 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-[14px] font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Tab Phân Kênh (Dùng flex-wrap để hiện đủ, rớt dòng gọn gàng) */}
        <div className="px-4 py-3 flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shrink-0">
          {CHANNELS.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all duration-200 flex items-center gap-1.5 shadow-sm ${
                activeTab === c.id 
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md scale-105" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {c.id !== "all" && <div className={`w-2 h-2 rounded-full ${c.color}`} />}
              {c.label}
            </button>
          ))}
        </div>

        {/* Danh sách tin nhắn */}
        <div className="flex-1 overflow-y-auto">
          {CHAT_LIST.map(chat => {
            const isActive = activeChatId === chat.id;

            return (
              <div 
                key={chat.id} 
                onClick={() => setActiveChatId(chat.id)}
                className={`relative flex items-center gap-3 p-4 cursor-pointer transition-all border-b border-slate-100 dark:border-slate-800/50 last:border-0 ${
                  isActive 
                    // NẾU ĐANG CHỌN: Đổ full Gradient, có bóng đổ mạnh
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-500/20 z-10 scale-[1.02] rounded-xl mx-2 my-1 border-transparent"
                    // NẾU KHÔNG CHỌN: Trạng thái bình thường
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40 mx-0 my-0 rounded-none"
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-12 h-12 rounded-2xl overflow-hidden ${isActive ? "bg-white/20" : "bg-slate-200 dark:bg-slate-700"}`}>
                    <Image src={chat.avatar} alt={chat.name} width={48} height={48} className="object-cover" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${isActive ? "border-rose-500" : "border-white dark:border-[#0f172a]"} ${chat.platformColor}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-[14px] font-bold truncate ${isActive ? "text-white" : (chat.unread > 0 ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300")}`}>
                      {chat.name}
                    </h4>
                    <span className={`text-[11px] whitespace-nowrap shrink-0 ${isActive ? "font-semibold text-orange-100" : (chat.unread > 0 ? "font-bold text-orange-600 dark:text-orange-400" : "font-medium text-slate-400")}`}>
                      {chat.time}
                    </span>
                  </div>
                  <p className={`text-[13px] truncate pr-4 ${isActive ? "font-medium text-white/90" : (chat.unread > 0 ? "font-bold text-slate-800 dark:text-slate-200" : "font-medium text-slate-500 dark:text-slate-400")}`}>
                    {chat.lastMsg}
                  </p>
                </div>

                {chat.unread > 0 && (
                  <div className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm ${
                    isActive ? "bg-white text-orange-600" : "bg-orange-500 text-white shadow-orange-500/30"
                  }`}>
                    {chat.unread}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= CỘT PHẢI: KHUNG CHAT CHI TIẾT ================= */}
      <div className="hidden md:flex flex-1 flex-col bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Header khung chat */}
        <div className="h-[76px] px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-transparent flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
              <Image src={activeChatInfo.avatar} alt="Avatar" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {activeChatInfo.name}
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white ${activeChatInfo.platformColor}`}>
                  {activeChatInfo.platform}
                </span>
              </h3>
              <p className="text-[12px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Đang trực tuyến
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors">
              <Phone className="h-4 w-4" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Nội dung chat */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-900/30 space-y-6">
          <div className="flex justify-center">
            <span className="px-3 py-1 rounded-full bg-slate-200/50 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Hôm nay
            </span>
          </div>

          {currentMessages.map((msg, index) => {
            const isCustomer = msg.sender === "customer";
            
            return (
              <div key={index} className={`flex gap-3 max-w-[80%] ${isCustomer ? "" : "ml-auto justify-end"}`}>
                {isCustomer && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0 mt-auto">
                    <Image src={activeChatInfo.avatar} alt="Khách" width={32} height={32} />
                  </div>
                )}
                
                {/* 1. TIN NHẮN KHÁCH: Gradient Xanh dương (Blue -> Cyan) 
                  2. TIN NHẮN SHOP: Gradient Cam (Orange -> Rose)
                */}
               <div className={`p-4 shadow-sm ${
  isCustomer 
    ? "bg-gradient-to-br from-blue-500/90 to-cyan-500/90 rounded-2xl rounded-bl-sm" 
    : "bg-gradient-to-br from-orange-500/90 to-rose-500/90 rounded-2xl rounded-br-sm shadow-orange-500/10"
}`}>
                  <p className="text-[14px] text-white font-medium">{msg.text}</p>
                  <div className={`text-[11px] font-semibold mt-2 flex items-center gap-1 ${isCustomer ? "text-blue-100" : "text-orange-100/80 justify-end"}`}>
                    {msg.time} {!isCustomer && <CheckCheck className="h-3.5 w-3.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Khu vực nhập liệu */}
        <div className="p-4 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button className="w-11 h-11 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors shrink-0">
              <ImageIcon className="h-5 w-5" />
            </button>
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Nhập tin nhắn..." 
                className="w-full h-11 pl-4 pr-10 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-[14px] font-medium text-slate-900 dark:text-white placeholder:text-slate-400 transition-all outline-none"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors">
                <Smile className="h-5 w-5" />
              </button>
            </div>
            <button className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 font-bold text-[14px] flex items-center gap-2 transition-transform hover:-translate-y-0.5 shadow-sm shrink-0">
              Gửi <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}