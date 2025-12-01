import React, { useState, useRef } from 'react';
import { User } from '../types';
import { 
  LogOut, Settings, Flame, Zap, Lock, 
  Globe, Shield, Phone, X, Trash2, Loader2, ChevronRight, Check, ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { signOut } from 'firebase/auth'; 
import { auth, db, storage } from '../services/firebase'; 
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ACHIEVEMENTS_LIST } from '../constants';

// I18N IMPORT
import { useTranslation } from 'react-i18next';

const ProfileScreen = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // TARJIMA HOOKI
  const { t, i18n } = useTranslation();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false); // Til menyusi holati
  const [uploading, setUploading] = useState(false);

  const level = user.level || 1;
  const xp = user.xp || 0;
  const nextLevelXp = (level + 1) * 500;
  const progressPercent = (xp / nextLevelXp) * 100;
  const userAchievements = user.achievements || {};
  const unlockedCount = Object.values(userAchievements).filter(val => val === true).length;

  const handleLogout = async () => {
      try { 
        await signOut(auth); 
        navigate('/login', { replace: true });
      } catch (e) { 
        console.error("Chiqishda xatolik:", e); 
      }
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setUploading(true);
        const file = e.target.files[0];
        try {
            const storageRef = ref(storage, `avatars/${user.uid}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            await updateDoc(doc(db, "users", user.uid), { photoURL: downloadURL });
            window.location.reload(); 
        } catch (error) {
            console.error(error);
            alert("Rasmni yuklab bo'lmadi.");
        } finally {
            setUploading(false);
        }
    }
  };

  const handleDeleteImage = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!window.confirm("Profil rasmini o'chirmoqchimisiz?")) return;
      setUploading(true);
      try {
          const storageRef = ref(storage, `avatars/${user.uid}`);
          try { await deleteObject(storageRef); } catch (e) { }
          await updateDoc(doc(db, "users", user.uid), { photoURL: "" });
          window.location.reload();
      } catch (error) { } finally { setUploading(false); }
  };

  // --- TILNI O'ZGARTIRISH FUNKSIYASI ---
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode); // 1. Tilni o'zgartiramiz
    setIsLangMenuOpen(false);      // 2. Menyuni yopamiz (orqaga qaytaramiz)
  };

  // Hozirgi til nomini aniqlash
  const currentLangName = {
    uz: "O'zbek",
    ru: "Русский",
    en: "English"
  }[i18n.language] || "O'zbek";

  return (
    <div className="min-h-screen bg-slate-50 pb-24 relative overflow-hidden">
      
      {/* --- SETTINGS MODAL --- */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[80vh]">
                
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-white shrink-0">
                    {/* Agar til menyusi ochiq bo'lsa, "Orqaga" tugmasi chiqadi */}
                    {isLangMenuOpen ? (
                        <div className="flex items-center gap-2">
                             <button onClick={() => setIsLangMenuOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600">
                                <ChevronLeft className="w-5 h-5" />
                             </button>
                             <h2 className="text-lg font-bold text-gray-800">{t('app_language')}</h2>
                        </div>
                    ) : (
                        <h2 className="text-lg font-bold text-gray-800">{t('settings')}</h2>
                    )}

                    <button onClick={() => setIsSettingsOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all">
                        <X className="w-5 h-5 text-gray-600"/>
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-4 space-y-5 overflow-y-auto">
                    
                    {/* 1. AGAR TIL MENYUSI OCHIQ BO'LSA, FAQAT TILLARNI KO'RSATAMIZ */}
                    {isLangMenuOpen ? (
                        <div className="space-y-2 animate-in slide-in-from-right-5 duration-200">
                            {[
                                { code: 'uz', label: "O'zbek", flag: "🇺🇿" },
                                { code: 'ru', label: "Русский", flag: "🇷🇺" },
                                { code: 'en', label: "English", flag: "🇬🇧" }
                            ].map((lang) => (
                                <div 
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`p-4 rounded-xl flex items-center justify-between cursor-pointer border transition-all active:scale-[0.98]
                                        ${i18n.language === lang.code 
                                            ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                            : 'bg-white border-gray-100 hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{lang.flag}</span>
                                        <span className={`font-bold ${i18n.language === lang.code ? 'text-blue-700' : 'text-gray-700'}`}>
                                            {lang.label}
                                        </span>
                                    </div>
                                    {i18n.language === lang.code && (
                                        <div className="bg-blue-600 rounded-full p-1">
                                            <Check className="w-3 h-3 text-white" strokeWidth={4} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* 2. AGAR YOPIQ BO'LSA, UMUMIY SOZLAMALARNI KO'RSATAMIZ */
                        <div className="space-y-5 animate-in slide-in-from-left-5 duration-200">
                            
                            {/* Tilni tanlash tugmasi */}
                            <div 
                                onClick={() => setIsLangMenuOpen(true)}
                                className="bg-gray-50 p-3 rounded-xl flex items-center justify-between border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                        <Globe className="w-4 h-4"/>
                                    </div>
                                    <span className="font-bold text-gray-700 text-sm">{t('app_language')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                        {currentLangName}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-gray-400"/>
                                </div>
                            </div>

                            {/* Boshqa sozlamalar */}
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Ma'lumotlar</p>
                                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                    <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50">
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-4 h-4 text-green-600"/>
                                            <span className="font-medium text-gray-700 text-sm">{t('privacy')}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300"/>
                                    </div>
                                    <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-indigo-600"/>
                                            <span className="font-medium text-gray-700 text-sm">{t('contact')}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300"/>
                                    </div>
                                </div>
                            </div>

                            {/* CHIQISH */}
                            <button 
                                onClick={handleLogout} 
                                className="w-full p-3 bg-red-50 border border-red-100 text-red-500 font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-red-100 active:scale-95 transition-all mt-4"
                            >
                                <LogOut className="w-4 h-4"/> {t('logout')}
                            </button>

                            <div className="text-center pb-2">
                                <p className="text-[10px] text-gray-300">KLab versiya 2.0</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
      )}

      {/* --- ASOSIY PROFIL (Tarjima qilingan) --- */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 pb-16 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
         <div className="flex justify-between items-center mb-6 relative z-10">
          <h1 className="text-xl font-bold text-white">{t('my_profile')}</h1>
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition border border-white/10 active:scale-90">
            <Settings className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex flex-col items-center relative z-10">
            <div className="relative mb-3 group">
                <div 
                    className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-4xl shadow-2xl border-4 border-white/20 overflow-hidden cursor-pointer relative"
                    onClick={handleImageClick}
                >
                    {uploading ? (
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    ) : user.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-5xl">👨‍🎓</span>
                    )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                
                {user.photoURL && !uploading && (
                    <button 
                        onClick={handleDeleteImage}
                        className="absolute bottom-0 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 border-2 border-white"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                )}
                <div className="absolute top-0 -right-2 bg-yellow-400 text-blue-900 text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                    LVL {level}
                </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white">{user.displayName || user.name || "O'quvchi"}</h2>
            <p className="text-blue-100 text-sm opacity-80">{user.email}</p>
        </div>
      </div>

      <div className="px-6 -mt-10 relative z-20">
        <div className="bg-white p-5 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100">
          <div className="mb-5">
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                <span>{t('total_xp')}</span>
                <span className="text-blue-600">{xp} / {nextLevelXp} XP</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(progressPercent, 100)}%` }}></div>
            </div>
          </div>

          <div className="flex gap-4">
             <div className="flex-1 bg-orange-50 p-3 rounded-2xl flex items-center gap-3 border border-orange-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-orange-500">
                    <Flame className="w-5 h-5 fill-current"/>
                </div>
                <div>
                    <div className="text-lg font-black text-gray-800 leading-none">{user.streak || 0}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{t('streak_day')}</div>
                </div>
             </div>

             <div className="flex-1 bg-blue-50 p-3 rounded-2xl flex items-center gap-3 border border-blue-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-500">
                    <Zap className="w-5 h-5 fill-current"/>
                </div>
                <div>
                    <div className="text-lg font-black text-gray-800 leading-none">{user.accuracy || 0}%</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{t('accuracy')}</div>
                </div>
             </div>
          </div>
        </div>

        <div className="mt-6 px-1">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 text-base">{t('my_achievements')}</h3>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                    {unlockedCount}/{ACHIEVEMENTS_LIST.length}
                </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3 pb-20">
            {ACHIEVEMENTS_LIST.map((ach) => {
                const isUnlocked = userAchievements[ach.id] === true;
                return (
                <div key={ach.id} className={`relative flex flex-col items-center justify-center p-2 py-3 rounded-2xl w-full transition-all duration-300 border ${isUnlocked ? 'bg-white border-white shadow-sm shadow-blue-900/5 scale-100' : 'bg-slate-50 border-slate-100 opacity-60 grayscale'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-2 shadow-sm ${isUnlocked ? 'bg-yellow-50 border border-yellow-100' : 'bg-gray-200 border border-gray-200'}`}>
                        {isUnlocked ? ach.icon : <Lock className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div className="text-center w-full">
                        <h4 className={`text-[11px] font-bold leading-tight ${isUnlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                            {t(`ach_${ach.id}`, { defaultValue: ach.title })}
                        </h4>
                    </div>
                </div>
                );
            })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;