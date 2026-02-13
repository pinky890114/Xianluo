import React, { useState } from 'react';
import { CommissionStatus, ProductOptions, Product } from '../types';
import { X, Upload } from 'lucide-react';
import { uploadImage } from '../services/imageUploadService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  productOptions: ProductOptions;
}

export const AddCommissionModal: React.FC<Props> = ({ isOpen, onClose, onAdd, productOptions }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    title: '',
    description: '',
    type: '流麻吊飾',
    price: 0,
    status: CommissionStatus.APPLYING,
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
    onAdd({ ...formData, thumbnailUrl: url });
    setUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-stone-700">新增訂單</h2>
          <button onClick={onClose}><X className="text-stone-400 hover:text-stone-600" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="委託人暱稱" className="w-full border-2 rounded-xl p-3 outline-none focus:border-[#5D4037]"
            value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
          <input required placeholder="委託標題" className="w-full border-2 rounded-xl p-3 outline-none focus:border-[#5D4037]"
            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          
          <div className="flex gap-4">
              <select className="flex-1 border-2 rounded-xl p-3 outline-none bg-white"
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                {/* Fix: Explicitly cast the flattened array to Product[] to resolve the 'unknown' type error on line 62 */}
                {(Object.values(productOptions).flat() as Product[]).map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                <option value="其他客製">其他客製</option>
              </select>
              <input type="number" placeholder="金額" className="w-24 border-2 rounded-xl p-3 outline-none focus:border-[#5D4037]"
                value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
          </div>

          <textarea placeholder="備註/描述" className="w-full h-24 border-2 rounded-xl p-3 outline-none focus:border-[#5D4037]"
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            
          <label className="flex items-center gap-2 p-3 border-2 border-dashed rounded-xl cursor-pointer hover:bg-stone-50 text-stone-500">
            <Upload size={18} />
            <span className="truncate text-sm">{imageFile ? imageFile.name : '上傳縮圖'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
          </label>

          <button type="submit" disabled={uploading} className="w-full bg-[#A1887F] py-3 rounded-xl font-bold text-white hover:bg-[#8D6E63]">
            {uploading ? '處理中...' : '建立'}
          </button>
        </form>
      </div>
    </div>
  );
};