import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Award, User as UserIcon, FlaskConical } from 'lucide-react';
// 1. IMPORT
import { useTranslation } from 'react-i18next';

const Layout = ({ children }: { children?: React.ReactNode }) => {
    const location = useLocation();
    // 2. HOOK
    const { t } = useTranslation();
    
    const hideNav = location.pathname === '/login' || location.pathname.includes('/lesson/');

    return (
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden relative flex flex-col">
            <div className="flex-1">
                {children}
            </div>
            
            {!hideNav && (
                <div className="fixed bottom-0 max-w-md w-full bg-white/90 backdrop-blur-lg border-t border-gray-100 flex justify-around py-3 pb-6 z-50 text-gray-400 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                    
                    {/* 1. ASOSIY (Home) */}
                    <Link to="/app" className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${location.pathname === '/' || location.pathname === '/app' ? 'text-blue-600 bg-blue-50 scale-110' : 'hover:text-gray-600'}`}>
                        <Home className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold">{t('all')}</span> {/* Yoki t('home') agar i18n.ts ga qo'shsangiz */}
                    </Link>

                    {/* 2. LABORATORIYA (Lab) */}
                    <Link to="/app/laboratory" className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${location.pathname === '/app/laboratory' ? 'text-indigo-600 bg-indigo-50 scale-110' : 'hover:text-gray-600'}`}>
                        <FlaskConical className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold">Lab</span> {/* Bu so'z qisqa bo'lgani uchun o'zgarmasa ham bo'ladi yoki t('laboratory') */}
                    </Link>

                    {/* 3. REYTING (Leaderboard) */}
                    <Link to="/app/leaderboard" className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${location.pathname === '/app/leaderboard' ? 'text-blue-600 bg-blue-50 scale-110' : 'hover:text-gray-600'}`}>
                        <Award className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold">{t('leaderboard')}</span>
                    </Link>

                    {/* 4. PROFIL (Profile) */}
                    <Link to="/app/profile" className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${location.pathname === '/app/profile' ? 'text-blue-600 bg-blue-50 scale-110' : 'hover:text-gray-600'}`}>
                        <UserIcon className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold">{t('my_profile').split(' ')[1] || "Profil"}</span> 
                        {/* 'Mening Profilim' so'zidan faqat 'Profilim' qismini olish uchun oddiy trick qildim, yoki alohida t('profile') so'zini i18n.ts ga qo'shish kerak */}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Layout;