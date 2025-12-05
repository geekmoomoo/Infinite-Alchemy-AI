import React, { useState } from "react";
import { Element } from "../types";
import { ElementCard } from "./ElementCard";

interface CollectionModalProps {
  inventory: Element[];
  onClose: () => void;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  inventory,
  onClose,
}) => {
  // Sort by discovery time (newest first)
  const sortedInventory = [...inventory].sort((a, b) => b.discoveredAt - a.discoveredAt);
  
  // Default to the most recently discovered element (first in sorted list)
  const [selectedId, setSelectedId] = useState<string>(
    sortedInventory[0]?.id || ""
  );

  const selectedElement = inventory.find(e => e.id === selectedId) || sortedInventory[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-pop">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📖</span> 요소 도감
            <span className="text-sm font-normal text-slate-400 ml-2">
              ({inventory.length}개 발견)
            </span>
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
          {/* Left: Detail View */}
          <div className="p-6 md:w-5/12 flex flex-col items-center justify-center bg-slate-800/30 border-b md:border-b-0 md:border-r border-slate-700 z-10 shrink-0">
             {selectedElement ? (
               <div key={selectedElement.id} className="flex flex-col items-center text-center animate-pop w-full"> 
                 <div className="mb-6 transform scale-110">
                    <ElementCard element={selectedElement} size="lg" /> 
                 </div>
                 
                 <h3 className="text-2xl font-black text-white mb-1">{selectedElement.name}</h3>
                 
                 <div className="w-full mt-4 px-4 py-4 bg-slate-800/80 rounded-xl border border-slate-700/50 shadow-inner">
                    <p className="text-slate-300 italic text-sm leading-relaxed">
                      "{selectedElement.description || '설명이 없습니다.'}"
                    </p>
                 </div>
                 
                 <div className="mt-6 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                    DISCOVERED AT<br/>
                    {new Date(selectedElement.discoveredAt).toLocaleDateString()} {new Date(selectedElement.discoveredAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </div>
               </div>
             ) : (
                <div className="text-slate-500">선택된 요소가 없습니다.</div>
             )}
          </div>

          {/* Right: Grid View */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-900/50 scrollbar-thin">
             <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-3 content-start pb-8">
                {sortedInventory.map(item => (
                    <div key={item.id} className="flex justify-center">
                        <ElementCard 
                            element={item} 
                            size="sm" 
                            onClick={() => setSelectedId(item.id)}
                            selected={selectedId === item.id}
                        />
                    </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};