import React from 'react';
import { CommissionStatus } from '../types';
import { STATUS_STEPS } from '../constants';
import { Check } from 'lucide-react';
export const ProgressBar: React.FC<{ currentStatus: CommissionStatus }> = ({ currentStatus }) => {
const currentIndex = STATUS_STEPS.indexOf(currentStatus);
return (
<div className="w-full mt-4 mb-2 px-2">
<div className="flex items-center justify-between relative">
<div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-2 bg-stone-200 rounded-full"></div>
<div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-2 bg-[#A1887F] rounded-full transition-all duration-500" style={{ width: `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%` }}></div>
{STATUS_STEPS.map((step, index) => (
<div key={step} className="flex flex-col items-center relative z-10">
<div className={`w-8 h-8 rounded-full flex items-center justify-center border-[3px] transition-all ${index <= currentIndex ? 'bg-[#A1887F] border-[#A1887F]' : 'bg-white border-stone-200'} ${index === currentIndex ? 'ring-4 ring-[#A1887F]/40 scale-110' : ''}`}>
{index <= currentIndex ? <Check size={16} className="text-white stroke-[3px]" /> : <div className="w-2 h-2 rounded-full bg-stone-300"></div>}
</div>
<span className={`absolute top-9 text-[10px] font-bold transition-colors ${index === currentIndex ? 'text-[#5D4037]' : 'text-stone-300'} hidden sm:inline-block`}>{step}</span>
</div>
))}
</div>
</div>
);
};