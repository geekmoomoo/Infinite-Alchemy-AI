import React from "react";

interface SettingsModalProps {
  onClose: () => void;
  onReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onReset }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-xs w-full shadow-2xl animate-pop relative overflow-hidden">
        
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>⚙️</span> 설정
            </h2>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">✕</button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h3 className="text-sm font-bold text-slate-300 mb-2">데이터 관리</h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                현재까지의 모든 진행 상황(발견한 요소, 레시피, 미션 등)을 삭제하고 초기 상태로 되돌립니다.
              </p>
              <button 
                onClick={() => {
                    if(window.confirm("정말로 초기화하시겠습니까? 모든 데이터가 영구적으로 삭제됩니다.")) {
                        onReset();
                    }
                }}
                className="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 hover:text-red-300 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 group"
              >
                <span>🗑️</span> 데이터 초기화
              </button>
          </div>

          <div className="text-center pt-2">
             <p className="text-[10px] text-slate-600">
                Infinite Alchemy AI
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};