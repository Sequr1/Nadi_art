import { Link } from 'react-router-dom';

const states = [
  {
    slug: 'inspiration',
    title: 'Вдохновение',
    description: 'Энергия созидания',
    gradient: 'from-amber-100 via-orange-50 to-yellow-50',
    hoverGlow: 'group-hover:bg-amber-200/50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200/60',
  },
  {
    slug: 'silence',
    title: 'Тишина',
    description: 'Глубина покоя',
    gradient: 'from-blue-50 via-slate-50 to-indigo-50',
    hoverGlow: 'group-hover:bg-blue-200/50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200/60',
  },
  {
    slug: 'impulse',
    title: 'Импульс',
    description: 'Момент движения',
    gradient: 'from-violet-50 via-purple-50 to-fuchsia-50',
    hoverGlow: 'group-hover:bg-violet-200/50',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-200/60',
  },
  {
    slug: 'harmony',
    title: 'Гармония',
    description: 'Равновесие внутри',
    gradient: 'from-emerald-50 via-teal-50 to-green-50',
    hoverGlow: 'group-hover:bg-emerald-200/50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200/60',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-milk texture-air relative overflow-hidden">
      {/* Мягкие декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lavender-light/30 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-smoke/20 rounded-full blur-3xl animate-breathe delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lavender-soft/20 rounded-full blur-3xl animate-float" />
      </div>

      {/* Навигация */}
      <nav className="relative z-10 flex justify-between items-center px-6 md:px-12 py-6">
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
          Войти
        </Link>
      </nav>

      {/* Основной контент */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 py-12">
        {/* Заголовок */}
        <div className="text-center mb-16 md:mb-24 opacity-0 animate-fade-in-up">
          <h1 className="heading-xl text-5xl md:text-7xl lg:text-8xl text-text-primary mb-6">
            Свобода чувствовать
          </h1>
          <p className="text-lg md:text-xl text-text-secondary font-light max-w-md mx-auto">
            Какое состояние откликается сегодня?
          </p>
        </div>

        {/* Кнопки состояний */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-2xl w-full">
          {states.map((state, index) => (
            <Link
              key={state.slug}
              to={`/state/${state.slug}`}
              className={`group relative overflow-hidden rounded-2xl border ${state.borderColor} bg-gradient-to-br ${state.gradient} p-8 md:p-10 transition-all duration-700 ease-out hover:scale-[1.02] hover:shadow-xl hover:shadow-lavender/10 opacity-0 animate-fade-in-up`}
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-700 ${state.hoverGlow}`} />
              
              <div className="relative z-10">
                <h2 className={`font-serif text-2xl md:text-3xl ${state.textColor} mb-2 transition-transform duration-500 group-hover:translate-x-1`}>
                  {state.title}
                </h2>
                <p className="text-text-secondary text-sm md:text-base font-light">
                  {state.description}
                </p>
              </div>

              {/* Стрелка */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-0 translate-x-[-10px]">
                <svg className={`w-6 h-6 ${state.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Подсказка внизу */}
        <p className="mt-16 md:mt-24 text-text-muted text-sm font-light opacity-0 animate-fade-in delay-600">
          Или просто выберите то, что ближе прямо сейчас
        </p>
      </main>
    </div>
  );
}
