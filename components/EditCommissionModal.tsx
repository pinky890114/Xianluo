
import React, { useState, useEffect, useRef } from 'react';
import { Commission } from '../types';
import { X, Save, Upload, Image as ImageIcon, Trash2, Plus, Loader2 } from 'lucide-react';
import { uploadImage } from '../services/imageUploadService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  commission: Commission | null;
  onSave: (id: string, data: Partial<Commission>) => void;
}

export const EditCommissionModal: React.FC<Props> = ({ isOpen, onClose, commission, onSave }) => {
  const [formData, setFormData] = useState<Partial<Commission>>({});
  const [newProgressFiles, setNewProgressFiles] = useState<File[]>([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);
  const [existingProgressUrls, setExistingProgressUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commission) {
      setFormData(commission);
      setExistingProgressUrls(commission.progressImageUrls || []);
      setNewProgressFiles([]);
      setNewPreviewUrls([]);
    }
  }, [commission]);

  // Manage preview URLs
  useEffect(() => {
    const urls = newProgressFiles.map(file => URL.createObjectURL(file));
    setNewPreviewUrls(urls);
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [newProgressFiles]);

  if (!isOpen || !commission) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewProgressFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeNewFile = (index: number) => {
    setNewProgressFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingUrl = (urlToRemove: string) => {
    setExistingProgressUrls(prev => prev.filter(url => url !== urlToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload new images
      const uploadPromises = newProgressFiles.map(file => uploadImage(file));
      const newUrls = await Promise.all(uploadPromises);
      
      // Combine existing kept URLs with new URLs
      const finalProgressImageUrls = [...existingProgressUrls, ...newUrls];

      onSave(commission.id, {
        ...formData,
        progressImageUrls: finalProgressImageUrls
      });
      
      onClose();
    } catch (error) {
      console.error("Upload failed", error);
      alert("圖片上傳失敗，請重試");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
          <h2 className="text-xl font-bold text-stone-700">編輯訂單詳情</h2>
          <button onClick={onClose}><X className="text-stone-400 hover:text-stone-600" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto px-1">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-400 ml-1 mb-1 block">標題</label>
              <input className="w-full border-2 border-stone-100 rounded-xl p-3 outline-none focus:border-[#5D4037] bg-stone-50 focus:bg-white transition"
                  value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-400 ml-1 mb-1 block">金額</label>
               <input type="number" className="w-full border-2 border-stone-100 rounded-xl p-3 outline-none focus:border-[#5D4037] bg-stone-50 focus:bg-white transition"
                  value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-400 ml-1 mb-1 block">訂單原始描述</label>
            <textarea className="w-full h-24 border-2 border-stone-100 rounded-xl p-3 outline-none focus:border-[#5D4037] bg-stone-50 focus:bg-white transition resize-none"
                value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          {/* Progress Section Highlight */}
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border-2 border-[#EFEBE9] space-y-4">
            <h3 className="font-bold text-[#5D4037] flex items-center gap-2">
              <ImageIcon size={18} /> 更新製作進度
            </h3>
            
            <div>
              <label className="text-xs font-bold text-[#A1887F] ml-1 mb-1 block">目前進度說明 (委託人可見)</label>
              <textarea 
                className="w-full h-20 border-2 border-[#EFEBE9] rounded-xl p-3 outline-none focus:border-[#A1887F] bg-white transition resize-none placeholder:text-stone-300"
                placeholder="例如：線稿已完成，請確認細節..."
                value={formData.currentProgress || ''} 
                onChange={e => setFormData({...formData, currentProgress: e.target.value})} 
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#A1887F] ml-1 mb-2 block">上傳進度圖片</label>
              <div className="grid grid-cols-4 gap-2">
                {/* Existing Images */}
                {existingProgressUrls.map((url, idx) => (
                  <div key={`exist-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-stone-200">
                    <img src={url} alt="progress" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeExistingUrl(url)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                
                {/* New Files Preview */}
                {newPreviewUrls.map((url, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-stone-200">
                    <img src={url} alt="preview" className="w-full h-full object-cover opacity-80" />
                    <button 
                      type="button"
                      onClick={() => removeNewFile(idx)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition"
                    >
                      <X size={12} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-[10px] text-center font-bold">New</div>
                  </div>
                ))}

                {/* Add Button */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-[#A1887F]/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#A1887F]/5 hover:border-[#A1887F] transition text-[#A1887F]"
                >
                  <Plus size={24} />
                  <span className="text-[10px] font-bold mt-1">新增</span>
                </div>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange} 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={uploading}
            className="w-full bg-[#5D4037] py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:bg-[#4E342E] transition disabled:opacity-70 shadow-lg shadow-stone-200"
          >
            {uploading ? <Loader2 className="animate-spin" /> : <Save size={18}/>} 
            {uploading ? '圖片上傳中...' : '儲存所有變更'}
          </button>
        </form>
      </div>
    </div>
  );
};
