import React, { useState, useEffect } from 'react';
import { Commission } from '../types';
import { X, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  commission: Commission | null;
  onSave: (id: string, data: Partial<Commission>) => void;
}

export const EditCommissionModal: React.FC<Props> = ({ isOpen, onClose, commission, onSave }) => {
  const [formData, setFormData] = useState<Partial<Commission>>({});

  useEffect(() => {
    if (commission) setFormData(commission);
  }, [commission]);

  if (!isOpen || !commission) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(commission.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-stone-700">編輯訂單</h2>
          <button onClick={onClose}><X className="text-stone-400 hover:text-stone-600" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-400 ml-1">標題</label>
            <input className="w-full border-2 rounded-xl p-2 outline-none focus:border-[#5D4037]"
                value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-400 ml-1">金額</label>
             <input type="number" className="w-full border-2 rounded-xl p-2 outline-none focus:border-[#5D4037]"
                value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-400 ml-1">描述</label>
            <textarea className="w-full h-32 border-2 rounded-xl p-2 outline-none focus:border-[#5D4037]"
                value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-[#A1887F] py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:bg-[#8D6E63]">
            <Save size={18}/> 儲存變更
          </button>
        </form>
      </div>
    </div>
  );
};