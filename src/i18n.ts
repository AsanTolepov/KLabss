import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  uz: {
    translation: {
      // Umumiy
      settings: "Sozlamalar",
      app_language: "Ilova tili",
      privacy: "Maxfiylik siyosati",
      contact: "Biz bilan bog'lanish",
      logout: "Hisobdan chiqish",
      welcome: "Xush kelibsiz",
      start: "Boshlash",
      xp: "ball",
      
      // Profil
      my_profile: "Mening Profilim",
      total_xp: "Jami Tajriba",
      streak_day: "Kun streak",
      accuracy: "Aniqlik",
      my_achievements: "Yutuqlarim",
      
      // Home (Asosiy)
      daily_task: "Kunlik Vazifa",
      daily_task_title: "Kimyo laboratoriyasini bajaring",
      daily_task_desc: "Noyob \"Alkimyogar\" nishonini yutib oling!",
      my_courses: "Mening Kurslarim",
      all: "Barchasi",
      lesson_count: "Dars",
      completed: "Bajarildi",
      
      // Leaderboard (Reyting)
      leaderboard: "Reyting",
      champion: "Chempion",
      student: "O'quvchi",
      user: "Foydalanuvchi",
      your_result: "Sening Natijang",
      
      // Laboratory
      laboratory: "Laboratoriya",
      lab_desc: "Tajriba turini tanlang",
      
      // Fanlar
      chemistry: "Kimyo",
      physics: "Fizika",
      biology: "Biologiya",
      
      // Yutuqlar
      ach_first_discovery: "Birinchi qadam",
      ach_quiz_master: "Zukko",
      ach_streak_3: "Barqaror",
      ach_science_nerd: "Fanat",
      ach_speed_runner: "Tezkor",
      ach_level_5: "Professional",

      // --- MENYU (PASTKI QISM) ---
      menu_home: "Asosiy",
      menu_lab: "Lab",
      menu_rank: "Reyting",
      menu_profile: "Profil"
    }
  },
  en: {
    translation: {
      settings: "Settings",
      app_language: "App Language",
      privacy: "Privacy Policy",
      contact: "Contact Us",
      logout: "Log Out",
      welcome: "Welcome",
      start: "Start",
      xp: "pts",
      
      my_profile: "My Profile",
      total_xp: "Total XP",
      streak_day: "Day Streak",
      accuracy: "Accuracy",
      my_achievements: "My Achievements",
      
      daily_task: "Daily Task",
      daily_task_title: "Complete Chemistry Lab",
      daily_task_desc: "Win the unique \"Alchemist\" badge!",
      my_courses: "My Courses",
      all: "All",
      lesson_count: "Lessons",
      completed: "Completed",
      
      leaderboard: "Leaderboard",
      champion: "Champion",
      student: "Student",
      user: "User",
      your_result: "Your Result",
      
      laboratory: "Laboratory",
      lab_desc: "Choose experiment type",
      
      chemistry: "Chemistry",
      physics: "Physics",
      biology: "Biology",
      
      ach_first_discovery: "First Step",
      ach_quiz_master: "Smarty",
      ach_streak_3: "Stable",
      ach_science_nerd: "Science Nerd",
      ach_speed_runner: "Speed Runner",
      ach_level_5: "Professional",

      // --- MENU (BOTTOM) ---
      menu_home: "Home",
      menu_lab: "Lab",
      menu_rank: "Rank",
      menu_profile: "Profile"
    }
  },
  ru: {
    translation: {
      settings: "Настройки",
      app_language: "Язык приложения",
      privacy: "Политика конфиденциальности",
      contact: "Связаться с нами",
      logout: "Выйти",
      welcome: "Добро пожаловать",
      start: "Начать",
      xp: "очков",
      
      my_profile: "Мой Профиль",
      total_xp: "Общий опыт",
      streak_day: "Дней подряд",
      accuracy: "Точность",
      my_achievements: "Мои достижения",
      
      daily_task: "Ежедневное задание",
      daily_task_title: "Выполнить лаб. по химии",
      daily_task_desc: "Получите уникальный значок «Алхимик»!",
      my_courses: "Мои курсы",
      all: "Все",
      lesson_count: "Уроков",
      completed: "Завершено",
      
      leaderboard: "Рейтинг",
      champion: "Чемпион",
      student: "Ученик",
      user: "Пользователь",
      your_result: "Ваш результат",
      
      laboratory: "Лаборатория",
      lab_desc: "Выберите тип эксперимента",
      
      chemistry: "Химия",
      physics: "Физика",
      biology: "Биология",
      
      ach_first_discovery: "Первый шаг",
      ach_quiz_master: "Умник",
      ach_streak_3: "Стабильный",
      ach_science_nerd: "Фанат науки",
      ach_speed_runner: "Спринтер",
      ach_level_5: "Профессионал",

      // --- МЕНЮ (НИЖНЕЕ) ---
      menu_home: "Главная",
      menu_lab: "Лаб",
      menu_rank: "Рейтинг",
      menu_profile: "Профиль"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uz',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;