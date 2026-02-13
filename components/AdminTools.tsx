import React, { useState } from 'react';
import { Commission } from '../types';
import { generateClientUpdate, suggestWorkPlan } from '../services/geminiService';
import { X } from 'lucide-react';
export const AdminTools: React.FC<{ commission: Commission; onClose: () => void; }> = ({ commission, onClose }) => {
const [text, setText] = useState('');
const [loading, setLoading] = useState(false);
const handleGen = async (type: 'email' | 'plan') => { setLoading(true); setText(type === 'email' ? await generateClientUpdate(commission) : await suggestWorkPlan(commission)); setLoading(false); };
return (
<div className="mt-4 bg-stone-50 p-4 rounded-2xl border relative animate-in slide-in-from-top-2">
<button onClick={onClose} className="absolute top-2 right-2 text-stone-300"><X size={14}/></button>
<div className="flex gap-2 mb-3">
<button onClick={() => handleGen('email')} className="text-xs font-bold px-3 py-1 bg-white border rounded-full hover:bg-stone-100">草擬回信</button>
<button onClick={() => handleGen('plan')} className="text-xs font-bold px-3 py-1 bg-white border rounded-full hover:bg-stone-100">工作建議</button>
</div>
<div className="bg-white p-3 rounded-xl border text-sm min-h-[60px] whitespace-pre-wrap">{loading ? 'AI 正在思考中...' : text || '點擊上方按鈕生成 AI 建議'}</div>
</div>
);
};