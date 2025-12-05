import React from "react";
import { Mission, Era } from "../types";

interface MissionModalProps {
  eras: Era[];
  currentEraIndex: number;
  completedMissions: string[];
  onClose: () => void;
}

export const MissionModal: React.FC<MissionModalProps> = ({
  eras,
  currentEraIndex,
  completedMissions,
  onClose,
}) => {
  const isCompleted = (id: string) => completedMissions.includes(id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-pop">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📜</span> 시대의 기록
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              문명을 발전시켜 다음 시대로 나아가세요.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-thin">
          {eras.map((era, index) => {
            const isLocked = index > currentEraIndex;
            const isPast = index < currentEraIndex;
            const isCurrent = index === currentEraIndex;

            return (
              <div key={era.id} className={`relative ${isLocked ? 'opacity-70' : ''}`}>
                {/* Era Header */}
                <div className="flex items-center gap-3 mb-4 sticky top-0 bg-slate-900/95 py-2 z-10 backdrop-blur">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                       isCurrent ? 'bg-blue-600 border-blue-400 text-white animate-pulse' : 
                       isPast ? 'bg-green-600 border-green-400 text-white' : 'bg-slate-700 border-slate-600 text-slate-500'
                   }`}>
                       {index + 1}
                   </div>
                   <div>
                       <h3 className={`font-black text-lg ${isCurrent ? 'text-blue-400' : isLocked ? 'text-slate-500' : 'text-slate-300'}`}>
                           {isLocked ? '???' : era.name}
                       </h3>
                       <p className="text-xs text-slate-500">
                           {isLocked ? '아직 밝혀지지 않은 시대입니다.' : era.description}
                       </p>
                   </div>
                   {isLocked && <span className="ml-auto text-xl">🔒</span>}
                   {isPast && <span className="ml-auto text-xl">✅</span>}
                </div>

                {/* Missions Grid */}
                <div className="grid gap-3 pl-4 border-l-2 border-slate-800 ml-4">
                    {isLocked ? (
                        <div className="p-6 rounded-xl border border-dashed border-slate-700 bg-slate-800/30 flex flex-col items-center justify-center gap-3 text-slate-500">
                             <span className="text-3xl opacity-50">🚧</span>
                             <div className="text-sm font-bold tracking-widest uppercase opacity-50">Locked Era</div>
                             <div className="h-2 w-24 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full w-0 bg-slate-500"></div>
                             </div>
                        </div>
                    ) : (
                        era.missions.map((mission) => {
                            const done = isCompleted(mission.id);
                            return (
                                <div 
                                    key={mission.id}
                                    className={`
                                        p-4 rounded-xl border transition-all flex flex-col gap-2
                                        ${done 
                                            ? "bg-slate-800/40 border-slate-700" 
                                            : mission.isEraClimax 
                                                ? "bg-gradient-to-r from-slate-800 to-purple-900/30 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]" 
                                                : "bg-slate-800 border-slate-600 shadow-md"}
                                    `}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <span className={done ? "text-green-500" : "text-slate-600"}>
                                                {done ? "✔" : "○"}
                                            </span>
                                            <span className={`font-bold ${done ? "text-slate-500 line-through" : "text-slate-200"}`}>
                                                {mission.targetName}
                                            </span>
                                            {mission.isEraClimax && !done && (
                                                <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded font-bold">BOSS</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <p className={`text-sm ${done ? "text-slate-600" : "text-slate-400"}`}>
                                        {mission.description}
                                    </p>

                                    {!done && (
                                        <div className="text-xs text-blue-400 font-medium bg-black/20 p-2 rounded self-start">
                                            💡 힌트: {mission.hint}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
              </div>
            );
          })}
          
          {/* Coming Soon */}
          <div className="text-center py-8 text-slate-600 text-sm">
             더 많은 시대가 업데이트 될 예정입니다.
          </div>
        </div>
      </div>
    </div>
  );
};