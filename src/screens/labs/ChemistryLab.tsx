import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FlaskConical, ChevronLeft, Atom, ClipboardList, X } from 'lucide-react';

// Komponentlar
import ElementCard from '../../components/ElementCard';
import Beaker from '../../components/Beaker';
import ReactionResultCard from '../../components/ReactionResultCard';
import ElementDetailModal from '../../components/ElementDetailModal';

// Ma'lumotlar va Turlar
import { ELEMENTS } from '../../constants';
import { ElementData, ReactionResult } from '../../types';
import { analyzeReaction } from '../../services/geminiService';

// --- YANGILANGAN REAKSIYALAR JADVALI (MOLECULE VIEWER ASOSIDA) ---
const REACTION_REFERENCE = [
  { 
    equation: "H + O -> H₂O", 
    name: "Suv", 
    type: "Portlovchi Sintez", 
    desc: "Vodorod va kislorod aralashmasi uchqun ta'sirida portlab, hayot manbai bo'lgan suvni hosil qiladi." 
  },
  { 
    equation: "Na + Cl -> NaCl", 
    name: "Osh tuzi", 
    type: "Sintez", 
    desc: "Zaharli xlor gazi va faol natriy metali birikib, zararsiz va foydali osh tuzini hosil qiladi." 
  },
  { 
    equation: "C + O -> CO₂", 
    name: "Karbonat angidrid", 
    type: "Yonish", 
    desc: "Uglerod (ko'mir) kislorodda to'liq yonib, rangsiz karbonat angidrid gazini hosil qiladi." 
  },
  { 
    equation: "C + H -> CH₄", 
    name: "Metan", 
    type: "Org. Sintez", 
    desc: "Tabiiy gazning asosiy tarkibiy qismi. Eng oddiy uglevodorod." 
  },
  { 
    equation: "N + H -> NH₃", 
    name: "Ammiak", 
    type: "Sintez (Haber)", 
    desc: "Azot va vodorod yuqori bosim va haroratda birikib, o'tkir hidli ammiak gazini hosil qiladi." 
  },
  { 
    equation: "C + S -> CS₂", 
    name: "Uglerod disulfid", 
    type: "Sintez", 
    desc: "Uglerod va oltingugurt yuqori haroratda reaksiyaga kirishib, zaharli suyuqlik hosil qiladi." 
  },
  { 
    equation: "H + Cl -> HCl", 
    name: "Xlorovodorod", 
    type: "Sintez", 
    desc: "Vodorod xlor bilan birikib, o'tkir hidli gaz hosil qiladi (suvda eritilsa xlorid kislota bo'ladi)." 
  },
  { 
    equation: "Fe + O -> Fe₂O₃", 
    name: "Zang (Temir oksidi)", 
    type: "Korroziya", 
    desc: "Temir havodagi kislorod va namlik ta'sirida asta-sekin yemirilib, qizil-qo'ng'ir zang hosil qiladi." 
  },
  { 
    equation: "H + S -> H₂S", 
    name: "Vodorod sulfid", 
    type: "Sintez", 
    desc: "Vodorod va oltingugurt birikib, sassiq tuxum hidini beruvchi gaz hosil qiladi." 
  },
  { 
    equation: "S + O -> SO₂", 
    name: "Oltingugurt dioksid", 
    type: "Yonish", 
    desc: "Oltingugurt havo rang alanga bilan yonib, o'tkir hidli va bo'g'uvchi gaz chiqaradi." 
  },
  { 
    equation: "C + H -> C₂H₂", 
    name: "Asetilen", 
    type: "Org. Sintez", 
    desc: "Metallarni payvandlash va kesishda ishlatiladigan, juda yuqori haroratda yonuvchi gaz." 
  }
];

