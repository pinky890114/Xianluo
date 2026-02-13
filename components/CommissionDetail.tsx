import React, { useState } from 'react';
import { Commission } from '../types';
import { X, Sparkles, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { generateClientUpdate, suggestWorkPlan } from '../services/geminiService';
import { StatusBadge } from './StatusBadge';

interface Props {
  commission: Commission;
  isAdmin: boolean;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: any) => void;
  onDelete?: (id: string) => void;
}

export const CommissionDetail: React.FC<Props> = ({ commission, isAdmin, onClose, onDelete }) => {
  const [aiResult, setAiResult] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const imageUrls = commission.imageUrls || (commission.thumbnailUrl ? [commission.thumbnailUrl] : []);

  const handleGenerateUpdate = async () => {
    setLoadingAi(true);
    const text = await generateClientUpdate(commission);
    setAiResult(text);
    setLoadingAi(false);
  };

  const handleSuggestPlan = async () => {
    setLoadingAi(true);
    const text = await suggestWorkPlan(commission);
    setAiResult(text);
    setLoadingAi(false);
  };

  const nextImg = () => setActiveImgIdx((prev) => (prev + 1) % imageUrls.length);
  const prevImg = () => setActiveImgIdx((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Image Showcase */}
        <div className="relative h-64 sm:h-80 bg-stone-100 flex items-center justify-center overflow-hidden group">
            {imageUrls.length > 0 ? (
                <>
                  <img src={imageUrls[activeImgIdx]} alt={commission.title} className="w-full h-full object-contain" />
                  {imageUrls.length > 1 && (
                    <>
                      <button onClick={prevImg} className="absolute left-4 p-2 bg-white/20 hover:bg-white/80 rounded-full text-white hover:text-stone-800 transition backdrop-blur-md">
                        <ChevronLeft size={24} />
                      </button>
                      <button onClick={nextImg} className="absolute right-4 p-2 bg-white/20 hover:bg-white/80 rounded-full text-white hover:text-stone-800 transition backdrop-blur-md">
                        <ChevronRight size={24} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                        {imageUrls.map((_, i) => (
                          <div key={i} className={`h-1.5 rounded-full transition-all ${i === activeImgIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </>
            ) : (
                <div className="text-stone-300 flex flex-col items-center">
                    <Sparkles size={48} />
                    <span className="mt-2 text-sm">無參考圖</span>
                </div>
            )}
            <button onClick={onClose} className="absolute top-4 right-4 bg-white/80 hover:bg-white text-stone-600 p-2 rounded-full shadow-lg transition z-10">
                <X size={20} />
            </button>
            <div className="absolute top-4 left-4">
                 <StatusBadge status={commission.status} />
            </div>
        </div>

        <div className="p-8 overflow-y-auto hide-scrollbar">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-stone-800 mb-1">{commission.title}</h2>
                <p className="text-stone-400 text-sm flex items-center gap-2">
                    委託人：{commission.clientName} 
                    <span className="text-xs bg-stone-50 px-2 py-0.5 rounded-lg border border-stone-100">#{commission.id.slice(0,6)}</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-[#A1887F]">NT$ {commission.price}</div>
                <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{commission.type}</div>
              </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xs font-bold text-stone-300 uppercase mb-4 tracking-widest">進度狀態回報</h3>
                <ProgressBar currentStatus={commission.status} />
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-[2rem] border border-[#EFEBE9] mb-8">
                <h3 className="text-xs font-bold text-stone-400 mb-2 uppercase tracking-widest">需求描述詳情</h3>
                <p className="text-stone-600 text-sm leading-loose whitespace-pre-wrap">{commission.description}</p>
            </div>

            {isAdmin && (
                <div className="border-t border-stone-100 pt-8">
                    <h3 className="flex items-center gap-2 font-bold text-purple-400 mb-4 text-sm tracking-widest">
                        <Sparkles size={16} /> AI 助手店主服務
                    </h3>
                    <div className="flex gap-3 mb-6">
                        <button onClick={handleGenerateUpdate} disabled={loadingAi} className="flex-1 bg-purple-50 text-purple-600 py-3 rounded-2xl text-sm font-bold hover:bg-purple-100 transition flex items-center justify-center gap-2 border border-purple-100">
                            <MessageCircle size={16}/> 產生回報文案
                        </button>
                        <button onClick={handleSuggestPlan} disabled={loadingAi} className="flex-1 bg-sky-50 text-sky-600 py-3 rounded-2xl text-sm font-bold hover:bg-sky-100 transition border border-sky-100">
                            產生製作建議
                        </button>
                    </div>
                    {loadingAi && <p className="text-center text-stone-400 text-sm py-4 animate-pulse">AI 正在努力思考中...</p>}
                    {aiResult && (
                        <div className="bg-white border-2 border-stone-50 rounded-[2rem] p-6 shadow-sm relative group mb-8">
                            <textarea 
                                readOnly 
                                className="w-full h-32 text-sm text-stone-600 resize-none outline-none bg-transparent"
                                value={aiResult}
                            />
                            <button 
                                onClick={() => navigator.clipboard.writeText(aiResult)}
                                className="absolute bottom-4 right-4 text-xs bg-stone-800 text-white px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                            >
                                點擊複製
                            </button>
                        </div>
                    )}
                    
                    <div className="flex justify-end">
                         <button 
                            onClick={() => { if(window.confirm('確定刪除此委託？')) onDelete?.(commission.id); }} 
                            className="text-red-300 text-xs font-bold hover:text-red-500 transition px-4 py-2 border border-transparent hover:border-red-100 rounded-full"
                        >
                            刪除此委託單
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};