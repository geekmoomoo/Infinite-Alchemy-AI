import React, { useState, useEffect, useCallback } from "react";
import { Element, GameState, Era } from "./types";
import { combineElements, generateElementImage } from "./services/geminiService";
import { ElementCard } from "./components/ElementCard";
import { CraftingTable } from "./components/CraftingTable";
import { NewDiscoveryModal } from "./components/NewDiscoveryModal";
import { DemoLimitModal } from "./components/DemoLimitModal";
import { CollectionModal } from "./components/CollectionModal";
import { EndingModal } from "./components/EndingModal";
import { MissionModal } from "./components/MissionModal";
import { EraModal } from "./components/EraModal";

const INITIAL_ELEMENTS: Element[] = [
  { id: "water", name: "물", emoji: "💧", color: "#3b82f6", discoveredAt: 0, description: "모든 생명의 근원이 되는 맑은 액체입니다." },
  { id: "fire", name: "불", emoji: "🔥", color: "#ef4444", discoveredAt: 0, description: "따뜻하지만 위험한 파괴와 창조의 힘입니다." },
  { id: "earth", name: "흙", emoji: "🌱", color: "#84cc16", discoveredAt: 0, description: "생명이 자라나는 단단한 대지입니다." },
  { id: "air", name: "바람", emoji: "💨", color: "#94a3b8", discoveredAt: 0, description: "보이지 않지만 어디에나 흐르는 기체입니다." },
];

const STORAGE_KEY = "infinite-alchemy-state-v4"; 
const DEMO_LIMIT = 50;

// Define Eras and Missions
const ERAS: Era[] = [
  {
    id: "primitive",
    name: "원시 시대",
    description: "자연의 힘을 다루고 생명을 창조하는 태초의 시기입니다.",
    color: "#84cc16",
    missions: [
      { id: "p1", targetName: "진흙", description: "물과 흙을 섞어 땅의 기초를 만드세요.", hint: "물 + 흙" },
      { id: "p2", targetName: "에너지", description: "눈에 보이지 않는 힘을 발견하세요.", hint: "불 + 바람" },
      { id: "p3", targetName: "생명", description: "태초의 생명체를 탄생시키세요.", hint: "에너지 + 진흙 (또는 늪)" },
      { id: "p4", targetName: "돌", description: "단단한 광물을 발견하세요.", hint: "불 + 흙 (용암) + 공기 -> 식히기" },
      { id: "p_end", targetName: "인간", description: "지능을 가진 존재의 탄생. 문명의 시작입니다.", hint: "생명 + 흙 (또는 점토)", isEraClimax: true },
    ]
  },
  {
    id: "civilization",
    name: "문명 시대",
    description: "도구를 사용하고 사회를 형성하며 기술이 싹트는 시기입니다.",
    color: "#f59e0b",
    missions: [
      { id: "c1", targetName: "도구", description: "인간이 사용할 도구를 만드세요.", hint: "인간 + 돌 (또는 금속)" },
      { id: "c2", targetName: "금속", description: "불을 이용해 단단한 물질을 제련하세요.", hint: "불 + 돌" },
      { id: "c3", targetName: "증기", description: "동력의 기초가 될 증기를 만드세요.", hint: "물 + 불" },
      { id: "c4", targetName: "집", description: "인간이 살 곳을 마련하세요.", hint: "인간 + 벽돌 (또는 나무)" },
      { id: "c_end", targetName: "전기", description: "밤을 밝히고 기계를 움직일 힘을 찾으세요.", hint: "금속 + 에너지 (또는 번개)", isEraClimax: true },
    ]
  },
  {
    id: "modern",
    name: "현대 시대",
    description: "과학과 정보가 폭발적으로 발전하는 시기입니다.",
    color: "#3b82f6",
    missions: [
      { id: "m1", targetName: "전구", description: "세상을 밝히는 발명품.", hint: "전기 + 유리" },
      { id: "m2", targetName: "자동차", description: "빠르게 이동할 수 있는 수단.", hint: "엔진 + 금속 (또는 수레)" },
      { id: "m3", targetName: "컴퓨터", description: "계산하고 생각하는 기계.", hint: "전기 + 도구 (또는 실리콘)" },
      { id: "m4", targetName: "인터넷", description: "세상을 하나로 연결하는 망.", hint: "컴퓨터 + 컴퓨터 (또는 전기)" },
      { id: "m_end", targetName: "인공지능", description: "스스로 생각하는 기계. 새로운 종의 탄생.", hint: "컴퓨터 + 생명 (또는 뇌)", isEraClimax: true },
    ]
  },
  {
    id: "future",
    name: "미래 시대",
    description: "지구를 넘어 우주와 초월적인 영역으로 나아갑니다.",
    color: "#a855f7",
    missions: [
      { id: "f1", targetName: "로봇", description: "인간을 닮은 기계.", hint: "인공지능 + 금속" },
      { id: "f2", targetName: "사이보그", description: "기계와 인간의 결합.", hint: "인간 + 로봇" },
      { id: "f3", targetName: "타임머신", description: "시간을 여행하는 기계.", hint: "시계 + 에너지 (또는 블랙홀)" },
      { id: "f_end", targetName: "우주", description: "모든 것의 끝이자 시작.", hint: "별 + 하늘 (또는 무한)", isEraClimax: true },
    ]
  }
];

