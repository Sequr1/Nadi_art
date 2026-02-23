import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Gallery from '../components/Gallery';
import ContactModal from '../components/ContactModal';
import { sanityClient, queries, urlFor } from '../../sanity'; // Убедитесь, что путь к sanity.ts верный
import type { Painting, Workshop, Installation, Project } from '../../types'; // Убедитесь, что путь к types.ts верный

export default function MainPage() {
  const navigate = useNavigate();
  const sectionsRef = useRef<HTMLDivElement>(null); // Для плавного скролла

  // --- Состояния для данных из Sanity ---
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Общие состояния страницы ---
  const [showContactModal, setShowContactModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('paintings');

  // --- Состояния для блока "Обо мне" ---
  const [expandedFact, setExpandedFact] = useState<number | null>(null);
  const [expandedSubFact, setExpandedSubFact] = useState<number | null>(null);

  // --- Состояния для анимации гифок ---
  const [activeGif, setActiveGif] = useState<string | null>(null);
  const [showGif, setShowGif] = useState(false);

  // Загрузка данных из Sanity при открытии страницы
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [paintingsData, workshopsData, installationsData, projectsData] = await Promise.all([
          sanityClient.fetch(queries.allPaintings),
          sanityClient.fetch(queries.allWorkshops),
          sanityClient.fetch(queries.allInstallations),
          sanityClient.fetch(queries.allProjects),
        ]);

        // Преобразуем данные, чтобы они соответствовали вашим типам (особенно картинки)
        setPaintings(paintingsData.map((p: any) => ({ ...p, imageUrl: urlFor(p.image).width(800).url() })));
        setWorkshops(workshopsData.map((w: any) => ({ ...w, imageUrl: urlFor(w.image).width(800).url() })));
        setInstallations(installationsData.map((i: any) => ({ ...i, imageUrl: urlFor(i.coverImage).width(800).url() })));
        setProjects(projectsData.map((p: any) => ({ ...p, imageUrl: urlFor(p.coverImage).width(800).url() })));
      } catch (error) {
        console.error("Ошибка при загрузке данных из Sanity:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    {
      id: 'paintings',
      title: 'Картины',
      subtitle: 'Картина — это остановленное ощущение',
      count: paintings.length,
      gradient: 'from-violet-100 to-lavender-light',
      icon: '🎨',
    },
    {
      id: 'workshops',
      title: 'Мастер-классы',
      subtitle: 'Процесс важнее формы',
      count: workshops.length,
      gradient: 'from-amber-50 to-orange-100',
      icon: '✨',
    },
    {
      id: 'installations',
      title: 'Инсталляции',
      subtitle: 'Пространство, в которое можно войти',
      count: installations.length,
      gradient: 'from-emerald-50 to-teal-100', // Старый градиент
      icon: '🌿',
    },
    {
      id: 'projects',
      title: 'Проекты',
      subtitle: 'Иногда идеи выходят за рамки холста',
      count: projects.length,
      gradient: 'from-blue-50 to-indigo-100',
      icon: '🌊',
    },
  ];

  // Данные для блока "Обо мне" с возможностью добавить гифку к любому элементу
  const aboutFacts = [
    {
      emoji: '🎨',
      title: 'Пишу из состояния',
      content: 'Каждая картина — это застывший момент внутреннего переживания.',
      subFacts: [
        {
          icon: '💫',
          title: 'Процесс',
          content: 'Иногда процесс ведёт меня, иногда я веду его.',
          deepFacts: [
            { icon: '🌙', text: 'Часто работаю ночью, когда мир затихает', gifName: 'night-owl' },
            { icon: '🎵', text: 'Музыка помогает войти в нужное состояние', gifName: 'music-vibes' },
          ]
        },
        { icon: '🌈', title: 'Цвета', content: 'Цвет выбирает себя сам — я только слушаю.', gifName: 'color-splash' },
      ]
    },
    {
      emoji: '🌊',
      title: 'Люблю стихии',
      content: 'Горы, море, ветер — они напоминают о постоянном движении.',
      subFacts: [
        {
          icon: '⛰️',
          title: 'Горы',
          content: 'Учат терпению и масштабу.',
          deepFacts: [
            { icon: '🏔️', text: 'Каждый год езжу в горы за вдохновением', gifName: 'mountain-trip' },
          ]
        },
        { icon: '🌅', title: 'Море', content: 'Напоминает о бесконечности.', gifName: 'sea-infinity' },
      ]
    },
    {
      emoji: '🌿',
      title: 'И мятный — для лёгкости',
      content: 'Свежесть, дыхание, новое начало. Он как глоток чистого воздуха.',
      gifName: 'mint-fresh',
    },
    {
      emoji: '💜',
      title: 'Фиолетовый — мой цвет',
      content: 'Творчество, свобода, духовность.',
      gifName: 'purple-rain',
    },
    {
      emoji: '🤝',
      title: 'Ценю диалог',
      content: 'Искусство — это не монолог. Важно делиться и слышать отклик.',
    },
  ];
  
  // Универсальная функция для запуска гифки
  const handleFactClick = (gifName: string | undefined) => {
    if (!gifName || showGif) return;

    setActiveGif(gifName);
    setShowGif(true);

    setTimeout(() => { setShowGif(false); }, 4000); // Гифка улетает
    setTimeout(() => { setActiveGif(null); }, 5000); // Очищаем состояние
  };

  return (
    <div className="min-h-screen bg-milk">
      {/* --- Декоративные элементы с мятной пульсацией --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Фиолетовые пятна */}
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-lavender-soft/30 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-violet-smoke/20 rounded-full blur-3xl animate-float" />
        
        {/* НОВАЯ МЯТНАЯ ПУЛЬСАЦИЯ */}
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-mint-soft/30 rounded-full blur-3xl animate-breathe" style={{ animationDuration: '8s' }} />

        {/* Мерцающие точки */}
        <div className="absolute top-32 left-[15%] w-2 h-2 bg-lavender/60 rounded-full animate-twinkle" />
        <div className="absolute top-48 right-[20%] w-3 h-3 bg-amethyst/40 rounded-full animate-twinkle" style={{ animationDelay: '0.7s' }} />
        <div className="absolute top-[60%] left-[10%] w-2 h-2 bg-violet-deep/30 rounded-full animate-twinkle" style={{ animationDelay: '1.4s' }} />
        <div className="absolute bottom-[30%] right-[15%] w-2 h-2 bg-lilac/50 rounded-full animate-twinkle" style={{ animationDelay: '2.1s' }} />
        
        {/* Плавающие элементы */}
        <div className="absolute top-[40%] right-[8%] animate-float-around" style={{ animationDelay: '0s' }}>
          <div className="w-4 h-4 border border-lavender/30 rounded-full" />
        </div>
        <div className="absolute top-[70%] left-[5%] animate-float-around" style={{ animationDelay: '2s' }}>
          <div className="w-3 h-3 bg-lavender-soft/40 rounded-full" />
        </div>
      </div>

      {/* --- Контейнер для вылетающей гифки --- */}
      {activeGif && showGif && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
          <img 
            src={`/gifs/${activeGif}.gif`} // ВАЖНО: Путь к гифкам: public/gifs/
            alt="Surprise!"
            className="max-w-xs md:max-w-md animate-fly-out"
          />
        </div>
      )}

      {/* Навигация */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-milk/80 backdrop-blur-lg border-b border-lavender-soft/50">
        <Link to="/" className="font-serif text-xl md:text-2xl text-text-primary tracking-wide hover:text-amethyst transition-colors duration-500">
          Надя Сок
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/enter" className="text-sm text-text-secondary hover:text-amethyst transition-colors duration-500 hidden sm:block">
            Состояния
          </Link>
          <button onClick={() => setShowContactModal(true)} className="btn-primary text-sm py-2">
            Написать
          </button>
        </div>
      </nav>

      {/* Hero-блок */}
      <section className="pt-28 pb-8 px-6 md:px-12 relative">
        <div className="max-w-4xl mx-auto text-center opacity-0 animate-fade-in-up">
          <h1 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl text-text-primary mb-4 leading-tight">
            Искусство как <span className="block text-amethyst">расширение</span>
          </h1>
          <p className="text-base md:text-lg text-text-secondary font-light max-w-xl mx-auto mb-8">
            Свобода выражения. Исследование внутреннего мира. Лёгкое удивление от того, что появляется.
          </p>
        </div>

        {/* Категории с плавным скроллом */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveSection(cat.id);
                sectionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`group relative overflow-hidden rounded-2xl p-4 md:p-5 text-left transition-all duration-500 ${activeSection === cat.id ? `bg-gradient-to-br ${cat.gradient} shadow-lg shadow-lavender/20` : 'bg-white/60 hover:bg-white/80'}`}>
                {/* ... (код внутри кнопки категории остается без изменений) ... */}
                <h3 className={`font-serif text-base md:text-lg mb-1 transition-all duration-500 ${activeSection === cat.id ? 'text-amethyst animate-pulse-colors' : 'text-text-primary'}`}>{cat.title}</h3>
                <p className="text-text-muted text-xs flex items-center gap-1"><span className="opacity-70">{cat.icon}</span> {cat.count} {cat.count === 1 ? 'работа' : cat.count < 5 ? 'работы' : 'работ'}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Декоративный разделитель */}
      {/* ... (код зигзага остается без изменений) ... */}

      {/* Развернутый раздел с ref для скролла */}
      <section ref={sectionsRef} className="px-6 md:px-12 pb-20 bg-white/30 animate-fade-in scroll-mt-20"> {/* scroll-mt-20 — чтобы заголовок не прилипал к верху экрана */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-light text-2xl md:text-3xl text-text-primary mb-3">{categories.find(c => c.id === activeSection)?.title}</h2>
            <p className="text-text-secondary font-light text-sm md:text-base">{categories.find(c => c.id === activeSection)?.subtitle}</p>
          </div>

          {/* Контент раздела */}
          {isLoading ? (
            <div className="text-center py-10 text-text-muted">Загрузка работ...</div>
          ) : (
            <>
              {activeSection === 'paintings' && <Gallery paintings={paintings} showFilters />}
              {activeSection === 'workshops' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{workshops.map((workshop) => (<div key={workshop._id} onClick={() => navigate(`/workshop/${workshop.slug}`)}>{/* ... */}</div>))}</div>
              )}
              {activeSection === 'installations' && (
                <div className="grid md:grid-cols-2 gap-6">{installations.map((installation) => (<div key={installation._id} onClick={() => navigate(`/installation/${installation.slug}`)}>{/* ... */}</div>))}</div>
              )}
              {activeSection === 'projects' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{projects.map((project) => (<div key={project._id} onClick={() => navigate(`/project/${project.slug}`)}>{/* ... */}</div>))}</div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Видео блок */}
      {/* ... (код видео-блока остается без изменений) ... */}

      {/* Блок "Обо мне" — МНОГОУРОВНЕВЫЙ И КЛИКАБЕЛЬНЫЙ */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-gradient-to-b from-milk to-lavender-soft/20 relative overflow-hidden">
        {/* ... (декорации остаются без изменений) ... */}
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">{/* ... (заголовок блока) ... */}</div>

          <div className="space-y-4">
            {aboutFacts.map((fact, index) => (
              <div key={index} className={`rounded-3xl transition-all duration-700 ease-out overflow-hidden ${expandedFact === index ? 'bg-white shadow-xl shadow-lavender/20' : 'bg-white/60 hover:bg-white hover:shadow-lg'}`}>
                <div
                  onClick={() => {
                    if (fact.gifName) {
                      handleFactClick(fact.gifName);
                    } else if (fact.subFacts) {
                      setExpandedFact(expandedFact === index ? null : index);
                      setExpandedSubFact(null);
                    }
                  }}
                  className="p-6 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{fact.emoji}</div>
                    <h3 className={`font-serif text-xl flex-1 ${expandedFact === index ? 'text-amethyst' : 'text-text-primary'}`}>{fact.title}</h3>
                    {fact.subFacts && (
                      <svg className={`w-5 h-5 text-lavender transition-transform duration-500 ${expandedFact === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                  <p className="text-text-secondary font-light mt-2">{fact.content}</p>
                </div>

                {expandedFact === index && fact.subFacts && (
                  <div className="px-6 pb-6 space-y-3 animate-unfold">
                    <div className="h-px bg-gradient-to-r from-transparent via-lavender-soft to-transparent mb-4" />
                    {fact.subFacts.map((subFact, subIndex) => (
                      <div
                        key={subIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (subFact.gifName) {
                            handleFactClick(subFact.gifName);
                          } else if (subFact.deepFacts) {
                            setExpandedSubFact(expandedSubFact === subIndex ? null : subIndex);
                          }
                        }}
                        className={`ml-8 rounded-2xl p-4 cursor-pointer transition-all duration-300 ${expandedSubFact === subIndex ? 'bg-lavender-soft/50' : 'bg-lavender-soft/20 hover:bg-lavender-soft/30'}`}
                      >
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{subFact.icon}</span>
                            <span className="font-medium text-text-primary flex-1">{subFact.title}</span>
                            {subFact.deepFacts && (
                              <svg className={`w-4 h-4 text-lavender ml-auto transition-transform duration-500 ${expandedSubFact === subIndex ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                          <p className="text-text-secondary text-sm font-light mt-1">{subFact.content}</p>
                        </div>
                        {expandedSubFact === subIndex && subFact.deepFacts && (
                          <div className="pt-4 space-y-2 animate-reveal-right">
                            {subFact.deepFacts.map((deepFact, deepIndex) => (
                              <button
                                key={deepIndex}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFactClick(deepFact.gifName);
                                }}
                                className="ml-6 p-3 rounded-xl w-full text-left transition-all duration-300 bg-white/50 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!deepFact.gifName || showGif}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{deepFact.icon}</span>
                                  <span className="text-text-secondary text-sm">{deepFact.text}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">{/* ... (цитата остается без изменений) ... */}</div>
        </div>
      </section>
      
      {/* Финальный блок */}
      {/* ... (код финального блока остается без изменений) ... */}

      {/* Модальное окно контактов */}
      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
    </div>
  );
}
