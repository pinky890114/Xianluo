
import React, { useRef, useEffect } from 'react';
import { CommissionStatus } from '../types';
import { STATUS_STEPS } from '../constants';
import { Check } from 'lucide-react';

export const ProgressBar: React.FC<{ currentStatus: CommissionStatus }> = ({ currentStatus }) => {
  const currentIndex = STATUS_STEPS.indexOf(currentStatus);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 當狀態改變時，自動捲動到當前狀態
  useEffect(() => {
    if (scrollRef.current) {
      const activeStep = scrollRef.current.children[currentIndex] as HTMLElement;
      if (activeStep) {
        const containerWidth = scrollRef.current.clientWidth;
        const stepLeft = activeStep.offsetLeft;
        const stepWidth = activeStep.clientWidth;
        
        // 捲動到置中位置
        scrollRef.current.scrollTo({
            left: stepLeft - containerWidth / 2 + stepWidth / 2,
            behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  return (
    <div className="w-full mt-4 mb-2">
      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        className="overflow-x-auto hide-scrollbar pb-6 px-4 relative flex items-start"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {/* Progress Line Background */}
        <div className="absolute top-[15px] left-0 h-1 bg-stone-100 rounded-full w-[1000px] sm:w-full z-0 mx-4"></div>
        
        {/* Active Progress Line */}
        <div 
            className="absolute top-[15px] left-0 h-1 bg-[#A1887F] rounded-full z-0 transition-all duration-500 mx-4"
            style={{ width: `calc(${Math.min((currentIndex / (STATUS_STEPS.length - 1)) * 100, 100)}% * (1000px / 100))` }} // Approximate for mobile width fix
        ></div>

        {/* Steps */}
        {STATUS_STEPS.map((step, index) => (
          <div key={step} className="flex flex-col items-center relative z-10 min-w-[80px] sm:min-w-[90px] snap-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[3px] transition-all duration-300 ${index <= currentIndex ? 'bg-[#A1887F] border-[#A1887F]' : 'bg-white border-stone-200'} ${index === currentIndex ? 'ring-4 ring-[#A1887F]/30 scale-110' : ''}`}>
              {index <= currentIndex ? <Check size={14} className="text-white stroke-[3px]" /> : <div className="w-2 h-2 rounded-full bg-stone-300"></div>}
            </div>
            
            <span className={`mt-3 text-[10px] sm:text-xs font-bold text-center px-1 transition-colors leading-tight ${index === currentIndex ? 'text-[#5D4037]' : 'text-stone-300'}`}>
              {step}
            </span>
          </div>
        ))}

        {/* Fix specifically for desktop to ensure the line stretches if container is wide */}
        <style>{`
           @media (min-width: 640px) {
             .absolute.w-\\[1000px\\] { width: calc(100% - 2rem) !important; }
             div[style*="width: calc"] { width: ${ (currentIndex / (STATUS_STEPS.length - 1)) * 100 }% !important; }
             .min-w-\\[80px\\] { min-width: 0 !important; flex: 1; }
           }
        `}</style>
      </div>
    </div>
  );
};
