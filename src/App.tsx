import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, AIResult } from './types';
import { ACHIEVEMENTS_LIST } from './constants';

// Firebase
import { auth, db } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Komponentlar
import Layout from './components/Layout';
import AchievementPopup from './components/AchievementPopup';

// Ekranlar
import LoginScreen from './screens/LoginScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import CourseDetails from './screens/CourseDetails';
import LessonScreen from './screens/LessonScreen';
import ProfileScreen from './screens/ProfileScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import LaboratoryScreen from './screens/LaboratoryScreen';
import ChemistryLab from './screens/labs/ChemistryLab';
import PhysicsLab from './screens/labs/PhysicsLab';
import BiologyLab from './screens/labs/BiologyLab';
import SubjectGradesScreen from './screens/SubjectGradesScreen';
import GradeLessonsScreen from './screens/GradeLessonsScreen';

// Fizika Lab komponentlari (Fayl borligiga ishonch hosil qiling, bo'lmasa commentga oling)
import KinematicsLab from './components/physics/KinematicsLab';
import ElectronicsLab from './components/physics/ElectronicsLab';

// Loader
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Yuklanmoqda...</p>
    </div>
  </div>
);

const useAppStore = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [newAchievement, setNewAchievement] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Loadingni har doim true qilamiz boshida
      setLoading(true);
      
      try {
        if (currentUser) {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            let userData = docSnap.data() as User;
            
            // --- MA'LUMOTLARNI TEKSHIRISH VA TUZATISH ---
            try {
                let calculatedXp = 0;
                let progressFixed = { ...(userData.progress || {}) };
                let isDataDirty = false;

                Object.keys(progressFixed).forEach((key) => {
                    const lessonData = progressFixed[key];
                    let score = Number(lessonData.score);
                    if (Number.isNaN(score)) {
                        score = 0; 
                        progressFixed[key] = { ...lessonData, score: 0 };
                        isDataDirty = true;
                    }
                    calculatedXp += score;
                });

                const achievements = userData.achievements || {};
                if (achievements['first_discovery']) calculatedXp += 50;
                if (achievements['quiz_master']) calculatedXp += 100;
                if (achievements['streak_3']) calculatedXp += 50;

                // Agar XP noto'g'ri bo'lsa, yangilaymiz
                if (isDataDirty || Number.isNaN(userData.xp) || Math.abs(userData.xp - calculatedXp) > 5) {
                    console.log("XP Synchronized");
                    userData.xp = calculatedXp;
                    userData.progress = progressFixed;
                    // Orqa fonda yangilaymiz, kutib o'tirmaymiz
                    updateDoc(docRef, { xp: calculatedXp, progress: progressFixed }).catch(console.error);
                }

                // Streak yangilash
                const today = new Date().toDateString();
                if (userData.lastLoginDate !== today) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    if (userData.lastLoginDate === yesterday.toDateString()) {
                       userData.streak = (userData.streak || 0) + 1;
                    } else {
                       userData.streak = 1;
                    }
                    userData.lastLoginDate = today;
                    updateDoc(docRef, { streak: userData.streak, lastLoginDate: today }).catch(console.error);
                }
            } catch (err) {
                console.warn("User data fix warning:", err);
            }

            setUser(userData);
            setProgress(userData.progress || {});
          } else {
            // User authda bor, lekin bazada yo'q (kamdan-kam holat)
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth Error:", error);
        setUser(null);
      } finally {
        // Xato bo'lsa ham, bo'lmasa ham loadingni o'chiramiz!
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const completeVideo = async (lessonId: string) => {
    if (!auth.currentUser || !user) return;

    const currentLessonProgress = progress[lessonId] || {};
    const newProgress = {
      ...progress,
      [lessonId]: { ...currentLessonProgress, videoWatched: true }
    };

    setProgress(newProgress);
    // Optimistik update (UI darhol o'zgaradi)
    setUser(prev => prev ? ({ ...prev, progress: newProgress }) : null);

    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), { progress: newProgress }, { merge: true });
    } catch (e) {
      console.error("Save Error:", e);
    }
  };

  const completeTask = async (lessonId: string, aiResult: AIResult) => {
    if (!auth.currentUser || !user) return;
    if (progress[lessonId]?.taskCompleted) return;

    const scoreToAdd = Number(aiResult.score) || 0;
    const newProgress = { 
        ...progress, 
        [lessonId]: { ...progress[lessonId], taskCompleted: true, score: scoreToAdd } 
    };

    const currentXp = Number(user.xp) || 0;
    let additionalXp = scoreToAdd;
    
    let currentAchievements = { ...(user.achievements || {}) };
    let updatedBadges = [...(user.badges || [])];
    let achievementUnlocked = null;

    if (!currentAchievements['first_discovery']) {
      currentAchievements['first_discovery'] = true;
      updatedBadges.push('first_discovery');
      additionalXp += 50; 
      achievementUnlocked = ACHIEVEMENTS_LIST.find(a => a.id === 'first_discovery');
    }

    if (scoreToAdd === 100 && !currentAchievements['quiz_master']) {
      currentAchievements['quiz_master'] = true;
      updatedBadges.push('quiz_master');
      additionalXp += 100;
      if (!achievementUnlocked) achievementUnlocked = ACHIEVEMENTS_LIST.find(a => a.id === 'quiz_master');
    }

    const newXp = currentXp + additionalXp;

    setProgress(newProgress);
    setUser(prev => prev ? ({ 
        ...prev, 
        xp: newXp, 
        achievements: currentAchievements, 
        badges: updatedBadges, 
        progress: newProgress 
    }) : null);

    if (achievementUnlocked) setNewAchievement(achievementUnlocked);

    try {
        await setDoc(doc(db, "users", auth.currentUser.uid), {
        progress: newProgress, 
        xp: newXp, 
        achievements: currentAchievements, 
        badges: updatedBadges
        }, { merge: true });
    } catch (e) {
        console.error("Task Save Error:", e);
    }
  };

  const closeAchievement = () => setNewAchievement(null);
  return { user, progress, loading, completeVideo, completeTask, newAchievement, closeAchievement };
};

