import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Atom, Zap, Sprout, ChevronLeft, PlayCircle } from 'lucide-react';
import { COURSES } from '../constants';
import { useTranslation } from 'react-i18next'; // IMPORT

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(); // HOOK
  
  const course = COURSES.find(c => c.id.toLowerCase() === id?.toLowerCase());

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800">{t('course_not_found')}</h2>
        <p className="text-gray-500 mb-6">{t('maybe_wrong_link')}</p>
        <button onClick={() => navigate('/app')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">
          {t('back_to_home')}
        </button>
      </div>
    );
  }

  const Icon = course.icon === 'Atom' ? Atom : course.icon === 'Zap' ? Zap : Sprout;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white p-6 pb-8 rounded-b-3xl shadow-sm mb-6 relative">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          <ChevronLeft className="text-gray-700" />
        </button>
        
        <div className="mt-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-lg" style={{ backgroundColor: course.color }}>
              <Icon className="w-10 h-10 text-white" />
            </div>
            {/* TARJIMA */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(course.title)}</h1>
            <p className="text-gray-500 max-w-xs">{t(course.description)}</p>
        </div>
      </div>

      <div className="px-6 space-y-4">
      <h3 className="font-bold text-gray-800 text-lg">{t('lesson_plan')}</h3>
        {course.lessons.map((lesson) => (
          <div 
            key={lesson.id} 
            onClick={() => navigate(`/app/lesson/${lesson.id}`)}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center cursor-pointer hover:scale-[1.02] active:scale-95 transition-all"
          >
            <div className="relative w-20 h-20 rounded-xl overflow-hidden mr-4 bg-gray-900 flex-shrink-0">
              <img src={lesson.thumbnail} className="w-full h-full object-cover opacity-80" alt="" />
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="text-white w-8 h-8" />
              </div>
            </div>
            <div className="flex-1">
              {/* TARJIMA */}
              <h4 className="font-bold text-gray-800 line-clamp-1">{t(lesson.title)}</h4>
              <p className="text-xs text-gray-400 mt-1 flex items-center">
                ⏱ {lesson.duration} {t('seconds')}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
               <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetails;