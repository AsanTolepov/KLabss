import React, { useEffect, useState } from 'react';
import { Trophy, Crown, Loader2, Flame, User as UserIcon } from 'lucide-react';
import { db, auth } from '../services/firebase';
import { collection, query, orderBy, limit, getDocs, where, doc, getDoc } from 'firebase/firestore';
import { User } from '../types';
// 1. IMPORT
import { useTranslation } from 'react-i18next';

const LeaderboardScreen = () => {
  const [leaders, setLeaders] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [currentUserData, setCurrentUserData] = useState<User | null>(null);
  
  // 2. HOOK
  const { t } = useTranslation();
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("xp", "desc"), limit(50));
        const querySnapshot = await getDocs(q);
        const usersList: User[] = [];

        querySnapshot.forEach((doc) => {
          usersList.push({ uid: doc.id, ...doc.data() } as User);
        });

        setLeaders(usersList);

        if (currentUserId) {
            const myIndex = usersList.findIndex(u => u.uid === currentUserId);
            if (myIndex !== -1) {
                setCurrentUserRank(myIndex + 1);
                setCurrentUserData(usersList[myIndex]);
            } else {
                const userDocRef = doc(db, "users", currentUserId);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const myData = { uid: userDocSnap.id, ...userDocSnap.data() } as User;
                    setCurrentUserData(myData);
                    const myXP = myData.xp || 0;
                    const higherRankQuery = query(usersRef, where("xp", ">", myXP));
                    const higherRankSnap = await getDocs(higherRankQuery);
                    setCurrentUserRank(higherRankSnap.size + 1);
                }
            }
        }
      } catch (error) {
        console.error("Xato:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [currentUserId]);

  const renderAvatar = (u: User, sizeClasses: string, borderColor: string, rankBadgeColor: string, rank: number) => (
    <div className="relative flex flex-col items-center">
        <div className={`${sizeClasses} rounded-full border-4 ${borderColor} bg-white flex items-center justify-center overflow-hidden shadow-md relative z-10`}>
            {u.photoURL ? (
                <img src={u.photoURL} alt="avatar" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <UserIcon size={24} />
                </div>
            )}
        </div>
        <div className={`absolute -bottom-3 ${rankBadgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border-2 border-white z-20`}>
            #{rank}
        </div>
    </div>
  );

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>;

  const top1 = leaders[0];
  const top2 = leaders[1];
  const top3 = leaders[2];
  const restUsers = leaders.slice(3);

  return (
    <div className="min-h-screen bg-slate-50 pb-36">
        {/* Header */}
        <div className="bg-white p-4 shadow-sm sticky top-0 z-30 max-w-md mx-auto w-full">
            <h1 className="text-xl font-bold flex items-center gap-2 justify-center text-gray-800">
                <Trophy className="text-yellow-500 fill-yellow-500 w-6 h-6" /> {t('leaderboard')}
            </h1>
        </div>

        <div className="max-w-md mx-auto w-full relative px-4">
            {/* SHOXSUPA */}
            <div className="flex justify-center items-end mb-8 mt-8 gap-3 sm:gap-4">
                {/* 2-o'rin */}
                <div className="flex flex-col items-center w-[30%]">
                    {top2 && (
                        <>
                            {renderAvatar(top2, "w-14 h-14", "border-gray-300", "bg-gray-500", 2)}
                            <div className="mt-5 text-center w-full">
                                <p className="font-bold text-[11px] leading-tight text-gray-700 line-clamp-2 h-8 flex items-center justify-center">
                                    {top2.displayName || top2.name || t('student')}
                                </p>
                                <p className="text-[10px] text-blue-600 font-bold">{top2.xp || 0} {t('xp')}</p>
                            </div>
                            <div className="h-24 w-full bg-gradient-to-t from-gray-300 to-gray-100 rounded-t-lg shadow-sm opacity-90 mt-1"></div>
                        </>
                    )}
                </div>

                {/* 1-o'rin */}
                <div className="flex flex-col items-center w-[34%] z-10 -mb-1">
                    {top1 && (
                        <>
                            <Crown className="text-yellow-500 animate-bounce w-8 h-8 mb-1" />
                            {renderAvatar(top1, "w-20 h-20", "border-yellow-400", "bg-yellow-500", 1)}
                            <div className="mt-5 text-center w-full">
                                <p className="font-bold text-xs leading-tight text-gray-800 line-clamp-2 h-8 flex items-center justify-center">
                                    {top1.displayName || top1.name || t('champion')}
                                </p>
                                <p className="text-xs text-blue-600 font-black">{top1.xp || 0} {t('xp')}</p>
                            </div>
                            <div className="h-32 w-full bg-gradient-to-t from-yellow-300 to-yellow-100 rounded-t-xl shadow-lg mt-1 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 transform -skew-x-12 translate-x-1/2"></div>
                            </div>
                        </>
                    )}
                </div>

                {/* 3-o'rin */}
                <div className="flex flex-col items-center w-[30%]">
                    {top3 && (
                        <>
                             {renderAvatar(top3, "w-14 h-14", "border-orange-300", "bg-orange-400", 3)}
                            <div className="mt-5 text-center w-full">
                                <p className="font-bold text-[11px] leading-tight text-gray-700 line-clamp-2 h-8 flex items-center justify-center">
                                    {top3.displayName || top3.name || t('student')}
                                </p>
                                <p className="text-[10px] text-blue-600 font-bold">{top3.xp || 0} {t('xp')}</p>
                            </div>
                            <div className="h-16 w-full bg-gradient-to-t from-orange-300 to-orange-100 rounded-t-lg shadow-sm opacity-90 mt-1"></div>
                        </>
                    )}
                </div>
            </div>

            {/* RO'YXAT */}
            <div className="space-y-2 pb-8">
                {restUsers.map((u, index) => (
                    <div key={index} className={`flex items-center p-3 rounded-xl border transition-colors ${u.uid === currentUserId ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-white border-gray-100'}`}>
                        <span className="w-8 text-center font-bold text-gray-400 text-sm">#{index + 4}</span>
                        
                        <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 mx-3">
                             {u.photoURL ? (
                                <img src={u.photoURL} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400"><UserIcon size={16}/></div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className={`font-bold text-sm truncate ${u.uid === currentUserId ? 'text-blue-700' : 'text-gray-800'}`}>
                                {u.displayName || u.name || t('user')}
                            </p>
                            <div className="flex gap-3 text-[10px] text-gray-400 items-center mt-0.5">
                                <span className="bg-gray-100 px-1.5 py-0.5 rounded">{u.level || 1}-lvl</span>
                                {(u.streak || 0) > 0 && <span className="text-orange-500 flex items-center font-bold"><Flame className="w-3 h-3 mr-0.5 fill-current"/> {u.streak}</span>}
                            </div>
                        </div>
                        
                        <div className="text-right pl-2">
                            <span className="font-black text-indigo-600 text-sm block">{u.xp || 0}</span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase">{t('xp')}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* SIZNING NATIJANGIZ */}
        {currentUserData && currentUserRank && currentUserRank > 3 && (
            <div className="fixed bottom-[70px] left-0 right-0 mx-auto w-[92%] max-w-md z-30 animate-in slide-in-from-bottom-10 fade-in duration-500">
                <div className="bg-slate-800 text-white p-3 rounded-xl shadow-2xl flex justify-between items-center border border-slate-600 backdrop-blur-md bg-opacity-95">
                    <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-yellow-400 border-r border-slate-600 pr-3 pl-1 min-w-[40px] text-center">
                            #{currentUserRank}
                        </div>
                        <div>
                            <p className="font-bold text-sm">{t('your_result')}</p>
                            <div className="flex gap-3 text-xs text-slate-300">
                                <span className="flex items-center"><Flame className="w-3 h-3 text-orange-500 mr-1"/> {currentUserData.streak || 0} {t('streak_day')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-lg font-black text-blue-400 mr-2">{currentUserData.xp || 0} {t('xp')}</div>
                </div>
            </div>
        )}
    </div>
  );
};

export default LeaderboardScreen;