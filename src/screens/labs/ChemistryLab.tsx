import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FlaskConical, ChevronLeft, Atom, ClipboardList, X } from 'lucide-react';

// Komponentlar (Sizdagi bor fayllar)
import ElementCard from '../../components/ElementCard';
import Beaker from '../../components/Beaker';
import ReactionResultCard from '../../components/ReactionResultCard';
import ElementDetailModal from '../../components/ElementDetailModal';

// Ma'lumotlar va Turlar
import { ELEMENTS } from '../../constants';
import { ElementData, ReactionResult } from '../../types';
import { analyzeReaction } from '../../services/geminiService';

// --- REAKSIYALAR REFERENCE MA'LUMOTLARI ---
const REACTION_REFERENCE = [
  { equation: "Ag + S -> Ag₂S", name: "Kumush sulfid", type: "Qorayish / Sintez", desc: "Kumush buyumlar havodagi oltingugurt bilan reaksiyaga kirishib, qora rangli kumush sulfid qatlamini hosil qiladi." },
  { equation: "Al + Cl -> AlCl₃", name: "Alyuminiy xlorid", type: "Ekzotermik Sintez", desc: "Alyuminiy xlor gazi bilan shiddatli reaksiyaga kirishib, oq tutun (Alyuminiy xlorid) hosil qiladi." },
  { equation: "Al + O -> Al₂O₃", name: "Alyuminiy oksidi", type: "Oksidlanish", desc: "Alyuminiy sirti havoda darhol yupqa va mustahkam oksid qatlami bilan qoplanadi." },
  { equation: "Au + H -> Reaksiya yo'q", name: "-", type: "Inert", desc: "Oltin (Au) juda passiv metall bo'lib, vodorod bilan reaksiyaga kirishmaydi." },
  { equation: "Au + O -> Reaksiya yo'q", name: "-", type: "Inert", desc: "Oltin asil metall bo'lgani uchun kislorodda zanglamaydi va oksidlanmaydi." },
  { equation: "C + H -> CH₄", name: "Metan", type: "Sintez", desc: "Uglerod va vodorod yuqori haroratda birikib, tabiiy gazning asosiy tarkibiy qismi - Metanni hosil qiladi." },
  { equation: "C + O -> CO₂", name: "Karbonat angidrid", type: "Yonish", desc: "Ko'mir kislorodda yonib, karbonat angidrid gazini hosil qiladi." },
  { equation: "Ca + O -> CaO", name: "Kalsiy oksidi", type: "Yonish", desc: "Kalsiy havoda yonib, so'ndirilmagan ohak (CaO) hosil qiladi." },
  { equation: "Cl + H -> HCl", name: "Xlorovodorod", type: "Portlovchi Sintez", desc: "Vodorod va Xlor aralashmasi yorug'lik tushganda portlab, xlorovodorod gazini hosil qiladi." },
  { equation: "Cl + K -> KCl", name: "Kaliy xlorid", type: "Sintez", desc: "Kaliy xlor gazi bilan juda shiddatli reaksiyaga kirishib, kaliy xlorid tuzini hosil qiladi." },
  { equation: "Cl + Na -> NaCl", name: "Osh tuzi", type: "Sintez", desc: "Natriy va Xlor birikib, kundalik hayotda ishlatiladigan osh tuzini hosil qiladi." },
  { equation: "Cu + O -> CuO", name: "Mis(II) oksidi", type: "Oksidlanish", desc: "Qizil mis qizdirilganda qorayib, qora rangli mis oksidi hosil qiladi." },
  { equation: "Fe + O -> Fe₂O₃", name: "Zang", type: "Korroziya", desc: "Temir kislorod va namlik ta'sirida zanglaydi." },
  { equation: "Fe + S -> FeS", name: "Temir sulfid", type: "Birikish", desc: "Temir va oltingugurt aralashmasi qizdirilganda 'cho'g'lanib', temir sulfid hosil qiladi." },
  { equation: "H + He -> Reaksiya yo'q", name: "-", type: "Inert", desc: "Geliy inert gaz, u vodorod bilan birikmaydi." },
  { equation: "H + N -> NH₃", name: "Ammiak", type: "Sintez (Haber)", desc: "Azot va vodorod yuqori bosimda ammiak hosil qiladi." },
  { equation: "H + O -> H₂O", name: "Suv", type: "Portlovchi Sintez", desc: "Vodorod va kislorod aralashmasi uchqun ta'sirida portlab suv hosil qiladi." },
  { equation: "He + O -> Reaksiya yo'q", name: "-", type: "Inert", desc: "Geliy asil gaz bo'lib, kislorod bilan yonmaydi ham, birikmaydi ham." },
  { equation: "Mg + O -> MgO", name: "Magniy oksidi", type: "Yonish", desc: "Magniy ko'zni qamashtiruvchi oq yorug'lik bilan yonib, oq kukun (Magniy oksidi) hosil qiladi." },
  { equation: "Ne + O -> Reaksiya yo'q", name: "-", type: "Inert", desc: "Neon inert gazdir." },
  { equation: "C + H + O -> C₆H₁₂O₆", name: "Glyukoza", type: "Fotosintez", desc: "Uglerod, vodorod va kislorod tirik organizmlarda glyukoza kabi murakkab moddalarni hosil qiladi." },
  { equation: "H + O + S -> H₂SO₄", name: "Sulfat kislota", type: "Sintez", desc: "Oltingugurt oksidlari suv bilan birikib sulfat kislota hosil qiladi." },
  { equation: "Al + S -> Al₂S₃", name: "Alyuminiy sulfid", type: "Sintez", desc: "Alyuminiy va oltingugurt yuqori haroratda birikib, alyuminiy sulfidini hosil qiladi." },
  { equation: "Au + Cl -> AuCl₃", name: "Oltin xlorid", type: "Sintez", desc: "Oltin xlor bilan reaksiyaga kirishib, oltin xloridini hosil qiladi (yuqori haroratda)." },
  { equation: "C + S -> CS₂", name: "Uglerod disulfid", type: "Sintez", desc: "Uglerod va oltingugurt yuqori haroratda birikib, uglerod disulfidini hosil qiladi." },
  { equation: "Ca + Cl -> CaCl₂", name: "Kalsiy xlorid", type: "Sintez", desc: "Kalsiy va xlor birikib, kalsiy xlorid tuzini hosil qiladi." },
  { equation: "Cl + S -> S₂Cl₂", name: "Oltingugurt dixlorid", type: "Sintez", desc: "Xlor va oltingugurt birikib, oltingugurt dixloridini hosil qiladi." },
  { equation: "Cu + S -> CuS", name: "Mis sulfid", type: "Sintez", desc: "Mis va oltingugurt qizdirilganda mis sulfidini hosil qiladi." },
  { equation: "Cl + Fe -> FeCl₃", name: "Temir xlorid", type: "Sintez", desc: "Temir va xlor birikib, temir xloridini hosil qiladi." },
  { equation: "H + S -> H₂S", name: "Vodorod sulfid", type: "Sintez", desc: "Vodorod va oltingugurt birikib, vodorod sulfid gazini (tuxum hidi) hosil qiladi." },
  { equation: "Cl + Mg -> MgCl₂", name: "Magniy xlorid", type: "Sintez", desc: "Magniy va xlor birikib, magniy xloridini hosil qiladi." },
  { equation: "N + O -> NO", name: "Azot oksid", type: "Sintez", desc: "Azot va kislorod yuqori haroratda birikib, azot oksidini hosil qiladi." },
  { equation: "Na + O -> Na₂O", name: "Natriy oksid", type: "Oksidlanish", desc: "Natriy kislorod bilan reaksiyaga kirishib, natriy oksidini hosil qiladi." },
  { equation: "K + S -> K₂S", name: "Kaliy sulfid", type: "Sintez", desc: "Kaliy va oltingugurt birikib, kaliy sulfidini hosil qiladi." },
  { equation: "O + Zn -> ZnO", name: "Sink oksid", type: "Yonish", desc: "Sink kislorodda yonib, oq kukunli sink oksidini hosil qiladi." },
  { equation: "O + S -> SO₂", name: "Oltingugurt dioksid", type: "Yonish", desc: "Oltingugurt kislorodda yonib, oltingugurt dioksid gazini hosil qiladi." },
  { equation: "O + P -> P₂O₅", name: "Fosfor pentoksid", type: "Yonish", desc: "Fosfor kislorodda shiddatli yonib, fosfor pentoksidini hosil qiladi." },
  { equation: "C + H + C -> C₂H₂", name: "Asetilen", type: "Org. Sintez", desc: "Uglerod va vodorod birikib, asetilen gazini hosil qiladi." },
  { equation: "H + N + O -> HNO₃", name: "Azot kislota", type: "Sintez", desc: "Azot oksidlari suv bilan birikib, azot kislotasini hosil qiladi." },
  { equation: "C + H + O -> H₂CO₃", name: "Karbonat kislota", type: "Sintez", desc: "Karbonat angidrid suv bilan birikib, karbonat kislotasini hosil qiladi." },
  { equation: "H + O + P -> H₃PO₄", name: "Fosfor kislota", type: "Sintez", desc: "Fosfor oksidlari suv bilan birikib, fosfor kislotasini hosil qiladi." },
  { equation: "H + N + S -> (NH₄)₂SO₄", name: "Ammonium sulfat", type: "Sintez", desc: "Ammiak va sulfat kislota birikib, ammonium sulfatni hosil qiladi." }
];