export default function App() {
  const [inventory, setInventory] = useState<Element[]>(INITIAL_ELEMENTS);
  const [recipes, setRecipes] = useState<Record<string, string>>({});
  const [slot1, setSlot1] = useState<Element | null>(null);
  const [slot2, setSlot2] = useState<Element | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>(""); // Added for image gen status
  
  // Progression
  const [currentEraIndex, setCurrentEraIndex] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [combineCount, setCombineCount] = useState(0); // Track combinations for MEME trigger

  // Modals
  const [newDiscovery, setNewDiscovery] = useState<Element | null>(null);
  const [showDemoLimit, setShowDemoLimit] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [showEnding, setShowEnding] = useState<Element | null>(null);
  const [showMissions, setShowMissions] = useState(false);
  const [showEraUpgrade, setShowEraUpgrade] = useState<Era | null>(null);

  // Load game state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: GameState = JSON.parse(saved);
        setInventory(parsed.inventory || INITIAL_ELEMENTS);
        setRecipes(parsed.recipes || {});
        setCurrentEraIndex(parsed.currentEraIndex || 0);
        setCompletedMissions(parsed.completedMissions || []);
        // Note: combineCount is ephemeral, no need to persist for this fun mechanic
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
  }, []);

  // Save game state
  useEffect(() => {
    const state: GameState = { 
      inventory, 
      recipes, 
      currentEraIndex,
      completedMissions
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [inventory, recipes, currentEraIndex, completedMissions]);

  const handleElementClick = (element: Element) => {
    // If element is marked as NEW, clear it upon use
    if (element.isNew) {
      setInventory(prev => prev.map(el => el.id === element.id ? { ...el, isNew: false } : el));
    }
    
    // Use the clean version for the slot (so it doesn't show NEW in the slot)
    const cleanElement = { ...element, isNew: false };

    if (!slot1) {
      setSlot1(cleanElement);
    } else if (!slot2) {
      setSlot2(cleanElement);
    } else {
      setSlot2(cleanElement);
    }
  };

  const handleSlotClick = (slot: 1 | 2) => {
    if (slot === 1) setSlot1(null);
    if (slot === 2) setSlot2(null);
  };

  const clearSlots = () => {
    setSlot1(null);
    setSlot2(null);
  };

  const checkProgress = (elementName: string) => {
    const currentEra = ERAS[currentEraIndex];
    if (!currentEra) return;

    let missionCompleted = false;
    let newCompletedMissions = [...completedMissions];

    // Check current era missions
    currentEra.missions.forEach(mission => {
      if (!newCompletedMissions.includes(mission.id) && mission.targetName === elementName) {
        newCompletedMissions.push(mission.id);
        missionCompleted = true;
      }
    });

    if (missionCompleted) {
      setCompletedMissions(newCompletedMissions);

      // Check if ALL missions in current era are done
      const allCurrentMissionsDone = currentEra.missions.every(m => newCompletedMissions.includes(m.id));
      
      if (allCurrentMissionsDone) {
        // Unlock Next Era
        if (currentEraIndex < ERAS.length - 1) {
           const nextEra = ERAS[currentEraIndex + 1];
           // Delay slightly to show item discovery first
           setTimeout(() => {
             setCurrentEraIndex(prev => prev + 1);
             setShowEraUpgrade(nextEra);
           }, 2000);
        } else {
          // Game Clear (After Future Era)
          const universeEl = inventory.find(e => e.name === "우주") || { 
            id: 'universe', name: '우주', emoji: '🌌', color: '#000', discoveredAt: Date.now() 
          };
          setTimeout(() => setShowEnding(universeEl), 2000);
        }
      }
    }
  };

  const handleCombine = useCallback(async () => {
    if (inventory.length >= DEMO_LIMIT) {
      setShowDemoLimit(true);
      return;
    }

    if (!slot1 || !slot2 || isProcessing) return;

    const ids = [slot1.id, slot2.id].sort();
    const comboId = ids.join("+");
    
    // Get current active missions for this era to guide the AI
    const currentEra = ERAS[currentEraIndex];
    const activeMissionTargets = currentEra.missions
      .filter(m => !completedMissions.includes(m.id))
      .map(m => m.targetName);

    // Check if we have a cached recipe
    let previousResultName: string | undefined = undefined;
    if (recipes[comboId]) {
      const cachedResult = recipes[comboId];
      const cachedElement = inventory.find((e) => e.name === cachedResult);
      
      const isCachedResultMissionTarget = activeMissionTargets.includes(cachedResult);
      
      if (isCachedResultMissionTarget && cachedElement) {
        setNewDiscovery({ ...cachedElement, isNew: false });
        checkProgress(cachedResult);
        setSlot1(null);
        setSlot2(null);
        return;
      }

      previousResultName = cachedResult;
    }

    setIsProcessing(true);
    setProcessingStatus(""); // Reset status

    try {
      setCombineCount(prev => prev + 1);
      const currentEraName = ERAS[currentEraIndex].name;
      
      // Force MEME every 30 combinations
      const forceMeme = combineCount > 0 && combineCount % 30 === 0;

      // 1. Generate Text Result
      const result = await combineElements(
        slot1, 
        slot2, 
        currentEraName, 
        activeMissionTargets,
        previousResultName,
        forceMeme
      );

      // 2. If it's a MEME, generate an image!
      if (result.rarity === "MEME") {
         setProcessingStatus("이미지 생성 중... 🎨");
         const imageUrl = await generateElementImage(result.name, result.description);
         if (imageUrl) {
            result.imageUrl = imageUrl;
         }
      }

      // Update recipe to the NEW result (Refining knowledge)
      setRecipes((prev) => ({ ...prev, [comboId]: result.name }));

      const existingElement = inventory.find((e) => e.name === result.name);

      if (existingElement) {
        // If it gained an image and didn't have one before, update it
        const needsUpdate = result.imageUrl && !existingElement.imageUrl;
        
        const foundEl: Element = {
          id: existingElement.id,
          ...result,
          imageUrl: result.imageUrl || existingElement.imageUrl, // Prefer new image
          discoveredAt: existingElement.discoveredAt,
          isNew: false,
        };
        
        if (needsUpdate) {
            setInventory(prev => prev.map(el => el.id === foundEl.id ? foundEl : el));
        }

        setNewDiscovery(foundEl);
        checkProgress(foundEl.name);
      } else {
        const newEl: Element = {
          id: Date.now().toString(),
          ...result,
          discoveredAt: Date.now(),
          isNew: true,
        };

        setInventory(prev => [newEl, ...prev]);
        setNewDiscovery(newEl);
        checkProgress(newEl.name);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
      setSlot1(null);
      setSlot2(null);
    }
  }, [slot1, slot2, isProcessing, inventory, recipes, currentEraIndex, completedMissions, combineCount]);

  const handleCloseDiscovery = () => {
    // Clear isNew flag in inventory for the currently discovered element
    if (newDiscovery && newDiscovery.isNew) {
      setInventory(prev => prev.map(el => 
        el.id === newDiscovery.id ? { ...el, isNew: false } : el
      ));
    }
    setNewDiscovery(null);
    if (inventory.length >= DEMO_LIMIT && !showEraUpgrade && !showEnding) {
      setTimeout(() => setShowDemoLimit(true), 500);
    }
  };

  const sortedInventory = inventory.sort((a, b) => b.discoveredAt - a.discoveredAt);
  const currentEra = ERAS[currentEraIndex];
  const nextEra = ERAS[currentEraIndex + 1];

  // Calculate Era Progress
  const currentEraMissions = currentEra.missions;
  const completedCount = currentEraMissions.filter(m => completedMissions.includes(m.id)).length;
  const progressPercent = (completedCount / currentEraMissions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-900 pb-20 relative overflow-x-hidden">
      {/* Header */}
      <header className="px-6 py-6 max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Infinite Alchemy AI
            </h1>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
             <button
              onClick={() => setShowMissions(true)}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-sm transition-colors border border-slate-700 flex items-center justify-center gap-2 shadow-sm relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                 <span>📜</span> 시대 미션
              </span>
              <div 
                 className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-500" 
                 style={{width: `${progressPercent}%`}}
              />
            </button>
            <button
              onClick={() => setShowCollection(true)}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-sm transition-colors border border-slate-700 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>📖</span> 도감
            </button>
          </div>
        </div>
        
        {/* Era Banner */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 backdrop-blur-sm relative overflow-hidden">
           {/* Background Era Color tint */}
           <div 
             className="absolute inset-0 opacity-10 transition-colors duration-1000"
             style={{ backgroundColor: currentEra.color }}
           />

           <div className="relative z-10 flex justify-between items-center">
              <div>
                  <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/10 text-white uppercase tracking-wider">
                          Current Era
                      </span>
                      <span className="text-xs text-slate-400">
                        {completedCount} / {currentEraMissions.length} Missions
                      </span>
                  </div>
                  <h2 className="text-3xl font-black text-white drop-shadow-lg flex items-center gap-3">
                     {currentEra.name}
                     <span className="text-2xl animate-bounce">
                       {currentEraIndex === 0 ? '🦴' : currentEraIndex === 1 ? '🏰' : currentEraIndex === 2 ? '💻' : '🚀'}
                     </span>
                  </h2>
                  <p className="text-slate-400 text-sm mt-1 max-w-md">
                      {currentEra.description}
                  </p>
              </div>
              
              <div className="hidden sm:block text-right opacity-50">
                  <div className="text-xs text-slate-500 uppercase font-bold">Next Era</div>
                  <div className="font-bold text-slate-400">{nextEra ? nextEra.name : "End of Time"}</div>
              </div>
           </div>
        </div>
      </header>

      <main className="container mx-auto px-4 flex flex-col gap-8 max-w-4xl">
        <section className="sticky top-2 z-30">
          <CraftingTable
            slot1={slot1}
            slot2={slot2}
            onSlotClick={handleSlotClick}
            isProcessing={isProcessing}
            processingStatus={processingStatus}
            onCombine={handleCombine}
            onClear={clearSlots}
          />
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-300 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
              인벤토리
              <span className="text-xs font-normal text-slate-500 ml-2">({inventory.length} / {DEMO_LIMIT})</span>
            </h2>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4 pb-12">
            {sortedInventory.map((item) => (
              <ElementCard
                key={item.id}
                element={item}
                onClick={() => handleElementClick(item)}
                selected={slot1?.id === item.id || slot2?.id === item.id}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Modals */}
      {newDiscovery && (
        <NewDiscoveryModal
          element={newDiscovery}
          onClose={handleCloseDiscovery}
        />
      )}

      {showDemoLimit && (
        <DemoLimitModal onClose={() => setShowDemoLimit(false)} />
      )}

      {showCollection && (
        <CollectionModal 
          inventory={inventory}
          onClose={() => setShowCollection(false)}
        />
      )}
      
      {showMissions && (
        <MissionModal 
          eras={ERAS}
          currentEraIndex={currentEraIndex}
          completedMissions={completedMissions}
          onClose={() => setShowMissions(false)}
        />
      )}

      {showEraUpgrade && (
        <EraModal 
          era={showEraUpgrade}
          onClose={() => setShowEraUpgrade(null)}
        />
      )}

      {showEnding && (
        <EndingModal 
          element={showEnding} 
          onClose={() => setShowEnding(null)} 
        />
      )}
    </div>
  );
}