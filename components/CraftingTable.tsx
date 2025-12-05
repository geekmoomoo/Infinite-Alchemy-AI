import React from "react";
import { Element } from "../types";
import { ElementCard } from "./ElementCard";

interface CraftingTableProps {
  slot1: Element | null;
  slot2: Element | null;
  onSlotClick: (slot: 1 | 2) => void;
  isProcessing: boolean;
  processingStatus?: string;
  onCombine: () => void;
  onClear: () => void;
}

export const CraftingTable: React.FC<CraftingTableProps> = ({
  slot1,
  slot2,
  onSlotClick,
  isProcessing,
  processingStatus,
  onCombine,
  onClear
}) => {
  return (
    <div className="w-full max-w-md mx-auto p-1 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-[2rem] shadow-2xl relative group z-20 transition-all">
      {/* Outer Border Glow */}
      <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-30 blur transition-opacity duration-500 ${isProcessing ? 'opacity-50 animate-pulse' : ''}`}></div>
      
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-[1.8rem] p-5 border border-slate-700/50 relative overflow-hidden">
        {/* Inner Background Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_70%)]" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full px-2">
             <h2 className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Synthesis Engine</h2>
             { (slot1 || slot2) && (
               <button onClick={onClear} className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase tracking-wider transition-colors">
                 Clear All
               </button>
             )}
          </div>

          <div className="flex items-center justify-center gap-2 w-full h-32 relative">
            {/* Slot 1 */}
            <div 
              onClick={() => slot1 && !isProcessing && onSlotClick(1)}
              className={`
                relative w-28 h-28 rounded-2xl flex items-center justify-center transition-all duration-300
                ${isProcessing && slot1 ? 'animate-merge-left' : ''}
                ${slot1 ? "z-10" : "bg-slate-800/50 border-2 border-dashed border-slate-700 hover:border-slate-500 hover:bg-slate-700/50 cursor-pointer"}
              `}
            >
              {slot1 ? (
                <ElementCard element={slot1} size="md" onClick={() => !isProcessing && onSlotClick(1)} />
              ) : (
                <div className="flex flex-col items-center justify-center opacity-20 pointer-events-none">
                  <span className="text-2xl mb-1">⚡</span>
                  <span className="text-xs font-bold">SELECT</span>
                </div>
              )}
            </div>

            {/* Plus Icon / Processing Effect */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 flex items-center justify-center">
               {isProcessing ? (
                 <div className="w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
               ) : (
                 <span className="text-2xl text-slate-600 font-black">+</span>
               )}
            </div>

            {/* Slot 2 */}
            <div 
               onClick={() => slot2 && !isProcessing && onSlotClick(2)}
               className={`
                 relative w-28 h-28 rounded-2xl flex items-center justify-center transition-all duration-300
                 ${isProcessing && slot2 ? 'animate-merge-right' : ''}
                 ${slot2 ? "z-10" : "bg-slate-800/50 border-2 border-dashed border-slate-700 hover:border-slate-500 hover:bg-slate-700/50 cursor-pointer"}
               `}
            >
              {slot2 ? (
                <ElementCard element={slot2} size="md" onClick={() => !isProcessing && onSlotClick(2)} />
              ) : (
                <div className="flex flex-col items-center justify-center opacity-20 pointer-events-none">
                  <span className="text-2xl mb-1">⚡</span>
                  <span className="text-xs font-bold">SELECT</span>
                </div>
              )}
            </div>
          </div>

          <button
              onClick={onCombine}
              disabled={!slot1 || !slot2 || isProcessing}
              className={`
                  w-full py-4 rounded-xl font-black text-white shadow-lg transition-all relative overflow-hidden group/btn
                  ${(!slot1 || !slot2) 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] shadow-blue-500/25 border border-blue-400/30'
                  }
              `}
          >
              {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm font-bold animate-pulse">{processingStatus || "물질 융합 중..."}</span>
                  </div>
              ) : (
                  <div className="flex items-center justify-center gap-2">
                      <span className={`text-xl ${slot1 && slot2 ? 'animate-bounce' : ''}`}>✨</span> 
                      <span className="text-lg">융합하기</span>
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  </div>
              )}
          </button>
        </div>
      </div>
    </div>
  );
};