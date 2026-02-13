import React, { useState } from 'react';
import { Commission, CommissionStatus } from '../types';
import { ProgressBar } from './ProgressBar';
import { STATUS_STEPS } from '../constants';
import { AdminTools } from './AdminTools';
import { Trash2, Calendar, Sparkles, Edit, Edit2, Save, X } from 'lucide-react';

export const CommissionCard: React.FC<{ 
    commission: Commission; 
    isAdmin: boolean; 
    onUpdateStatus: (id: string, s: CommissionStatus) => void; 
    onUpdate?: (id: string, data: Partial<Commission>) => void;
    onDelete: (id: string) => void; 
    onEdit: (c: Commission) => void; 
}> = ({ commission, isAdmin, onUpdateStatus, onUpdate, onDelete, onEdit }) => {
const [showTools, setShowTools] = useState(false);
const [isEditingNote, setIsEditingNote] = useState(false);
const [noteContent, setNoteContent] = useState(commission.description);

const handleStep = (dir: number) => { const idx = STATUS_STEPS.indexOf(commission.status); onUpdateStatus(commission.id, STATUS_STEPS[idx + dir]); };

const handleSaveNote = () => {
    if (onUpdate) {
        onUpdate(commission.id, { description: noteContent });
    }
    setIsEditingNote(false);
};

const handleCancelNote = () => {
    setNoteContent(commission.description);
    setIsEditingNote(false);
};

return (
<div className="bg-white border-2 border-stone-100 rounded-3xl p-6 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
<div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
<div className="flex gap-4">
    {isAdmin && (
      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
          {commission.thumbnailUrl ? <img src={commission.thumbnailUrl} alt="thumbnail" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><Sparkles size={20}/></div>}
      </div>
    )}
    <div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 border mb-2 inline-block">{commission.status}</span>
        <h3 className="text-xl font-bold text-stone-700">{commission.title} <span className="text-sm font-normal text-stone-400">by {commission.clientName}</span></h3>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Calendar size={12}/> {new Date(commission.dateAdded).toLocaleDateString()}</p>
    </div>
</div>
{isAdmin && (
<div className="flex gap-2 w-full sm:w-auto justify-end">
<button onClick={() => setShowTools(!showTools)} className="p-2 bg-stone-50 rounded-xl text-stone-400 hover:text-[#5D4037]"><Sparkles size={20} /></button>
<button onClick={() => onEdit(commission)} className="p-2 bg-stone-50 rounded-xl text-stone-400 hover:text-sky-600"><Edit size={20} /></button>
<button onClick={() => window.confirm("刪除此訂單？") && onDelete(commission.id)} className="p-2 bg-stone-50 rounded-xl text-stone-400 hover:text-red-500"><Trash2 size={20} /></button>
</div>
)}
</div>

{/* Description / Note Section */}
<div className="bg-stone-50 p-4 rounded-2xl mb-4 relative group">
    {isEditingNote ? (
        <div className="animate-in fade-in duration-300">
            <textarea 
                className="w-full bg-white border-2 border-stone-200 rounded-xl p-3 text-sm text-stone-600 outline-none focus:border-[#A1887F] min-h-[100px] resize-none"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                autoFocus
            />
            <div className="flex justify-end gap-2 mt-2">
                <button onClick={handleCancelNote} className="flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-stone-600 px-3 py-1.5 rounded-full hover:bg-stone-200 transition">
                    <X size={14} /> 取消
                </button>
                <button onClick={handleSaveNote} className="flex items-center gap-1 text-xs font-bold text-white bg-[#A1887F] px-4 py-1.5 rounded-full hover:bg-[#8D6E63] transition shadow-sm">
                    <Save size={14} /> 儲存
                </button>
            </div>
        </div>
    ) : (
        <>
            <div className="text-sm text-stone-600 whitespace-pre-wrap min-h-[20px]">{commission.description || "暫無備註"}</div>
            {/* Show edit button for everyone, but specifically targeting client need */}
            <button 
                onClick={() => setIsEditingNote(true)} 
                className={`absolute top-2 right-2 p-1.5 bg-white rounded-full text-stone-300 hover:text-[#A1887F] shadow-sm transition-all ${isAdmin ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} hover:scale-110`}
                title="修改備註"
            >
                <Edit2 size={14} />
            </button>
        </>
    )}
</div>

<ProgressBar currentStatus={commission.status} />
{isAdmin && (
<div className="flex justify-end gap-2 mt-4">
<button onClick={() => handleStep(-1)} disabled={commission.status === STATUS_STEPS[0]} className="px-4 py-2 text-xs font-bold text-stone-400 disabled:opacity-30">上一步</button>
<button onClick={() => handleStep(1)} disabled={commission.status === STATUS_STEPS[STATUS_STEPS.length-1]} className="px-4 py-2 text-xs font-bold bg-[#A1887F] text-white rounded-full">下一步</button>
</div>
)}
{showTools && <AdminTools commission={commission} onClose={() => setShowTools(false)} />}
</div>
);
};