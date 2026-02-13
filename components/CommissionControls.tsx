import React from 'react';
import { CommissionStatus, ThemeMode } from '../types';
import { Search, Settings, Image as ImageIcon } from 'lucide-react';

export const CommissionControls: React.FC<{ 
    searchTerm: string; 
    onSearchTermChange: (s: string) => void; 
    statusFilter: string; 
    onStatusFilterChange: (s: any) => void; 
    viewMode: ThemeMode; 
    onAddClick: () => void; 
    onManageProductsClick: () => void;
    onManageGalleryClick?: () => void; 
}> = (props) => (

<div className="flex flex-col md:flex-row gap-3 mb-8">
<div className="relative flex-grow">
<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
<input type="text" value={props.searchTerm} onChange={e => props.onSearchTermChange(e.target.value)} className="w-full border-2 rounded-full pl-10 pr-4 py-2 outline-none focus:border-[#5D4037] bg-white" placeholder="搜尋暱稱或項目..." />
</div>
<div className="flex gap-2">
<select value={props.statusFilter} onChange={e => props.onStatusFilterChange(e.target.value)} className="border-2 rounded-full px-4 py-2 text-sm font-bold bg-white outline-none focus:border-[#5D4037]">
<option value="All">所有狀態</option>
{Object.values(CommissionStatus).map(s => <option key={s} value={s}>{s}</option>)}
</select>
{props.viewMode === 'admin' && (
<>
{props.onManageGalleryClick && (
    <button onClick={props.onManageGalleryClick} className="p-2 border-2 rounded-full bg-white hover:bg-stone-50" title="管理展示圖片">
        <ImageIcon size={18} className="text-stone-600"/>
    </button>
)}
<button onClick={props.onManageProductsClick} className="p-2 border-2 rounded-full bg-white hover:bg-stone-50" title="管理商品設定">
    <Settings size={18} className="text-stone-600"/>
</button>
<button onClick={props.onAddClick} className="bg-[#A1887F] px-4 py-2 rounded-full font-bold text-sm text-white hover:bg-[#8D6E63] transition-colors whitespace-nowrap">新增訂單</button>
</>
)}
</div>
</div>
);