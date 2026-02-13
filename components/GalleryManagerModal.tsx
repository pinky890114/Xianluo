import React, { useState } from 'react';
import { ShowcaseItem } from '../types';
import { X, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../services/imageUploadService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: ShowcaseItem[];
  onAdd: (url: string) => void;
  onRemove: (id: string) => void;
}

export const GalleryManagerModal: React.FC<Props> = ({ isOpen, onClose, items, onAdd, onRemove }) => {
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      onAdd(url);
    } catch (error) {
      alert('圖片上傳失敗');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl p-6 shadow-xl max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-stone-700 flex items-center gap-2">
            <ImageIcon className="text-[#A1887F]" />
            成品展示圖管理
          </h2>
          <button onClick={onClose}><X className="text-stone-400 hover:text-stone-600" /></button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-[300px] p-2">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {/* Upload Button */}
            <label className={`aspect-square border-2 border-dashed border-stone-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-stone-50 hover:border-[#A1887F] transition group ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <Upload className="text-stone-400 group-hover:text-[#A1887F] mb-2" size={32} />
              <span className="text-xs font-bold text-stone-400 group-hover:text-[#A1887F]">
                {uploading ? '上傳中...' : '上傳新圖片'}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
            </label>

            {/* Image List */}
            {items.map((item) => (
              <div key={item.id} className="relative aspect-square group rounded-2xl overflow-hidden shadow-sm border border-stone-100">
                <img src={item.url} alt="showcase" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={(e) => { 
                      e.stopPropagation();
                      if(window.confirm('確定刪除這張圖片嗎？')) onRemove(item.id); 
                    }}
                    className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition transform hover:scale-110 active:scale-95"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t text-right">
           <button onClick={onClose} className="bg-[#5D4037] text-white px-6 py-2 rounded-full font-bold hover:bg-[#4E342E] transition">
             完成
           </button>
        </div>
      </div>
    </div>
  );
};