const ChemistryLab: React.FC = () => {
  const navigate = useNavigate();
  
  // State (Holat) o'zgaruvchilari
  const [selectedElements, setSelectedElements] = useState<ElementData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<ReactionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewingElement, setViewingElement] = useState<ElementData | null>(null);
  
  // Jadval oynasi uchun state
  const [showReference, setShowReference] = useState(false);

  // Qidiruv bo'yicha filtrlash
  const filteredElements = useMemo(() => {
    return ELEMENTS.filter(el => 
      el.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      el.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Elementni tanlash
  const toggleElement = (element: ElementData) => {
    if (isAnalyzing) return;
    const exists = selectedElements.find(e => e.symbol === element.symbol);
    if (exists) {
      setSelectedElements(prev => prev.filter(e => e.symbol !== element.symbol));
    } else {
      if (selectedElements.length < 5) {
        setSelectedElements(prev => [...prev, element]);
      }
    }
  };

  const removeElement = (element: ElementData) => {
    if (isAnalyzing) return;
    setSelectedElements(prev => prev.filter(e => e.symbol !== element.symbol));
  };

  const clearAll = () => {
    if (isAnalyzing) return;
    setSelectedElements([]);
    setResult(null);
  };

  const handleReact = async () => {
    if (selectedElements.length < 2) return;
    setIsAnalyzing(true);
    setResult(null);
    setTimeout(() => {
        const element = document.getElementById('reaction-area');
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    try {
      const reactantSymbols = selectedElements.map(e => e.symbol);
      const analysis = await analyzeReaction(reactantSymbols);
      setResult(analysis);
    } catch (error) {
      console.error("Reaksiya xatoligi:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-40">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm transition-all">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:scale-95 transition-transform"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg shadow-indigo-200 shadow-lg">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-slate-800">Virtual Lab</h1>
            </div>
          </div>

          <button 
            onClick={() => setShowReference(true)}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
            title="Mavjud reaksiyalar"
          >
            <ClipboardList className="w-5 h-5" />
          </button>

        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 flex flex-col gap-6">
        
        {/* QIDIRUV */}
        <div className="sticky top-14 z-30 bg-slate-50 pb-2 pt-1 -mx-1 px-1">
          <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm ring-1 ring-slate-100 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Element qidirish (masalan: H, O, Na)..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* ELEMENTLAR GRID */}
        {filteredElements.length > 0 ? (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {filteredElements.map((element) => (
              <ElementCard
                key={element.symbol}
                element={element}
                isSelected={!!selectedElements.find(e => e.symbol === element.symbol)}
                onSelect={toggleElement}
                onViewDetails={setViewingElement}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 flex flex-col items-center">
            <Atom className="w-12 h-12 mb-2 opacity-20" />
            <p>Bunday element topilmadi</p>
          </div>
        )}

        <div className="h-4"></div>

        {/* IDISH (BEAKER) */}
        <div id="reaction-area" className="scroll-mt-24 transition-all duration-500">
            <Beaker 
              selectedElements={selectedElements}
              onRemove={removeElement}
              onClear={clearAll}
              onReact={handleReact}
              isAnalyzing={isAnalyzing}
            />
        </div>
        
        {/* NATIJA */}
        {result && (
          <div className="animate-slideUp mb-8">
             <ReactionResultCard 
               result={result} 
               onReset={() => setResult(null)} 
             />
          </div>
        )}

      </main>

      {/* ELEMENT DETAIL MODAL */}
      {viewingElement && (
        <ElementDetailModal 
          element={viewingElement} 
          atomicNumber={ELEMENTS.findIndex(e => e.symbol === viewingElement.symbol) + 1}
          onClose={() => setViewingElement(null)} 
        />
      )}

      {/* --- REAKSIYALAR JADVALI (BOTTOM SHEET) --- */}
      {showReference && (
        <>
          <div 
            className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowReference(false)}
          />

          <div className="fixed bottom-0 left-0 right-0 z-[70] flex flex-col w-full max-w-md mx-auto bg-white h-[85vh] rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out animate-slideUp">
            
            <div className="flex justify-center pt-3 pb-1 cursor-pointer" onClick={() => setShowReference(false)}>
              <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
            </div>

            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-100 p-1.5 rounded-lg">
                  <ClipboardList className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Mavjud Reaksiyalar</h2>
              </div>
              <button 
                onClick={() => setShowReference(false)}
                className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 active:scale-95 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 pb-20">
              <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-sm mb-2 border border-blue-100">
                 ℹ️ Bu ro'yxatda ilovada 3D modeli mavjud bo'lgan asosiy reaksiyalar keltirilgan.
              </div>
              
              {REACTION_REFERENCE.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg text-sm border border-indigo-100">
                      {item.equation.split('->')[0]} 
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 px-2 py-1 bg-slate-100 rounded-md border border-slate-200">
                      {item.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3 pl-1">
                    <span className="text-slate-300 text-lg">➔</span>
                    <div>
                      <span className="font-bold text-slate-800 text-lg block leading-tight">
                        {item.equation.split('->')[1] || "..."}
                      </span>
                      <span className="text-sm text-slate-500 font-medium">
                        {item.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {item.desc}
                  </div>
                </div>
              ))}
              
              <div className="h-8"></div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default ChemistryLab;