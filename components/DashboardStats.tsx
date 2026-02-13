import React from 'react';
import { ThemeMode } from '../types';
export const DashboardStats: React.FC<{ stats: { queue: number; active: number; done: number }; viewMode: ThemeMode; artistName: string; }> = ({ stats, viewMode, artistName }) => (

<div className="mb-10 sm:flex justify-between items-end">
<div><h2 className="text-3xl font-bold text-[#5D4037] mb-2">{viewMode === 'admin' ? `歡迎回來，${artistName}！🎨` : '訂單進度查詢 ✨'}</h2><p className="text-stone-500">這裡可以查看與管理訂單進度</p></div>
<div className="flex gap-2 mt-4 sm:mt-0">
{[ {v: stats.queue, l: '預購中'}, {v: stats.active, l: '已到貨'}, {v: stats.done, l: '已結單'} ].map(s => (
<div key={s.l} className="bg-white border-2 px-4 py-2 rounded-2xl text-center min-w-[70px]">
<div className="text-xl font-bold text-stone-600">{s.v}</div>
<div className="text-[10px] text-stone-400 font-bold">{s.l}</div>
</div>
))}
</div>
</div>
);