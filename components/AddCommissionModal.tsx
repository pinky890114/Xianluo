
import React, { useState } from 'react';
import { CommissionStatus, ProductOptions } from '../types';
import { X, Upload, FileText, User, Tag, DollarSign, Camera } from 'lucide-react';
import { uploadImage } from '../services/imageUploadService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  productOptions: ProductOptions;
}

export const AddCommissionModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    title: '',
    description: '',
    price: '', // Use string for input handling, convert to number on submit
    status: CommissionStatus.ESTABLISHED,
    thumbnailUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let url = formData.thumbnailUrl;
    if (imageFile) {
      try {
        url = await uploadImage(imageFile);
      } catch (err) {
        alert("圖片上傳失敗");
        setUploading(false);
        return;
      }
    }
    
    onAdd({ 
      ...formData, 
      price: Number(formData.price) || 0,
      type: '一般委託', // 預設類型
      thumbnailUrl: url 
    });
    
    setUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
          <h2 className="text-xl font-bold text-[#5D4037]">新增訂單</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-stone-100 transition"><X className="text-stone-400" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-400 mb-1 ml-1 flex items-center gap-1"><User size={12}/> 暱稱</label>
            <input 
              required 
              placeholder="委託人暱稱" 
              className="w-full border-2 border-stone-100 rounded-xl px-4 py-3 outline-none focus:border-[#A1887F] transition-colors bg-stone-50 focus:bg-white text-stone-700"
              value={formData.clientName} 
              onChange={e => setFormData({...formData, clientName: e.target.value})} 
            />
          </div>

          <div>
             <label className="text-xs font-bold text-stone-400 mb-1 ml-1 flex items-center gap-1"><Tag size={12}/> 委託標題</label>
             <input 
              required 
              placeholder="例如：小江私服" 
              className="w-full border-2 border-stone-100 rounded-xl px-4 py-3 outline-none focus:border-[#A1887F] transition-colors bg-stone-50 focus:bg-white text-stone-700"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          
          <div>
            <label className="text-xs font-bold text-stone-400 mb-1 ml-1 flex items-center gap-1"><DollarSign size={12}/> 價格</label>
            <input 
              type="number" 
              placeholder="輸入金額" 
              className="w-full border-2 border-stone-100 rounded-xl px-4 py-3 outline-none focus:border-[#A1887F] transition-colors bg-stone-50 focus:bg-white text-stone-700"
              value={formData.price} 
              onChange={e => setFormData({...formData, price: e.target.value})} 
            />
          </div>

          <div>
             <label className="text-xs font-bold text-stone-400 mb-1 ml-1 flex items-center gap-1"><FileText size={12}/> 細節備註</label>
             <textarea 
              placeholder="紀錄各種細項..." 
              className="w-full h-24 border-2 border-stone-100 rounded-xl px-4 py-3 outline-none focus:border-[#A1887F] transition-colors resize-none bg-stone-50 focus:bg-white text-stone-700"
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
            
          <label className={`flex flex-col items-center gap-2 p-4 border-2 border-dashed ${imageFile ? 'border-[#A1887F] bg-[#FAF8F5]' : 'border-stone-200 hover:bg-stone-50'} rounded-xl cursor-pointer transition text-stone-400`}>
            {imageFile ? (
               <div className="flex items-center gap-2 text-[#5D4037] font-bold">
                  <Camera size={20} />
                  <span className="truncate text-sm max-w-[200px]">{imageFile.name}</span>
               </div>
            ) : (
                <>
                  <Upload size={24} />
                  <span className="text-sm font-bold">上傳縮圖 (選填)</span>
                </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
          </label>

          <button type="submit" disabled={uploading} className="w-full bg-[#5D4037] py-4 rounded-xl font-bold text-white hover:bg-[#4E342E] transition-colors shadow-lg shadow-stone-200 mt-2">
            {uploading ? '處理中...' : '建立訂單'}
          </button>
        </form>
      </div>
    </div>
  );
};
