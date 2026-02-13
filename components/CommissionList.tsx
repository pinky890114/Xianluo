import React from 'react';
import { Commission, ThemeMode } from '../types';
import { CommissionCard } from './CommissionCard';

export const CommissionList: React.FC<{ 
    commissions: Commission[]; 
    viewMode: ThemeMode; 
    searchTerm: string; 
    onUpdateStatus: any; 
    onUpdate?: (id: string, data: Partial<Commission>) => void;
    onDelete: any; 
    onEdit: any; 
}> = (props) => {
if (props.viewMode === 'client' && !props.searchTerm) return <div className="text-center py-20 text-stone-400 font-bold animate-in fade-in">請在上方搜尋欄輸入您的 ID 以查看進度</div>;
if (props.commissions.length === 0) return <div className="text-center py-20 text-stone-400">目前沒有訂單喔</div>;
return <div>{props.commissions.map(c => <CommissionCard key={c.id} commission={c} isAdmin={props.viewMode === 'admin'} onUpdateStatus={props.onUpdateStatus} onUpdate={props.onUpdate} onDelete={props.onDelete} onEdit={props.onEdit} />)}</div>;
};