import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Atom, Zap, Sprout, FlaskConical } from 'lucide-react';
// 1. IMPORT
import { useTranslation } from 'react-i18next';

const LaboratoryScreen = () => {
  const navigate = useNavigate();
  // 2. HOOK
  const { t } = useTranslation();

  const labs = [
    {
      id: 'chemistry',
      title: t('chemistry'), // Tarjima kaliti
      icon: Atom,
      color: 'bg-blue-500',
      shadow: 'shadow-blue-500/40',
      path: '/app/lab/chemistry'
    },
    {
      id: 'physics',
      title: t('physics'), // Tarjima kaliti
      icon: Zap,
      color: 'bg-orange-500',
      shadow: 'shadow-orange-500/40',
      path: '/app/lab/physics'
    },
    {
      id: 'biology',
      title: t('biology'), // Tarjima kaliti
      icon: Sprout,
      color: 'bg-green-500',
      shadow: 'shadow-green-500/40',
      path: '/app/lab/biology'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-10">
      
      <div className="mb-12 text-center">
         <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <FlaskConical className="w-8 h-8" />
         </div>
         <h2 className="text-3xl font-black text-gray-900">{t('laboratory')}</h2>
         <p className="text-gray-500 mt-2">{t('lab_desc')}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 px-6 w-full max-w-md">
        {labs.map((lab) => (
          <div 
            key={lab.id}
            onClick={() => navigate(lab.path)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className={`w-24 h-24 ${lab.color} rounded-[1.5rem] flex items-center justify-center text-white shadow-xl ${lab.shadow} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out`}>
                <lab.icon className="w-10 h-10" strokeWidth={2.5} />
            </div>
            
            <span className="mt-4 font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors">
                {lab.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaboratoryScreen;