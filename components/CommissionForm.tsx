
import React, { useState, useEffect, useRef } from 'react';
import { CommissionStatus, ProductOptions } from '../types';
import { ArrowLeft, Upload, Sparkles, X, Link as LinkIcon, Calculator, Plus, Check, ChevronDown, HelpCircle, Heart, ShieldAlert, ThermometerSnowflake, Droplets, Scissors, Hand } from 'lucide-react';
import { uploadImage } from '../services/imageUploadService';
import { auth } from '../firebase';
import { signInAnonymously } from 'firebase/auth';

interface Props {
  onNavigateHome: () => void;
  productOptions: ProductOptions;
  onAddCommission: (data: any) => Promise<void>;
  onComplete?: () => void;
  customTitle?: string;
  customSubtitle?: string;
}

interface SupplyOption {
  id: string;
  name: string;
  price: number;
}

const NOCY_SUPPLIES: SupplyOption[] = [
  { id: 'bag_1', name: 'A5活頁收納袋一格', price: 8 },
  { id: 'bag_2', name: 'A5活頁收納袋兩格', price: 8 },
  { id: 'stand_black', name: '基礎款立牌包黑色', price: 75 },
  { id: 'stand_white', name: '基礎款立牌包白色', price: 75 },
  { id: 'stand_red', name: '基礎款立牌包紅色', price: 75 },
  { id: 'stand_pink', name: '基礎款立牌包粉色', price: 75 },
  { id: 'stand_blue', name: '基礎款立牌包藍色', price: 75 },
  { id: 'stand_orange', name: '基礎款立牌包橘色', price: 75 },
  { id: 'stand_yellow', name: '基礎款立牌包黃色', price: 75 },
  { id: 'stand_green', name: '基礎款立牌包綠色', price: 75 },
  { id: 'glue', name: '保麗龍膠30ml一瓶', price: 13 },
  { id: 'label', name: '保護膜標籤紙20個', price: 4 },
];

const HEADDRESS_CRAFT_OPTIONS = [
  "跟頭髮一體",
  "可拆插入式",
  "通用夾式"
];

