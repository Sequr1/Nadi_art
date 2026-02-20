import { useParams, Link } from 'react-router-dom';
import Gallery from '../components/Gallery';
import ArtistPresence from '../components/ArtistPresence';
import CTASection from '../components/CTASection';

const stateData: Record<string, {
  title: string;
  resonanceText: string;
  resonanceSubtext: string;
  gradient: string;
  accentColor: string;
  presenceText: string[];
}> = {
  inspiration: {
    title: 'Вдохновение',
    resonanceText: 'Возможно, сейчас внутри что-то просится наружу.',
    resonanceSubtext: 'Энергия, которая ищет форму. Движение, которое хочет стать видимым.',
    gradient: 'from-amber-50 via-orange-50/50 to-cream',
    accentColor: 'text-amber-600',
    presenceText: [
      'Я создаю из состояния.',
      'Когда внутри появляется импульс — я следую за ним.',
      'Мне нравится удивляться тому, что получается.',
    ],
  },
  silence: {
    title: 'Тишина',
    resonanceText: 'Иногда хочется просто остановиться.',
    resonanceSubtext: 'Почувствовать глубину. Услышать то, что обычно ускользает.',
    gradient: 'from-blue-50 via-slate-50/50 to-cream',
    accentColor: 'text-blue-600',
    presenceText: [
      'Я создаю из состояния.',
      'Тишина — это не отсутствие. Это присутствие чего-то большего.',
      'В паузе рождается настоящее.',
    ],
  },
  impulse: {
    title: 'Импульс',
    resonanceText: 'Что-то внутри уже знает направление.',
    resonanceSubtext: 'Момент перед прыжком. Искра перед пламенем.',
    gradient: 'from-violet-50 via-purple-50/50 to-cream',
    accentColor: 'text-violet-600',
    presenceText: [
      'Я создаю из состояния.',
      'Иногда процесс ведёт меня, иногда я его.',
      'Самое интересное — в моменте неизвестности.',
    ],
  },
  harmony: {
    title: 'Гармония',
    resonanceText: 'Когда всё на своих местах.',
    resonanceSubtext: 'Равновесие внутри. Мир вокруг становится отражением.',
    gradient: 'from-emerald-50 via-teal-50/50 to-cream',
    accentColor: 'text-emerald-600',
    presenceText: [
      'Я создаю из состояния.',
      'Гармония — это не про идеальность. Это про принятие.',
      'Красота рождается там, где есть любовь.',
    ],
  },
};

export default function StatePage() {
  const { slug } = useParams<{ slug: string }>();
  const data = stateData[slug || 'inspiration'];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-milk">
        <p className="text-text-secondary">Состояние не найдено</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${data.gradient}`}>
      {/* Навигация */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-6 bg-white/60 backdrop-blur-md">
        <Link 
          to="/" 
          className="font-serif text-xl md:text-2xl text-text-primary tracking-wide hover:text-amethyst transition-colors duration-500"
        >
          Надя Сок
        </Link>
        <Link 
          to="/enter"
          className="text-sm text-text-secondary hover:text-amethyst transition-colors duration-500"
        >
          Все состояния
        </Link>
      </nav>

      {/* Блок 1: Резонанс */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-2xl text-center opacity-0 animate-fade-in-up">
          <span className={`inline-block font-serif text-lg md:text-xl ${data.accentColor} mb-8 opacity-80`}>
            {data.title}
          </span>
          
          <h1 className="heading-xl text-4xl md:text-5xl lg:text-6xl text-text-primary mb-8 leading-tight">
            {data.resonanceText}
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary font-light leading-relaxed">
            {data.resonanceSubtext}
          </p>
        </div>

        {/* Индикатор скролла */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in delay-500">
          <div className="flex flex-col items-center gap-3">
            <span className="text-text-muted text-xs tracking-widest uppercase">Листайте</span>
            <div className="w-px h-12 bg-gradient-to-b from-text-muted/50 to-transparent animate-pulse-soft" />
          </div>
        </div>
      </section>

      {/* Блок 2: Галерея */}
      <section className="section-air px-6 md:px-12 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="heading-lg text-3xl md:text-4xl text-text-primary mb-4">
              Работы
            </h2>
            <p className="text-text-secondary font-light max-w-lg mx-auto">
              Каждая картина — это остановленное ощущение. Замершее мгновение внутреннего мира.
            </p>
          </div>
          
          <Gallery stateFilter={slug} />
        </div>
      </section>

      {/* Блок 3: Присутствие художника */}
      <section className="section-breathe px-6 md:px-12 bg-gradient-to-b from-transparent via-lavender-soft/30 to-transparent">
        <ArtistPresence texts={data.presenceText} accentColor={data.accentColor} />
      </section>

      {/* Блок 4: Переход */}
      <section className="section-breathe px-6 md:px-12">
        <CTASection />
      </section>
    </div>
  );
}