const App = () => {
  const { user, progress, loading, completeVideo, completeTask, newAchievement, closeAchievement } = useAppStore();

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start font-sans-gray-900">
      <div className="w-full max-w-[480px] min-h-screen bg-white shadow-2xl relative overflow-x-hidden">
        <HashRouter>
          {newAchievement && (
            <AchievementPopup
              title={newAchievement.title}
              description={newAchievement.description}
              icon={newAchievement.icon}
              onClose={closeAchievement}
            />
          )}

          <Routes>
            <Route path="/" element={user ? <Navigate to="/app" replace /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/welcome" element={<WelcomeScreen />} />

            <Route
              path="/app/lesson/:lessonId"
              element={
                user ? (
                  <LessonScreen
                    userProgress={progress}
                    onVideoComplete={completeVideo}
                    onTaskComplete={completeTask}
                  />
                ) : <Navigate to="/login" />
              }
            />

            <Route path="/app/*" element={
              user ? (
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomeScreen user={user} />} />
                    <Route path="/laboratory" element={<LaboratoryScreen />} />
                    <Route path="/lab/chemistry" element={<ChemistryLab />} />
                    <Route path="/lab/physics" element={<PhysicsLab />} />
                    
                    {/* Agar bu fayllar sizda yo'q bo'lsa, commentga oling */}
                    <Route path="/lab/physics/kinematics" element={<KinematicsLab />} />
                    <Route path="/lab/physics/electronics" element={<ElectronicsLab />} />
                    
                    <Route path="/lab/biology" element={<BiologyLab />} />
                    <Route path="/course/:id" element={<CourseDetails />} />
                    <Route path="/profile" element={<ProfileScreen user={user} />} />
                    <Route path="/leaderboard" element={<LeaderboardScreen />} />
                    
                    <Route path="/course/:subjectId" element={<SubjectGradesScreen />} />
                    <Route path="/course/:subjectId/grade/:gradeId" element={
                       <GradeLessonsScreen userProgress={progress} />
                    } />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
};

export default App;