import React from "react";
import { Element } from "../types";
import { ElementCard } from "./ElementCard";

interface CraftingTableProps {
  slot1: Element | null;
  slot2: Element | null;
  onSlotClick: (slot: 1 | 2) => void;
  isProcessing: boolean;
  onCombine: () => void;
  onClear: () => void;
}

export const CraftingTable: React.FC<CraftingTableProps> = ({
  slot1,
  slot2,
  onSlotClick,
  isProcessing,
  onCombine,
  onClear
}) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-slate-800/50 backdrop-blur-lg rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden group">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Synthesis Engine
        </h2>

        <div className="flex items-center justify-center gap-4 w-full">
          {/* Slot 1 */}
          <div 
            onClick={() => slot1 && onSlotClick(1)}
            className={`w-28 h-28 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all ${
              slot1 
                ? "border-transparent" 
                : "border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer"
            }`}
          >
            {slot1 ? (
              <ElementCard element={slot1} size="md" onClick={() => onSlotClick(1)} />
            ) : (
              <span className="text-3xl opacity-20">1</span>
            )}
          </div>

          <span className="text-2xl text-slate-500 font-black">+</span>

          {/* Slot 2 */}
          <div 
             onClick={() => slot2 && onSlotClick(2)}
             className={`w-28 h-28 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all ${
              slot2
                ? "border-transparent" 
                : "border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer"
            }`}
          >
            {slot2 ? (
              <ElementCard element={slot2} size="md" onClick={() => onSlotClick(2)} />
            ) : (
              <span className="text-3xl opacity-20">2</span>
            )}
          </div>
        </div>

        <div className="flex gap-3 w-full">
            <button
                onClick={onClear}
                disabled={!slot1 && !slot2}
                className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-semibold text-slate-200 transition-colors"
            >
                비우기
            </button>
            <button
                onClick={onCombine}
                disabled={!slot1 || !slot2 || isProcessing}
                className={`flex-[2] py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                    ${(!slot1 || !slot2) ? 'bg-slate-700 opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 hover:shadow-blue-500/25 active:scale-95'}
                `}
            >
                {isProcessing ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        융합 중...
                    </>
                ) : (
                    <>
                        <span className="text-lg">✨</span> 융합하기
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};
