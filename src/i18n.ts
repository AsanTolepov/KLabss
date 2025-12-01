import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  uz: {
    translation: {
      // Umumiy UI
      "welcome": "Xush kelibsiz",
      "student": "O'quvchi",
      "xp": "XP",
      "daily_task": "Kunlik vazifa",
      "daily_task_title": "Bugungi eksperimentni bajaring!",
      "daily_task_desc": "Yangi kashfiyotlar sizni kutmoqda.",
      "start": "Boshlash",
      "my_courses": "Mening kurslarim",
      "all": "Barchasi",
      "lesson_count": "dars",
      "completed": "bajarildi",
      "back": "Ortga",
      "home": "Bosh sahifa",
      "loading": "Yuklanmoqda...",
      "watched": "Ko'rildi",
      "seconds": "soniya",
      
      // Xatolar
      "course_not_found": "Kurs topilmadi",
      "maybe_wrong_link": "Balki havola noto'g'ridir?",
      "back_to_home": "Bosh sahifaga qaytish",
      "lesson_not_found": "Dars topilmadi",
      "system_error_lesson": "Tizim ushbu ID raqamli darsni topa olmadi.",
      "grade_not_found": "Sinf topilmadi",

      // Kurslar (Constants dan)
      "chemistry": "Kimyo",
      "chemistry_desc": "Moddalar, elementlar va reaksiyalar.",
      "physics": "Fizika",
      "physics_desc": "Kuch, energiya va harakat qonunlari.",
      "biology": "Biologiya",
      "biology_desc": "Hayot, hujayralar va ekotizim.",

      // Darslar sarlavhalari va ta'riflari
      "lesson_plan": "Darslar rejasi",
      
      // Kimyo darslari
      "chem_1_title": "1. Kislota va Asoslar",
      "chem_1_desc": "pH balansi va neytrallash jarayoni.",
      "chem_1_task": "Eritmani neytrallang! Kislotaga asos qo'shib, pH darajasini 7.0 ga keltiring.",
      
      "chem_2_title": "2. Kovalent Bog'lanish",
      "chem_2_desc": "Atomlar elektronlarni qanday bo'lishadi?",
      "chem_2_task": "Barqaror molekula hosil qilish uchun elektronlar sonini to'g'rilang (Oktet qoidasi).",

      "chem_3_title": "3. Davriy Jadval",
      "chem_3_desc": "Elementlarning xossalari va joylashuvi.",
      "chem_3_task": "Ideal gaz holati uchun temperaturani Selsiyda sozlang (25°C xona harorati).",

      "chem_4_title": "4. Kimyoviy Reaksiyalar",
      "chem_4_desc": "Ekzotermik va endotermik jarayonlar.",
      "chem_4_task": "Reaksiya tezligini oshirish uchun katalizator miqdorini 50mg ga yetkazing.",

      "chem_5_title": "5. Eritmalar",
      "chem_5_desc": "Konsentratsiya va to'yinish.",
      "chem_5_task": "Eritma konsentratsiyasini 10% ga tushirish uchun suv qo'shing.",

      // Fizika darslari
      "phys_1_title": "1. Om Qonuni",
      "phys_1_desc": "Kuchlanish, Tok va Qarshilik.",
      "phys_1_task": "Tok kuchi (I) roppa-rosa 2.0 Amper bo'lishi uchun Kuchlanishni (V) sozlang (R=5 Om).",

      "phys_2_title": "2. Nyuton Qonunlari",
      "phys_2_desc": "Kuch va harakat.",
      "phys_2_task": "Jism tezlanishi 5 m/s² bo'lishi uchun unga ta'sir qiluvchi kuchni toping (m=10kg).",
      
      "phys_3_title": "3. Gravitatsiya",
      "phys_3_desc": "Erkin tushish tezlanishi.",
      "phys_3_task": "Raketa uchishi uchun tortish kuchini (G) yengib o'tadigan kuchlanishni 100% ga yetkazing.",

      "phys_4_title": "4. Optika",
      "phys_4_desc": "Yorug'likning sinishi va qaytishi.",
      "phys_4_task": "Yorug'likni to'liq qaytarish uchun tushish burchagini 45 gradusga sozlang.",

      "phys_5_title": "5. Termodinamika",
      "phys_5_desc": "Issiqlik uzatish usullari.",
      "phys_5_task": "Tizim muvozanatga kelishi uchun temperaturani 50°C ga tushiring.",

      // Biologiya darslari
      "bio_1_title": "1. Fotosintez",
      "bio_1_desc": "Yorug'lik energiyasi va o'simliklar.",
      "bio_1_task": "O'simlik o'sishi 100% bo'lishi uchun Yorug'lik va CO2 miqdorini optimallashtiring.",

      "bio_2_title": "2. Hujayra Tuzilishi",
      "bio_2_desc": "Membrana, yadro va mitoxondriya.",
      "bio_2_task": "Hujayra energiyasini (ATP) oshirish uchun mitoxondriya faolligini 80% ga ko'taring.",

      "bio_3_title": "3. DNK va Genetika",
      "bio_3_desc": "Irsiyat qonunlari.",
      "bio_3_task": "DNK zanjirini barqarorlashtirish uchun haroratni 37°C (tana harorati) ga sozlang.",

      "bio_4_title": "4. Ekotizimlar",
      "bio_4_desc": "Oziq zanjiri va muvozanat.",
      "bio_4_task": "Ekotizim balansi uchun yirtqichlar va o'lja nisbatini 1:10 ga keltiring (10 yirtqich).",

      "bio_5_title": "5. Inson Anatomiyasi",
      "bio_5_desc": "Yurak va qon aylanish tizimi.",
      "bio_5_task": "Yurak urish tezligini (Puls) normal holatga, ya'ni 70 zarba/daqiqaga tushiring.",

      // LessonScreen
      "lab_locked": "Laboratoriya Qulflangan",
      "lab_locked_desc": "Amaliy mashg'ulotni bajarish uchun avval videodarsni to'liq ko'rib chiqing.",
      "points": "ball",
      "awesome": "Ajoyib!",
      "lab_help": "Yordam",
      "lab_task": "Laboratoriya",
    }
  },
  en: {
    translation: {
      "welcome": "Welcome",
      "student": "Student",
      "xp": "XP",
      "daily_task": "Daily Task",
      "daily_task_title": "Complete today's experiment!",
      "daily_task_desc": "New discoveries await you.",
      "start": "Start",
      "my_courses": "My Courses",
      "all": "All",
      "lesson_count": "lessons",
      "completed": "completed",
      "back": "Back",
      "home": "Home",
      "loading": "Loading...",
      "watched": "Watched",
      "seconds": "sec",
      "course_not_found": "Course not found",
      "maybe_wrong_link": "Maybe the link is incorrect?",
      "back_to_home": "Back to Home",
      "lesson_not_found": "Lesson not found",
      "system_error_lesson": "System could not find the lesson with this ID.",
      "grade_not_found": "Grade not found",
      "chemistry": "Chemistry",
      "chemistry_desc": "Substances, elements and reactions.",
      "physics": "Physics",
      "physics_desc": "Force, energy and laws of motion.",
      "biology": "Biology",
      "biology_desc": "Life, cells and ecosystems.",
      "lesson_plan": "Lesson Plan",
      
      // Chemistry Lessons
      "chem_1_title": "1. Acids and Bases",
      "chem_1_desc": "pH balance and neutralization process.",
      "chem_1_task": "Neutralize the solution! Add base to acid to bring pH level to 7.0.",
      "chem_2_title": "2. Covalent Bonding",
      "chem_2_desc": "How atoms share electrons?",
      "chem_2_task": "Adjust electron count to form a stable molecule (Octet rule).",
      "chem_3_title": "3. Periodic Table",
      "chem_3_desc": "Properties and arrangement of elements.",
      "chem_3_task": "Set temperature in Celsius for ideal gas state (25°C room temp).",
      "chem_4_title": "4. Chemical Reactions",
      "chem_4_desc": "Exothermic and endothermic processes.",
      "chem_4_task": "Increase catalyst amount to 50mg to speed up the reaction.",
      "chem_5_title": "5. Solutions",
      "chem_5_desc": "Concentration and saturation.",
      "chem_5_task": "Add water to decrease solution concentration to 10%.",

      // Physics Lessons
      "phys_1_title": "1. Ohm's Law",
      "phys_1_desc": "Voltage, Current and Resistance.",
      "phys_1_task": "Adjust Voltage (V) so Current (I) is exactly 2.0 Amps (R=5 Ohm).",
      "phys_2_title": "2. Newton's Laws",
      "phys_2_desc": "Force and motion.",
      "phys_2_task": "Find the force acting on the object for 5 m/s² acceleration (m=10kg).",
      "phys_3_title": "3. Gravity",
      "phys_3_desc": "Acceleration of free fall.",
      "phys_3_task": "Increase thrust to 100% to overcome gravity (G) for rocket launch.",
      "phys_4_title": "4. Optics",
      "phys_4_desc": "Refraction and reflection of light.",
      "phys_4_task": "Set incidence angle to 45 degrees for total internal reflection.",
      "phys_5_title": "5. Thermodynamics",
      "phys_5_desc": "Methods of heat transfer.",
      "phys_5_task": "Lower temperature to 50°C for system equilibrium.",

      // Biology Lessons
      "bio_1_title": "1. Photosynthesis",
      "bio_1_desc": "Light energy and plants.",
      "bio_1_task": "Optimize Light and CO2 levels for 100% plant growth.",
      "bio_2_title": "2. Cell Structure",
      "bio_2_desc": "Membrane, nucleus and mitochondria.",
      "bio_2_task": "Increase mitochondria activity to 80% to boost cell energy (ATP).",
      "bio_3_title": "3. DNA and Genetics",
      "bio_3_desc": "Laws of heredity.",
      "bio_3_task": "Set temperature to 37°C (body temp) to stabilize DNA strand.",
      "bio_4_title": "4. Ecosystems",
      "bio_4_desc": "Food chain and balance.",
      "bio_4_task": "Set predator to prey ratio to 1:10 (10 predators) for ecosystem balance.",
      "bio_5_title": "5. Human Anatomy",
      "bio_5_desc": "Heart and circulatory system.",
      "bio_5_task": "Lower heart rate (Pulse) to normal state, 70 beats/min.",

      "lab_locked": "Laboratory Locked",
      "lab_locked_desc": "Please watch the full video lesson to unlock the practical task.",
      "points": "points",
      "awesome": "Awesome!",
      "lab_help": "Help",
      "lab_task": "Laboratory",
    }
  },
  ru: {
    translation: {
      "welcome": "Добро пожаловать",
      "student": "Ученик",
      "xp": "XP",
      "daily_task": "Ежедневное задание",
      "daily_task_title": "Выполните сегодняшний эксперимент!",
      "daily_task_desc": "Вас ждут новые открытия.",
      "start": "Начать",
      "my_courses": "Мои курсы",
      "all": "Все",
      "lesson_count": "уроков",
      "completed": "завершено",
      "back": "Назад",
      "home": "Главная",
      "loading": "Загрузка...",
      "watched": "Просмотрено",
      "seconds": "сек",
      "course_not_found": "Курс не найден",
      "maybe_wrong_link": "Возможно, ссылка неверна?",
      "back_to_home": "Вернуться на главную",
      "lesson_not_found": "Урок не найден",
      "system_error_lesson": "Система не смогла найти урок с этим ID.",
      "grade_not_found": "Класс не найден",
      "chemistry": "Химия",
      "chemistry_desc": "Вещества, элементы и реакции.",
      "physics": "Физика",
      "physics_desc": "Сила, энергия и законы движения.",
      "biology": "Биология",
      "biology_desc": "Жизнь, клетки и экосистемы.",
      "lesson_plan": "План уроков",

      // Chemistry Lessons
      "chem_1_title": "1. Кислоты и Основания",
      "chem_1_desc": "pH баланс и процесс нейтрализации.",
      "chem_1_task": "Нейтрализуйте раствор! Добавьте основание в кислоту, чтобы довести pH до 7.0.",
      "chem_2_title": "2. Ковалентная связь",
      "chem_2_desc": "Как атомы делят электроны?",
      "chem_2_task": "Скорректируйте количество электронов для создания стабильной молекулы (Правило октета).",
      "chem_3_title": "3. Периодическая таблица",
      "chem_3_desc": "Свойства и расположение элементов.",
      "chem_3_task": "Установите температуру в Цельсиях для состояния идеального газа (25°C).",
      "chem_4_title": "4. Химические реакции",
      "chem_4_desc": "Экзотермические и эндотермические процессы.",
      "chem_4_task": "Увеличьте количество катализатора до 50 мг, чтобы ускорить реакцию.",
      "chem_5_title": "5. Растворы",
      "chem_5_desc": "Концентрация и насыщение.",
      "chem_5_task": "Добавьте воды, чтобы снизить концентрацию раствора до 10%.",

      // Physics Lessons
      "phys_1_title": "1. Закон Ома",
      "phys_1_desc": "Напряжение, Ток и Сопротивление.",
      "phys_1_task": "Настройте Напряжение (V), чтобы Сила тока (I) была ровно 2.0 Ампера (R=5 Ом).",
      "phys_2_title": "2. Законы Ньютона",
      "phys_2_desc": "Сила и движение.",
      "phys_2_task": "Найдите силу, действующую на объект, для ускорения 5 м/с² (m=10кг).",
      "phys_3_title": "3. Гравитация",
      "phys_3_desc": "Ускорение свободного падения.",
      "phys_3_task": "Увеличьте тягу до 100%, чтобы преодолеть гравитацию (G) для запуска ракеты.",
      "phys_4_title": "4. Оптика",
      "phys_4_desc": "Преломление и отражение света.",
      "phys_4_task": "Установите угол падения на 45 градусов для полного внутреннего отражения.",
      "phys_5_title": "5. Термодинамика",
      "phys_5_desc": "Способы теплопередачи.",
      "phys_5_task": "Снизьте температуру до 50°C для равновесия системы.",

      // Biology Lessons
      "bio_1_title": "1. Фотосинтез",
      "bio_1_desc": "Световая энергия и растения.",
      "bio_1_task": "Оптимизируйте уровень Света и CO2 для 100% роста растения.",
      "bio_2_title": "2. Структура клетки",
      "bio_2_desc": "Мембрана, ядро и митохондрии.",
      "bio_2_task": "Увеличьте активность митохондрий до 80%, чтобы повысить энергию клетки (АТФ).",
      "bio_3_title": "3. ДНК и Генетика",
      "bio_3_desc": "Законы наследственности.",
      "bio_3_task": "Установите температуру на 37°C (температура тела) для стабилизации цепи ДНК.",
      "bio_4_title": "4. Экосистемы",
      "bio_4_desc": "Пищевая цепь и баланс.",
      "bio_4_task": "Установите соотношение хищников к жертвам 1:10 (10 хищников) для баланса.",
      "bio_5_title": "5. Анатомия человека",
      "bio_5_desc": "Сердце и кровеносная система.",
      "bio_5_task": "Снизьте частоту сердцебиения (Пульс) до нормы, 70 ударов/мин.",

      "lab_locked": "Лаборатория закрыта",
      "lab_locked_desc": "Пожалуйста, полностью посмотрите видеоурок, чтобы открыть практическое задание.",
      "points": "баллов",
      "awesome": "Отлично!",
      "lab_help": "Помощь",
      "lab_task": "Лаборатория",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "uz", // Boshlang'ich til
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;