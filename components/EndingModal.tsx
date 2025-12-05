import React from "react";
import { Element } from "../types";
import { ElementCard } from "./ElementCard";

interface EndingModalProps {
  element: Element;
  onClose: () => void;
}

export const EndingModal: React.FC<EndingModalProps> = ({ element, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping"></div>
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-white rounded-full animate-ping delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="relative z-10 bg-slate-900/80 border border-slate-600 p-8 rounded-3xl max-w-md w-full flex flex-col items-center text-center shadow-[0_0_50px_rgba(139,92,246,0.3)] animate-pop">
        <div className="text-6xl mb-4 animate-bounce">🏆</div>
        
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 text-3xl font-black mb-2">
          GAME CLEAR!
        </h2>
        
        <p className="text-slate-300 mb-8">
          축하합니다!<br/>
          연금술의 정점에 도달하여 <span className="font-bold text-white">"{element.name}"</span>를 창조해냈습니다.
        </p>
        
        <div className="mb-8 transform scale-125">
          <ElementCard element={element} size="lg" selected />
        </div>

        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          하지만 이것이 끝은 아닙니다.<br/>
          세상에는 아직 발견되지 않은 무한한 조합이 남아있습니다.<br/>
          계속해서 새로운 전설을 만들어보세요!
        </p>

        <button
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <span>🚀</span> 계속 플레이하기
        </button>
      </div>
    </div>
  );
};