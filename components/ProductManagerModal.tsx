import React, { useState } from 'react';
import { ProductOptions } from '../types';
import { X, Plus, Trash2 } from 'lucide-react';
import { CATEGORY_ORDER } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productOptions: ProductOptions;
  onSave: (options: ProductOptions) => void;
}

export const ProductManagerModal: React.FC<Props> = ({ isOpen, onClose, productOptions, onSave }) => {
  // Deep copy for local editing
  const [options, setOptions] = useState<ProductOptions>(JSON.parse(JSON.stringify(productOptions)));
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ORDER[0]);

  if (!isOpen) return null;

  const updateProduct = (idx: number, field: string, value: any) => {
    const newOpts = { ...options };
    if (!newOpts[activeCategory]) newOpts[activeCategory] = [];
    newOpts[activeCategory][idx] = { ...newOpts[activeCategory][idx], [field]: value };
    setOptions(newOpts);
  };

  const addProduct = () => {
    const newOpts = { ...options };
    if (!newOpts[activeCategory]) newOpts[activeCategory] = [];
    newOpts[activeCategory].push({ name: '新商品', price: 0, img: '', addons: [] });
    setOptions(newOpts);
  };

  const deleteProduct = (idx: number) => {
      const newOpts = { ...options };
      newOpts[activeCategory].splice(idx, 1);
      setOptions(newOpts);
  }

  const handleSave = () => {
      onSave(options);
      onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-stone-700">商品項目管理</h2>
          <button onClick={onClose}><X className="text-stone-400 hover:text-stone-600" /></button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-stone-100 mb-4 hide-scrollbar">
            {CATEGORY_ORDER.map(cat => (
                <button key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-[#5D4037] text-white' : 'bg-stone-50 text-stone-500'}`}
                >
                    {cat}
                </button>
            ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {(options[activeCategory] || []).map((product, idx) => (
                <div key={idx} className="border-2 border-stone-100 rounded-xl p-4 flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                            <input className="flex-[2] border rounded p-1 font-bold text-stone-700" value={product.name} onChange={e => updateProduct(idx, 'name', e.target.value)} placeholder="商品名稱"/>
                            <input className="flex-1 border rounded p-1 text-stone-600" type="number" value={product.price} onChange={e => updateProduct(idx, 'price', Number(e.target.value))} placeholder="價格"/>
                        </div>
                         {/* Simple Addon UI could go here, omitting for brevity */}
                    </div>
                    <button onClick={() => deleteProduct(idx)} className="text-red-300 hover:text-red-500"><Trash2 size={18}/></button>
                </div>
            ))}
            <button onClick={addProduct} className="w-full py-3 border-2 border-dashed border-stone-200 rounded-xl text-stone-400 font-bold hover:bg-stone-50 hover:text-[#5D4037] transition flex items-center justify-center gap-2">
                <Plus size={18}/> 新增商品
            </button>
        </div>

        <div className="pt-6 border-t mt-4">
            <button onClick={handleSave} className="w-full bg-[#A1887F] py-3 rounded-xl font-bold text-white hover:bg-[#8D6E63]">儲存設定</button>
        </div>
      </div>
    </div>
  );
};