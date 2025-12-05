import React from "react";
import { Element } from "../types";
import { ElementCard } from "./ElementCard";

interface NewDiscoveryModalProps {
  element: Element | null;
  onClose: () => void;
}

export const NewDiscoveryModal: React.FC<NewDiscoveryModalProps> = ({
  element,
  onClose,
}) => {
  if (!element) return null;

  const isNew = element.isNew;
  const rarity = element.rarity || "COMMON";
  const hasImage = !!element.imageUrl;

  const getRarityColor = () => {
    switch(rarity) {
      case "LEGENDARY": return "text-yellow-400";
      case "EPIC": return "text-purple-400";
      case "CURSED": return "text-red-500";
      case "MEME": return "text-pink-400";
      case "RARE": return "text-blue-400";
      default: return "text-slate-400";
    }
  };

  const getRarityTitle = () => {
    switch(rarity) {
        case "LEGENDARY": return "전설적인 발견!";
        case "EPIC": return "대단한 발견!";
        case "CURSED": return "저주받은 혼종...";
        case "MEME": return "ㅋㅋ 이게 뭐야";
        case "RARE": return "희귀한 발견";
        default: return "새로운 발견";
    }
  };

  const isSpecial = rarity !== "COMMON";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className={`
        relative bg-slate-900 border p-8 rounded-3xl max-w-sm w-full flex flex-col items-center gap-6 shadow-2xl animate-pop overflow-hidden
        ${rarity === 'CURSED' ? 'border-red-900' : 'border-slate-700'}
        ${rarity === 'LEGENDARY' ? 'border-yellow-500/50' : ''}
      `}>
        
        {/* Background Effects */}
        {rarity === "LEGENDARY" && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent animate-pulse-slow pointer-events-none" />
        )}
        {rarity === "CURSED" && (
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,_var(--tw-gradient-stops))] from-black via-red-900/20 to-black opacity-50 pointer-events-none" />
        )}
        {rarity === "MEME" && (
             <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[length:20px_20px] opacity-30 pointer-events-none" />
        )}
        
        <div className="z-10 text-center flex flex-col items-center w-full">
            <h3 className={`font-black tracking-widest uppercase mb-2 text-sm ${getRarityColor()} flex items-center gap-2`}>
                {isNew ? '✨ NEW DISCOVERY' : 'REDISCOVERY'}
                {isSpecial && <span className="px-2 py-0.5 bg-white/10 rounded text-[10px]">{rarity}</span>}
            </h3>
            
            <h2 className="text-3xl font-black text-white mb-6 drop-shadow-lg">
                {isNew ? getRarityTitle() : '이미 아는 원소'}
            </h2>
            
            {/* Display Logic */}
            <div className={`flex justify-center mb-6 transform transition-all duration-500 ${isNew ? 'scale-110' : ''} ${rarity === 'MEME' ? 'rotate-3' : ''}`}>
               {hasImage ? (
                   <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 relative group">
                       <img src={element.imageUrl} alt={element.name} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-4">
                           <span className="text-white font-bold text-xl">{element.name}</span>
                       </div>
                   </div>
               ) : (
                   <ElementCard element={element} size="lg" />
               )}
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 w-full mb-6">
                <p className="text-slate-200 font-medium italic">
                "{element.description}"
                </p>
            </div>

            <button
            onClick={onClose}
            className={`w-full py-3 font-bold rounded-xl transition-all active:scale-95 shadow-lg ${
                rarity === 'CURSED' 
                  ? 'bg-red-900 text-red-100 hover:bg-red-800' 
                  : rarity === 'LEGENDARY'
                  ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-500 hover:to-orange-500'
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
            {isNew ? (rarity === 'CURSED' ? '봉인하기' : '수집하기') : '확인'}
            </button>
        </div>
      </div>
    </div>
  );
};