import React, { useState } from 'react';
import { useCommissionStore } from '../hooks/useCommissionStore';
import { useProductStore } from '../hooks/useProductStore';
import { CommissionForm } from '../components/CommissionForm';
import { CommissionDetail } from '../components/CommissionDetail';
import { StatusBadge } from '../components/StatusBadge';
import { Plus, Search, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Commission, CommissionStatus } from '../types';
import { STATUS_STEPS } from '../constants';

export const AdminDashboard = () => {
  const { commissions, loading, addCommission, updateCommissionStatus, deleteCommission } = useCommissionStore();
  const { productOptions } = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredCommissions = commissions.filter(c => {
    const matchesSearch = c.clientName.includes(searchTerm) || c.title.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLogout = () => signOut(auth);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-pink-400">載入中...</div>;

  return (
    <div className="min-h-screen bg-[#fbfaf8] pb-20">
      <header className="bg-white border-b sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">暹羅的賠錢生意後台</h1>
        <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600"><LogOut size={20}/></button>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
          <div className="flex gap-2 bg-white p-1 rounded-lg border shadow-sm flex-1 max-w-md">
            <Search className="text-gray-400 ml-2 mt-2.5" size={20} />
            <input 
              type="text" 
              placeholder="搜尋委託人或標題..." 
              className="w-full p-2 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
             <select 
                className="bg-white border rounded-lg px-4 py-2 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
             >
                 <option value="All">全部狀態</option>
                 {STATUS_STEPS.map(s => <option key={s} value={s}>{s}</option>)}
             </select>
             <button 
                onClick={() => setShowForm(true)} 
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md shadow-pink-200 transition whitespace-nowrap"
             >
                <Plus size={18} /> 新增委託
             </button>
          </div>
        </div>

        {!showForm ? (
          <div className="grid gap-4">
            {filteredCommissions.map(commission => (
              <div key={commission.id} className="bg-white rounded-xl p-4 border hover:border-pink-300 transition shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {commission.thumbnailUrl && <img src={commission.thumbnailUrl} alt="" className="w-full h-full object-cover" />}
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-gray-800">{commission.title}</h3>
                  <p className="text-sm text-gray-500">{commission.clientName} · {commission.type}</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                   <select 
                      value={commission.status}
                      onChange={(e) => updateCommissionStatus(commission.id, e.target.value as CommissionStatus)}
                      className="text-xs border rounded-full px-2 py-1 bg-gray-50 outline-none cursor-pointer hover:bg-gray-100"
                   >
                       {STATUS_STEPS.map(step => (
                           <option key={step} value={step}>{step}</option>
                       ))}
                   </select>
                </div>

                <button 
                  onClick={() => setSelectedCommission(commission)}
                  className="text-sm text-gray-400 hover:text-pink-500 px-4 py-2"
                >
                  詳細
                </button>
              </div>
            ))}
            
            {filteredCommissions.length === 0 && (
                <div className="text-center py-20 text-gray-400">沒有找到相關委託</div>
            )}
          </div>
        ) : (
          <CommissionForm 
            onNavigateHome={() => setShowForm(false)} 
            productOptions={productOptions}
            onAddCommission={async (data) => {
              await addCommission(data);
              setShowForm(false);
            }} 
          />
        )}
      </main>
      
      {selectedCommission && (
        <CommissionDetail 
            commission={selectedCommission} 
            isAdmin={true} 
            onClose={() => setSelectedCommission(null)}
            onDelete={(id) => { deleteCommission(id); setSelectedCommission(null); }}
        />
      )}
    </div>
  );
};