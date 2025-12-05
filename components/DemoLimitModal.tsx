import React from "react";

interface DemoLimitModalProps {
  onClose: () => void;
}

export const DemoLimitModal: React.FC<DemoLimitModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-sm w-full flex flex-col items-center gap-6 shadow-2xl animate-pop text-center relative overflow-hidden">
        {/* Warning stripes background */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%,rgba(255,255,255,0.05)_100%)] bg-[length:20px_20px] opacity-20 pointer-events-none" />

        <div className="text-5xl animate-bounce">🚧</div>
        
        <h2 className="text-2xl font-black text-white relative z-10">
          데모 버전 종료
        </h2>
        
        <p className="text-slate-300 leading-relaxed text-sm relative z-10">
          이 게임은 데모입니다.<br/>
          더 게임을 플레이하고 싶다면<br/>
          <span className="text-blue-400 font-bold">게임을 만들어달라고 응원해주세요!</span>
        </p>
        
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-bold rounded-xl transition-all shadow-lg relative z-10"
        >
          확인
        </button>
      </div>
    </div>
  );
};
