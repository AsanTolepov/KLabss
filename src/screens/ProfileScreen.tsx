import React, { useState, useRef } from 'react';
import { User } from '../types';
import { 
  LogOut, Settings, Flame, Zap, Lock, 
  Globe, Moon, Shield, Phone, X, Trash2, Loader2, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { signOut } from 'firebase/auth'; 
import { auth, db, storage } from '../services/firebase'; 
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ACHIEVEMENTS_LIST } from '../constants';

const ProfileScreen = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-slate-50 pb-24 relative overflow-hidden">
      
      {/* --- YANGILANGAN SETTINGS MODAL --- */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal o'lchami va joylashuvi ixchamlashtirildi */}
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-white shrink-0">
                    <h2 className="text-lg font-bold text-gray-800">Sozlamalar</h2>
                    <button onClick={() => setIsSettingsOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all">
                        <X className="w-5 h-5 text-gray-600"/>
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-4 space-y-5">
                    
                    {/* Til */}
                    <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <Globe className="w-4 h-4"/>
                            </div>
                            <span className="font-bold text-gray-700 text-sm">Ilova tili</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">O'zbek</span>
                            <ChevronRight className="w-4 h-4 text-gray-400"/>
                        </div>
                    </div>

                    {/* Xavfsizlik */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Ma'lumotlar</p>
                        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                            <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-4 h-4 text-green-600"/>
                                    <span className="font-medium text-gray-700 text-sm">Maxfiylik siyosati</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300"/>
                            </div>
                            <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-indigo-600"/>
                                    <span className="font-medium text-gray-700 text-sm">Biz bilan bog'lanish</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300"/>
                            </div>
                        </div>
                    </div>

                    {/* HISOBDAN CHIQISH (Endi scroll ichida va ixcham) */}
                    <button 
                        onClick={handleLogout} 
                        className="w-full p-3 bg-red-50 border border-red-100 text-red-500 font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-red-100 active:scale-95 transition-all mt-4"
                    >
                        <LogOut className="w-4 h-4"/> Hisobdan chiqish
                    </button>

                    <div className="text-center pb-2">
                         <p className="text-[10px] text-gray-300">Atomix Academy v1.0.5</p>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* ... QOLGAN PROFILE SCREEN KODI O'ZGARISHSIZ ... */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 pb-16 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
         <div className="flex justify-between items-center mb-6 relative z-10">
          <h1 className="text-xl font-bold text-white">Mening Profilim</h1>
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
                <span>Jami Tajriba</span>
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
                    <div className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Kun streak</div>
                </div>
             </div>

             <div className="flex-1 bg-blue-50 p-3 rounded-2xl flex items-center gap-3 border border-blue-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-500">
                    <Zap className="w-5 h-5 fill-current"/>
                </div>
                <div>
                    <div className="text-lg font-black text-gray-800 leading-none">{user.accuracy || 0}%</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Aniqlik</div>
                </div>
             </div>
          </div>
        </div>

        <div className="mt-6 px-1">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 text-base">Yutuqlarim</h3>
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
                        <h4 className={`text-[11px] font-bold leading-tight ${isUnlocked ? 'text-gray-700' : 'text-gray-400'}`}>{ach.title}</h4>
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