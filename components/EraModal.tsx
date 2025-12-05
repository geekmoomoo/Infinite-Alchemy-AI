import React from "react";
import { Era } from "../types";

interface EraModalProps {
  era: Era;
  onClose: () => void;
}

export const EraModal: React.FC<EraModalProps> = ({ era, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-lg text-center">
        {/* Background Animation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        
        <div className="relative z-10 animate-pop">
            <h3 className="text-blue-400 font-bold tracking-[0.3em] uppercase mb-4 animate-bounce">
                Evolution Complete
            </h3>
            
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-400 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                {era.name}
            </h1>
            
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-12 max-w-md mx-auto">
                {era.description}<br/>
                새로운 가능성이 열렸습니다.
            </p>
            
            <button
                onClick={onClose}
                className="px-10 py-4 bg-white text-black font-bold text-lg rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
                탐험 시작하기
            </button>
        </div>
      </div>
    </div>
  );
};