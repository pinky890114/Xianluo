import React, { useState } from 'react';
import { useCommissionStore } from '../hooks/useCommissionStore';
import { CommissionDetail } from '../components/CommissionDetail';
import { StatusBadge } from '../components/StatusBadge';
import { Search, Sparkles } from 'lucide-react';
import { Commission } from '../types';

export const ClientPortal = () => {
  const { commissions } = useCommissionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);

  const filteredCommissions = searchTerm.length > 0 ? commissions.filter(c => 
    c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.includes(searchTerm)
  ) : [];

  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <div className="bg-pink-500 text-white pb-20 pt-12 px-6 rounded-b-[3rem] shadow-lg shadow-pink-200/50">
        <div className="max-w-md mx-auto text-center">
            <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                <Sparkles className="text-yellow-300" /> 暹羅的賠錢生意
            </h1>
            <p className="text-pink-100 mb-8">輸入暱稱，查詢你的流麻製作進度 ✨</p>
            
            <div className="bg-white rounded-full p-2 flex shadow-xl shadow-pink-600/20 transform transition-transform focus-within:scale-105">
                <input 
                    type="text" 
                    placeholder="請輸入委託人暱稱..." 
                    className="flex-1 bg-transparent px-4 outline-none text-gray-700 placeholder-gray-300"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button className="bg-pink-500 text-white p-3 rounded-full">
                    <Search size={20} />
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10">
         {searchTerm.length === 0 ? (
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                 <h2 className="font-bold text-gray-700 mb-4">排單狀態一覽</h2>
                 <div className="grid grid-cols-3 gap-4 text-sm text-gray-500">
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-pink-500 mb-1">{commissions.filter(c => c.status === '申請中').length}</div>
                        申請中
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-500 mb-1">{commissions.filter(c => c.status === '製作中').length}</div>
                        製作中
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-green-500 mb-1">{commissions.filter(c => c.status === '製作完成').length}</div>
                        已完成
                    </div>
                 </div>
                 <p className="mt-8 text-xs text-gray-400">最近更新：{new Date().toLocaleDateString()}</p>
             </div>
         ) : (
            <div className="grid gap-4">
                {filteredCommissions.map(c => (
                    <div key={c.id} onClick={() => setSelectedCommission(c)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer flex gap-4 items-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                             {c.thumbnailUrl ? <img src={c.thumbnailUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><Sparkles size={20}/></div>}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-gray-800">{c.title}</h3>
                                <StatusBadge status={c.status} />
                            </div>
                            <p className="text-sm text-gray-500">{c.type}</p>
                            <p className="text-xs text-gray-400 mt-2">更新於 {new Date(c.lastUpdated).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
                {filteredCommissions.length === 0 && (
                    <div className="text-center py-20 text-gray-400">找不到 "{searchTerm}" 的委託資料 QAQ</div>
                )}
            </div>
         )}
      </div>

      {selectedCommission && (
        <CommissionDetail 
            commission={selectedCommission} 
            isAdmin={false} 
            onClose={() => setSelectedCommission(null)} 
        />
      )}
    </div>
  );
};