export const CommissionForm: React.FC<Props> = ({ onNavigateHome, onAddCommission, onComplete, customTitle }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    title: '',
    description: '',
    price: 700, // 初始底價
    status: CommissionStatus.APPLYING,
    imageUrlLink: '',
    headdressCraft: HEADDRESS_CRAFT_OPTIONS[0],
  });
  
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showHeaddressInfo, setShowHeaddressInfo] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manage preview URLs to avoid memory leaks and rendering issues
  useEffect(() => {
    const urls = imageFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  // 計算預估金額 (底價 700 + 加購項目總和)
  useEffect(() => {
    const addonTotal = selectedAddons.reduce((sum, id) => {
      const item = NOCY_SUPPLIES.find(s => s.id === id);
      return sum + (item?.price || 0);
    }, 0);
    setFormData(prev => ({ ...prev, price: 700 + addonTotal }));
  }, [selectedAddons]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter((file: File) => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`檔案 ${file.name} 超過 5MB，已略過。`);
          return false;
        }
        return true;
      });
      const combinedFiles = [...imageFiles, ...validFiles].slice(0, 5); // 最多 5 張
      setImageFiles(combinedFiles);
    }
  };

  const removeFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    if (!auth.currentUser) {
      try {
        await signInAnonymously(auth);
      } catch (authErr) {
        console.error("Auth failed:", authErr);
        alert("系統驗證失敗，無法連接到資料庫。");
        setUploading(false);
        return;
      }
    }
    
    let uploadedUrls: string[] = [];
    if (imageFiles.length > 0) {
      try {
        const uploadPromises = imageFiles.map(file => uploadImage(file));
        const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("上傳逾時 (30秒)")), 30000)
        );
        uploadedUrls = await Promise.race([Promise.all(uploadPromises), timeoutPromise]);
      } catch (err: any) {
        console.error("Upload Error:", err);
        const confirmSkip = window.confirm(
          `圖片上傳失敗：${err.message || '未知錯誤'}\n\n是否要略過圖片，僅提交文字資料？`
        );
        
        if (!confirmSkip) {
          setUploading(false);
          return;
        }
        uploadedUrls = [];
      }
    }

    const finalUrls = [...uploadedUrls];
    if (formData.imageUrlLink) finalUrls.push(formData.imageUrlLink);

    const addonNames = selectedAddons.map(id => NOCY_SUPPLIES.find(s => s.id === id)?.name).join(', ');
    const fullType = `頭飾：${formData.headdressCraft}${addonNames ? ' | 加購：' + addonNames : ''}`;

    const payload = { 
      ...formData, 
      type: fullType,
      thumbnailUrl: finalUrls[0] || '', 
      imageUrls: finalUrls 
    };

    try {
      await onAddCommission(payload);
      setUploading(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (dbError) {
      console.error("DB Write Error:", dbError);
      alert("資料庫寫入失敗，請檢查網路連線後重試。");
      setUploading(false);
    }
  };

  const handleFinish = () => {
    if (onComplete) {
      onComplete();
    } else {
      onNavigateHome();
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-stone-100 p-8 sm:p-12 text-center">
          <div className="w-20 h-20 bg-[#FAF8F5] rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Heart className="text-[#A1887F] fill-[#A1887F]" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-[#5D4037] mb-2">委託申請已送出！</h2>
          <p className="text-stone-400 mb-10 font-medium">掌櫃收到後會儘快與您聯繫</p>

          <div className="text-left bg-[#FAF8F5] border-2 border-[#EFEBE9] rounded-[2.5rem] p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#5D4037] rounded-xl flex items-center justify-center text-white">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-2xl font-bold text-[#5D4037]">小餅養護指南</h3>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <Droplets size={18} />
                </div>
                <div>
                  <p className="text-[#5D4037] font-bold mb-1">小餅有禁酒令不能碰酒</p>
                  <p className="text-stone-500 text-sm leading-relaxed"><span className="font-bold text-[#5D4037]">酒精會融化保麗龍膠</span>，請絕對避免接觸。酒精噴霧消毒時也請遠離小餅。</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                  <ThermometerSnowflake size={18} />
                </div>
                <div>
                  <p className="text-[#5D4037] font-bold mb-1">熱風注意</p>
                  <p className="text-stone-500 text-sm leading-relaxed">有些細節是用熱熔膠黏的，所以盡量不要用吹風機的熱風去吹。如果已經鬆動了就再次微熱化然後用力按住固定。</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-[#5D4037] font-bold mb-1">清潔方式</p>
                  <p className="text-stone-500 text-sm leading-relaxed">如果小餅髒髒了，可以用棉花娃清潔劑清洗，盡量不要直接泡水。</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                  <Hand size={18} />
                </div>
                <div>
                  <p className="text-[#5D4037] font-bold mb-1">穿脫力道</p>
                  <p className="text-stone-500 text-sm leading-relaxed">穿脫時要注意力道，如果出現開線的情況可以用針線縫補或用保麗龍膠黏上。</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                  <Scissors size={18} />
                </div>
                <div>
                  <p className="text-[#5D4037] font-bold mb-1">手工痕跡</p>
                  <p className="text-stone-500 text-sm leading-relaxed">因為是手工製作所以難免會有膠絲或線頭，膠絲可以直接取下、線頭可以直接剪掉，硬化處理過了不會開線。</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleFinish}
            className="mt-12 w-full max-w-sm bg-[#5D4037] text-white py-4 rounded-full font-bold text-lg hover:bg-[#4E342E] transition shadow-lg shadow-stone-200"
          >
            我已了解，完成申請
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <button onClick={onNavigateHome} className="flex items-center gap-2 text-stone-400 hover:text-stone-600 mb-6 font-bold transition">
        <ArrowLeft size={20} /> 返回
      </button>

      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-stone-100">
        <div className="bg-white p-6 border-b border-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FAF8F5] rounded-xl flex items-center justify-center">
              <Sparkles className="text-[#A1887F]" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#5D4037]">{customTitle || '填寫委託單'}</h2>
          </div>
          <button onClick={onNavigateHome} className="p-2 hover:bg-stone-50 rounded-full transition text-stone-300">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="block text-stone-500 font-bold mb-2 text-sm">您的暱稱 / 稱呼</label>
                <input required className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl p-4 outline-none focus:border-[#A1887F]/30 transition" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} placeholder="例如：大江"/>
              </div>
              <div>
                <label className="block text-stone-500 font-bold mb-2 text-sm">委託標題（委託人名稱+委託內容）</label>
                <input required className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl p-4 outline-none focus:border-[#A1887F]/30 transition" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="例如：小江私服"/>
              </div>

              <div className="pt-2">
                <label className="block text-stone-500 font-bold mb-3 text-sm">想要加購的項目</label>
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 hide-scrollbar">
                  {NOCY_SUPPLIES.map((item) => {
                    const isSelected = selectedAddons.includes(item.id);
                    return (
                      <button key={item.id} type="button" onClick={() => toggleAddon(item.id)} className={`flex justify-between items-center px-4 py-3 rounded-2xl border-2 transition-all ${isSelected ? 'border-[#A1887F] bg-[#FAF8F5] text-[#5D4037] shadow-sm' : 'border-stone-50 bg-stone-50 text-stone-400 hover:border-stone-200'}`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-[#A1887F] border-[#A1887F]' : 'bg-white border-stone-200'}`}>
                            {isSelected && <Check size={12} className="text-white stroke-[3px]" />}
                          </div>
                          <span className="font-bold text-sm">{item.name}</span>
                        </div>
                        <span className="text-xs font-bold opacity-80">+${item.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-stone-500 font-bold text-sm">頭飾工藝選擇</label>
                  <button type="button" onClick={() => setShowHeaddressInfo(true)} className="flex items-center gap-1 text-[#A1887F] hover:text-[#5D4037] transition text-xs font-bold">
                    <HelpCircle size={14} /> 工藝說明
                  </button>
                </div>
                <div className="relative">
                  <select className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl p-4 pr-10 outline-none focus:border-[#A1887F]/30 transition appearance-none cursor-pointer text-[#5D4037] font-medium" value={formData.headdressCraft} onChange={e => setFormData({...formData, headdressCraft: e.target.value})}>
                    {HEADDRESS_CRAFT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400"><ChevronDown size={18} /></div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-stone-500 font-bold mb-2 text-sm">參考圖片 (角色設定 / 構圖參考)</label>
                <div onClick={() => fileInputRef.current?.click()} className="w-full aspect-[2/1] bg-stone-50 border-2 border-[#EFEBE9] border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAF8F5] transition group relative overflow-hidden">
                  {imageFiles.length === 0 ? (
                    <div className="flex flex-col items-center text-stone-300 group-hover:text-[#A1887F] transition-colors">
                      <Upload size={32} className="mb-2" />
                      <span className="font-bold text-sm">點擊上傳 (Max 5張)</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-2 p-4 w-full h-full">
                      {imageFiles.map((_, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-white border border-stone-200 shadow-sm">
                          {previewUrls[idx] && <img src={previewUrls[idx]} alt="preview" className="w-full h-full object-cover" />}
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-red-500 transition">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      {imageFiles.length < 5 && (
                        <div className="aspect-square border-2 border-dashed border-stone-200 rounded-xl flex items-center justify-center text-stone-300">
                          <Plus size={16} />
                        </div>
                      )}
                    </div>
                  )}
                  <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300"><LinkIcon size={18} /></div>
                <input className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl p-4 pl-12 outline-none focus:border-[#A1887F]/30 transition" value={formData.imageUrlLink} onChange={e => setFormData({...formData, imageUrlLink: e.target.value})} placeholder="或是貼上圖片連結..." />
              </div>

              <div className="bg-stone-50 border-2 border-stone-100 rounded-[2rem] p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-stone-100 rounded-xl flex items-center justify-center shadow-sm">
                    <Calculator className="text-stone-400" size={20} />
                  </div>
                  <span className="font-bold text-stone-500">預估金額</span>
                </div>
                <div className="text-3xl font-bold text-[#A1887F]">NT$ {formData.price}</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-stone-500 font-bold mb-2 text-sm">備註</label>
            <textarea className="w-full h-40 bg-stone-50 border-2 border-stone-100 rounded-[2rem] p-6 outline-none focus:border-[#A1887F]/30 transition resize-none text-[#5D4037]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="如有任何特殊需要或想要告訴掌櫃的話，請打字在這裡..."/>
          </div>

          <div className="flex justify-center pt-4">
            <button type="submit" disabled={uploading} className="w-full max-w-sm bg-[#5D4037] text-white py-4 rounded-full font-bold text-lg hover:bg-[#4E342E] disabled:opacity-50 transition-all shadow-lg shadow-stone-200 flex items-center justify-center gap-2">
              {uploading ? '提交中...' : <><Sparkles size={20}/> 送出委託申請</>}
            </button>
          </div>
        </form>
      </div>

      {/* Headdress Info Modal */}
      {showHeaddressInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowHeaddressInfo(false)} className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition text-stone-400"><X size={20} /></button>
            <h3 className="text-xl font-bold text-[#5D4037] mb-6 flex items-center gap-2"><HelpCircle className="text-[#A1887F]" /> 工藝區別說明</h3>
            <div className="space-y-6">
              <div className="text-[#A1887F] font-bold text-sm border-b border-stone-100 pb-2">Q：我要如何區別跟頭髮一體/可拆插入式/通用夾式呢？</div>
              <div className="space-y-4 text-sm leading-relaxed">
                <div>
                  <div className="font-bold text-[#5D4037] flex items-center gap-2 mb-1"><span className="w-1.5 h-1.5 rounded-full bg-[#A1887F]"></span> 跟頭髮一體</div>
                  <p className="text-stone-600">與頭髮一體無法拆卸，優點是牢固不擔心遺失，缺點是無法自由進行搭配。</p>
                  <p className="text-[#A1887F] font-bold mt-1 italic underline decoration-stone-200">適合太小或者角色的固定配件</p>
                </div>
                <div>
                  <div className="font-bold text-[#5D4037] flex items-center gap-2 mb-1"><span className="w-1.5 h-1.5 rounded-full bg-[#A1887F]"></span> 可拆插入式</div>
                  <p className="text-stone-600">優點是針對該髮型做設計、貼合效果最好，缺點是只能適用於同一款髮型。</p>
                  <p className="text-[#A1887F] font-bold mt-1 italic underline decoration-stone-200">適合角色特定造型的搭配</p>
                </div>
                <div>
                  <div className="font-bold text-[#5D4037] flex items-center gap-2 mb-1"><span className="w-1.5 h-1.5 rounded-full bg-[#A1887F]"></span> 通用夾式</div>
                  <p className="text-stone-600">優點是可以自由搭配大多數髮型使用，缺點是效果相對前兩種而言較差。</p>
                  <p className="text-[#A1887F] font-bold mt-1 italic underline decoration-stone-200">適合多款造型的角色使用</p>
                </div>
              </div>
            </div>
            <button onClick={() => setShowHeaddressInfo(false)} className="w-full mt-8 bg-[#FAF8F5] border border-stone-100 text-[#5D4037] py-3 rounded-2xl font-bold hover:bg-stone-50 transition">我知道了</button>
          </div>
        </div>
      )}
    </div>
  );
};
