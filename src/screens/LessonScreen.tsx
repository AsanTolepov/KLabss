import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Lock, Trophy } from 'lucide-react';
import { COURSES } from '../constants';
import VideoPlayer from '../components/VideoPlayer';
import TaskLab from '../components/TaskLab';
import { AIResult } from '../types';
import { useTranslation } from 'react-i18next'; // IMPORT

const LessonScreen = ({ userProgress, onVideoComplete, onTaskComplete }: any) => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(); // HOOK
  
  const findLesson = () => {
    for (const course of COURSES) {
      if (course.grades) {
        for (const grade of course.grades) {
          const found = grade.lessons.find(l => l.id === lessonId);
          if (found) return found;
        }
      }
      // @ts-ignore
      if (course.lessons) {
        // @ts-ignore
        const found = course.lessons.find(l => l.id === lessonId);
        if (found) return found;
      }
    }
    return null;
  };

  const lesson = findLesson();

  useEffect(() => {
    console.log("Qidirilayotgan ID:", lessonId);
    console.log("Topilgan dars:", lesson);
  }, [lessonId, lesson]);

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{t('lesson_not_found')}</h2>
        <p className="text-gray-500 mb-6 text-sm">
            {t('system_error_lesson')}
        </p>
        <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg"
        >
            {t('back')}
        </button>
      </div>
    );
  }

  const progress = userProgress?.[lessonId!] || { videoWatched: false, taskCompleted: false };
  const isLocked = !progress.videoWatched;
  const [showResult, setShowResult] = useState<AIResult | null>(null);

  const handleTask = (result: AIResult) => {
      onTaskComplete(lessonId!, result);
      setShowResult(result);
  };

  // MUHIM: TaskLab ga tarjima qilingan config ni yuboramiz
  const translatedTaskConfig = {
      ...lesson.taskConfig,
      instructions: t(lesson.taskConfig.instructions)
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md p-4 border-b flex items-center z-20 shadow-sm">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform">
                <ChevronLeft className="text-gray-700"/>
            </button>
            <h2 className="font-bold ml-3 truncate text-gray-800">{t(lesson.title)}</h2>
        </div>
        
        <div className="p-4 max-w-2xl mx-auto space-y-6">
            {/* Video Player */}
            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                <VideoPlayer 
                    src={lesson.videoUrl} 
                    isCompleted={progress.videoWatched} 
                    onComplete={() => onVideoComplete(lessonId!)} 
                />
            </div>

            {/* Task Lab - Tarjima qilingan instructions bilan */}
            <div className="relative">
                <div className="flex justify-between items-center mb-2 px-1">
                   <h3 className="font-bold text-gray-800">{t('lab_task')}</h3>
                   <button className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded">{t('lab_help')}</button>
                </div>
                <div className={`transition-all duration-500 ${isLocked ? 'opacity-40 blur-[2px] pointer-events-none grayscale' : 'opacity-100'}`}>
                    <TaskLab config={translatedTaskConfig} onSuccess={handleTask} />
                </div>
                
                {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="bg-gray-900/90 backdrop-blur text-white p-6 rounded-2xl shadow-2xl flex flex-col items-center text-center border border-gray-700 transform scale-100">
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                                <Lock className="w-6 h-6 text-yellow-400"/>
                            </div>
                            <h3 className="font-bold text-lg">{t('lab_locked')}</h3>
                            <p className="text-xs text-gray-300 mt-1 max-w-[200px]">
                                {t('lab_locked_desc')}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Natija Modal */}
        {showResult && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl relative">
                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 drop-shadow-lg animate-bounce-slow" />
                    <h2 className="text-3xl font-black text-gray-900 mb-2">{showResult.score} {t('points')}</h2>
                    <p className="text-gray-600 mb-8 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {showResult.explanation}
                    </p>
                    <button 
                        onClick={()=>{setShowResult(null); navigate(-1)}} 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
                    >
                        {t('awesome')}
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default LessonScreen;