const ChemistryLab: React.FC = () => {
  const navigate = useNavigate();
  
  // State (Holat) o'zgaruvchilari
  const [selectedElements, setSelectedElements] = useState<ElementData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<ReactionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewingElement, setViewingElement] = useState<ElementData | null>(null);
  
  // YANGI STATE: Qo'llanma oynasi uchun
  const [showReference, setShowReference] = useState(false);

  // Qidiruv bo'yicha filtrlash
  const filteredElements = useMemo(() => {
    return ELEMENTS.filter(el => 
      el.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      el.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Elementni tanlash yoki o'chirish
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
      
      {/* --- HEADER (Yuqori qism) --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm transition-all">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          
          {/* Chap tomon */}
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

          {/* O'ng tomon: Jadval tugmasi */}
          <button 
            onClick={() => setShowReference(true)}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
            title="Reaksiyalar jadvali"
          >
            <ClipboardList className="w-5 h-5" />
          </button>

        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 flex flex-col gap-6">
        
        {/* QIDIRUV PANELI */}
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

        {/* ELEMENTLAR RO'YXATI */}
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

        {/* REAKSIYA IDISHI */}
        <div id="reaction-area" className="scroll-mt-24 transition-all duration-500">
            <Beaker 
              selectedElements={selectedElements}
              onRemove={removeElement}
              onClear={clearAll}
              onReact={handleReact}
              isAnalyzing={isAnalyzing}
            />
        </div>
        
        {/* NATIJA KARTASI */}
        {result && (
          <div className="animate-slideUp mb-8">
             <ReactionResultCard 
               result={result} 
               onReset={() => setResult(null)} 
             />
          </div>
        )}

      </main>

      {/* ELEMENT BATAFSIL MA'LUMOTI MODAL */}
      {viewingElement && (
        <ElementDetailModal 
          element={viewingElement} 
          atomicNumber={ELEMENTS.findIndex(e => e.symbol === viewingElement.symbol) + 1}
          onClose={() => setViewingElement(null)} 
        />
      )}

      {/* --- 2. JADVAL MODALI (TELEFON UCHUN PASTDAN CHIQADIGAN) --- */}
      {showReference && (
        <>
          {/* Orqa fon (Qoraytirish) */}
          <div 
            className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowReference(false)}
          />

          {/* Pastdan chiquvchi oyna (Bottom Sheet) */}
          <div className="fixed bottom-0 left-0 right-0 z-[70] flex flex-col w-full max-w-md mx-auto bg-white h-[85vh] rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out animate-slideUp">
            
            {/* Tutqich (Vizual) */}
            <div className="flex justify-center pt-3 pb-1 cursor-pointer" onClick={() => setShowReference(false)}>
              <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
            </div>

            {/* Modal Bosh qismi */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-100 p-1.5 rounded-lg">
                  <ClipboardList className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Reaksiyalar Jadvali</h2>
              </div>
              <button 
                onClick={() => setShowReference(false)}
                className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 active:scale-95 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scroll qismi */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 pb-20">
              {REACTION_REFERENCE.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  
                  {/* Formula va Tip */}
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg text-sm border border-indigo-100">
                      {item.equation.split('->')[0]} 
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 px-2 py-1 bg-slate-100 rounded-md border border-slate-200">
                      {item.type}
                    </span>
                  </div>
                  
                  {/* Natija */}
                  <div className="flex items-center gap-3 mb-3 pl-1">
                    <span className="text-slate-300 text-lg">➔</span>
                    <div>
                      <span className="font-bold text-slate-800 text-lg block leading-tight">
                        {item.equation.split('->')[1] || "..."}
                      </span>
                      {item.name !== "-" && (
                        <span className="text-sm text-slate-500 font-medium">
                          {item.name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Tavsif */}
                  <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {item.desc}
                  </div>
                </div>
              ))}
              
              {/* Pastki qismda xavfsiz joy */}
              <div className="h-8"></div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default ChemistryLab;