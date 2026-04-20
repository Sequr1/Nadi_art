import { Link } from 'react-router-dom';

const states = [
  {
    slug: 'energy',
    emoji: '🔥',
    title: 'Энергия',
    subtitle: 'Я хочу жить на полной скорости',
    keywords: ['динамика', 'страсть', 'контраст', 'экспрессия'],
    visual: 'красный, оранжевый, резкие мазки',
    gradient: 'from-red-50 via-orange-50 to-amber-50',
    borderColor: 'border-red-200/60',
    hoverGlow: 'group-hover:shadow-red-200/40',
    textColor: 'text-red-600',
    accentBg: 'bg-red-500',
    dotColor: 'bg-red-300',
  },
  {
    slug: 'depth',
    emoji: '🧠',
    title: 'Глубина',
    subtitle: 'Я ищу глубину и отражение',
    keywords: ['философия', 'символизм', 'тишина', 'метафоры'],
    visual: 'холодные оттенки, сложные композиции',
    gradient: 'from-blue-50 via-indigo-50 to-slate-50',
    borderColor: 'border-blue-200/60',
    hoverGlow: 'group-hover:shadow-blue-200/40',
    textColor: 'text-blue-600',
    accentBg: 'bg-blue-500',
    dotColor: 'bg-blue-300',
  },
  {
    slug: 'balance',
    emoji: '🌿',
    title: 'Баланс',
    subtitle: 'Я выбираю спокойствие и равновесие',
    keywords: ['гармония', 'природа', 'покой', 'плавные линии'],
    visual: 'зелёные, пастельные тона',
    gradient: 'from-emerald-50 via-teal-50 to-green-50',
    borderColor: 'border-emerald-200/60',
    hoverGlow: 'group-hover:shadow-emerald-200/40',
    textColor: 'text-emerald-600',
    accentBg: 'bg-emerald-500',
    dotColor: 'bg-emerald-300',
  },
  {
    slug: 'light',
    emoji: '✨',
    title: 'Свет',
    subtitle: 'Я хочу чувствовать и делиться',
    keywords: ['лёгкость', 'радость', 'воздух', 'вдохновение'],
    visual: 'жёлтый, голубой, свет',
    gradient: 'from-amber-50 via-yellow-50 to-orange-50',
    borderColor: 'border-amber-200/60',
    hoverGlow: 'group-hover:shadow-amber-200/40',
    textColor: 'text-amber-600',
    accentBg: 'bg-amber-500',
    dotColor: 'bg-amber-300',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-milk relative overflow-hidden">
      {/* Декоративные блобы */}
      <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-red-100/20 rounded-full blur-3xl animate-breathe" />
      <div className="absolute top-40 right-10 w-[250px] h-[250px] bg-blue-100/20 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-40 left-1/4 w-[280px] h-[280px] bg-emerald-100/20 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-20 right-1/4 w-[260px] h-[260px] bg-amber-100/20 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '6s' }} />

      {/* Навигация */}
      <nav className="relative z-10 flex justify-between items-center px-6 md:px-12 py-5 bg-milk/80 backdrop-blur-lg border-b border-lavender-soft/50">
        <Link 
          to="/" 
          className="font-serif text-xl md:text-2xl text-text-primary tracking-wide hover:text-amethyst transition-colors duration-500"
        >
          Надя Сок
        </Link>
        <Link 
          to="/"
          className="text-sm text-text-secondary hover:text-amethyst transition-colors duration-500"
        >
          ← На главную
        </Link>
      </nav>

      {/* Основной контент */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        {/* Заголовок */}
        <div className="text-center mb-12 md:mb-16 opacity-0 animate-fade-in-up">
          <h1 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6 leading-tight">
            Что звучит внутри
            <span className="block text-amethyst mt-2">прямо сейчас?</span>
          </h1>
          <p className="text-text-secondary font-light text-lg max-w-lg mx-auto">
            Выбери состояние, которое откликается. Оно покажет тебе работы, 
            созданные из похожей энергии.
          </p>
        </div>

        {/* 4 карточки состояний */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 max-w-3xl w-full">
          {states.map((state, index) => (
            <Link
              key={state.slug}
              to={`/state/${state.slug}`}
              className={`group relative overflow-hidden rounded-3xl border ${state.borderColor} bg-gradient-to-br ${state.gradient} p-7 md:p-9 transition-all duration-700 ease-out hover:scale-[1.02] hover:shadow-xl ${state.hoverGlow} opacity-0 animate-fade-in-up`}
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              {/* Фоновое свечение при наведении */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className={`absolute top-0 right-0 w-32 h-32 ${state.dotColor}/20 rounded-full blur-2xl`} />
              </div>

              {/* Декоративный эмодзи-фон */}
              <div className="absolute -bottom-4 -right-4 text-7xl opacity-10 group-hover:opacity-20 transition-opacity duration-700 transform group-hover:scale-110">
                {state.emoji}
              </div>

              <div className="relative z-10">
                {/* Эмодзи */}
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-500">
                  {state.emoji}
                </div>

                {/* Название */}
                <h2 className={`font-serif text-2xl md:text-3xl ${state.textColor} mb-3 transition-transform duration-500 group-hover:translate-x-1`}>
                  {state.title}
                </h2>

                {/* Ключевые слова */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {state.keywords.map((kw) => (
                    <span 
                      key={kw} 
                      className="text-xs text-text-muted bg-white/60 px-2 py-0.5 rounded-full"
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                {/* Подпись-цитата */}
                <p className="text-text-secondary text-sm font-light italic">
                  «{state.subtitle}»
                </p>
              </div>

              {/* Стрелка при наведении */}
              <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-[-10px] group-hover:translate-x-0">
                <svg className={`w-6 h-6 ${state.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Подсказка */}
        <p className="mt-12 md:mt-16 text-text-muted text-sm font-light opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          Нет правильного ответа — есть только твоё
        </p>
      </main>
    </div>
  );
}
