import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Gallery from '../components/Gallery';
import ContactModal from '../components/ContactModal';
import { sanityClient, queries } from '../lib/sanity';

export default function MainPage() {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('paintings');

  // Sanity data
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [installations, setInstallations] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [paintingsCount, setPaintingsCount] = useState(0);

  useEffect(() => {
    Promise.all([
      sanityClient.fetch(queries.allWorkshops),
      sanityClient.fetch(queries.allInstallations),
      sanityClient.fetch(queries.allProjects),
      sanityClient.fetch(`count(*[_type == "painting"])`),
    ])
      .then(([w, i, p, pc]) => {
        setWorkshops(w || []);
        setInstallations(i || []);
        setProjects(p || []);
        setPaintingsCount(pc || 0);
      })
      .catch(console.error);
  }, []);

  // Многоуровневый блок "Обо мне"
  const [expandedFact, setExpandedFact] = useState<number | null>(null);
  const [expandedSubFact, setExpandedSubFact] = useState<number | null>(null);

  // GIF popup
  const [activeGif, setActiveGif] = useState<{ url: string; key: number; emoji: string } | null>(null);
  const gifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (gifTimerRef.current) clearTimeout(gifTimerRef.current);
    };
  }, []);

  const showGif = (gifUrl: string, emoji: string) => {
    if (gifTimerRef.current) clearTimeout(gifTimerRef.current);
    setActiveGif({ url: gifUrl, key: Date.now(), emoji });
    gifTimerRef.current = setTimeout(() => {
      setActiveGif(null);
      gifTimerRef.current = null;
    }, 5000);
  };

  // Плавный скролл
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const categories = [
    {
      id: 'paintings',
      title: 'Картины',
      subtitle: 'Картина — это остановленное ощущение',
      count: paintingsCount,
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
      gradient: 'from-emerald-50 to-teal-100',
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
            { icon: '🌙', text: 'Часто работаю ночью, когда мир затихает', gif: '/gifs/night.gif' },
            { icon: '🎵', text: 'Музыка помогает войти в нужное состояние', gif: '/gifs/music.gif' },
          ],
        },
      ],
    },
    {
      emoji: '🌊',
      title: 'Люблю стихии',
      content: 'Воду, как ощущение, землю, как твердь, воздух, как помощь, огонь, как стремление',
      subFacts: [
        {
          icon: '⛰️',
          title: 'Озёра и леса',
          content: 'Учат терпению, масштабу и напоминают о бесконечности.',
          deepFacts: [
            { icon: '🌲', text: 'Езжу на природу за вдохновением', gif: '/gifs/mountains.gif' },
            { icon: '🌅', text: 'Вода напоминает о состоянии текучести', gif: '/gifs/sea.gif' },
          ],
        },
      ],
    },
    {
      emoji: '💜',
      title: 'Фиолетовый — мой цвет',
      content: 'Творчество, свобода, духовность.',
      subFacts: [
        {
          icon: '🔮',
          title: 'Оттенки',
          content: 'От нежной сирени до глубокого аметиста.',
          deepFacts: [
            { icon: '✨', text: 'В каждой работе есть хотя бы намёк на фиолетовый', gif: '/gifs/violet.gif' },
            { icon: '🎨', text: 'Фиолетовый — цвет между небом и землёй', gif: '/gifs/sky.gif' },
          ],
        },
      ],
    },
    {
      emoji: '✨',
      title: 'Люблю удивляться',
      content: 'Самое интересное — когда появляется неожиданное.',
      subFacts: [
        {
          icon: '🎭',
          title: 'Эксперименты',
          content: 'Пробую новые техники и материалы.',
          deepFacts: [
            { icon: '🧪', text: 'Смешиваю акрил, масло и цифровое искусство', gif: '/gifs/mix.gif' },
            { icon: '🌟', text: 'Каждая работа — это маленькое открытие', gif: '/gifs/discovery.gif' },
          ],
        },
      ],
    },
    {
      emoji: '🤝',
      title: 'Ценю диалог',
      content: 'Искусство — это не монолог. Важно делиться и слышать отклик.',
      subFacts: [
        {
          icon: '💬',
          title: 'Общение',
          content: 'Люблю говорить о искусстве и жизни.',
          deepFacts: [
            { icon: '☕', text: 'За чашкой чая рождаются лучшие идеи', gif: '/gifs/tea.gif' },
            { icon: '📝', text: 'Всегда открыта для совместных проектов', gif: '/gifs/collab.gif' },
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-milk overflow-x-hidden relative">
      {/* Декоративные элементы — absolute вместо fixed для мобилки */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ position: 'absolute' }}>
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-lavender-soft/30 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-violet-smoke/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-32 left-[15%] w-2 h-2 bg-lavender/60 rounded-full animate-twinkle" />
        <div className="absolute top-48 right-[20%] w-3 h-3 bg-amethyst/40 rounded-full animate-twinkle" style={{ animationDelay: '0.7s' }} />
        <div className="absolute top-[60%] left-[10%] w-2 h-2 bg-violet-deep/30 rounded-full animate-twinkle" style={{ animationDelay: '1.4s' }} />
        <div className="absolute bottom-[30%] right-[15%] w-2 h-2 bg-lilac/50 rounded-full animate-twinkle" style={{ animationDelay: '2.1s' }} />
      </div>

      {/* Навигация — sticky чтобы не двигалась при свайпе */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-12 py-4 md:py-5 bg-milk/80 backdrop-blur-lg border-b border-lavender-soft/50" style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}>
        <Link to="/" className="font-serif text-xl md:text-2xl text-text-primary tracking-wide hover:text-amethyst transition-colors duration-500">
          Надя Сок
        </Link>
        <div className="flex items-center gap-2 md:gap-3">
          <Link to="/enter" className="inline-flex items-center gap-1.5 px-3 md:px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-500 bg-gradient-to-r from-lavender to-amethyst text-white shadow-md shadow-amethyst/20 hover:shadow-lg hover:shadow-amethyst/30 hover:-translate-y-0.5 active:scale-[0.97]">
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="hidden sm:inline">Выбрать </span>состояние
          </Link>
          <Link to="/thoughts" className="inline-flex items-center gap-1.5 px-3 md:px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-500 bg-gradient-to-r from-mint to-mint-deep text-white shadow-md shadow-mint-deep/20 hover:shadow-lg hover:shadow-mint-deep/30 hover:-translate-y-0.5 active:scale-[0.97]">
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="hidden sm:inline">Мысли </span><span className="hidden md:inline">художника</span><span className="md:hidden">мысли</span>
          </Link>
        </div>
      </nav>

      {/* Мятная пульсация — без delay, разные скорости для десинхронизации */}
      <div 
        className="absolute top-20 left-1/3 w-[300px] md:w-[450px] h-[300px] md:h-[450px] rounded-full pointer-events-none z-0" 
        style={{ background: 'rgba(168, 230, 207, 0.4)', filter: 'blur(60px)', animation: 'mint-pulse 8s ease-in-out infinite' }} 
      />
      <div 
        className="absolute top-40 right-1/4 w-[250px] md:w-[350px] h-[250px] md:h-[350px] rounded-full pointer-events-none z-0" 
        style={{ background: 'rgba(200, 240, 222, 0.45)', filter: 'blur(55px)', animation: 'mint-pulse 11s ease-in-out infinite' }} 
      />
      <div 
        className="absolute top-[300px] left-1/2 -translate-x-1/2 w-[350px] md:w-[500px] h-[250px] md:h-[350px] rounded-full pointer-events-none z-0" 
        style={{ background: 'rgba(124, 203, 162, 0.35)', filter: 'blur(65px)', animation: 'mint-pulse 14s ease-in-out infinite' }} 
      />

      {/* Hero */}
      <section className="pt-28 pb-8 px-6 md:px-12 relative">
        <div className="max-w-4xl mx-auto text-center opacity-0 animate-fade-in-up">
          <h1 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl text-text-primary mb-4 leading-tight">
            Искусство как
            <span className="block text-amethyst">расширение</span>
          </h1>
          <p className="text-base md:text-lg text-text-secondary font-light max-w-xl mx-auto mb-8">
            Свобода выражения. Исследование внутреннего мира. 
            Лёгкое удивление от того, что появляется.
          </p>
        </div>

        {/* Категории */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToSection(cat.id)}
              className={`group relative overflow-hidden rounded-2xl p-4 md:p-5 text-left transition-all duration-500 ${
                activeSection === cat.id 
                  ? `bg-gradient-to-br ${cat.gradient} shadow-lg shadow-lavender/20` 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-100 scale-0">
                <svg className="w-6 h-6 text-lavender/60 animate-flower-bloom" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="3" /><circle cx="12" cy="6" r="2" /><circle cx="12" cy="18" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="12" r="2" />
                </svg>
              </div>
              <div className="relative">
                <h3 className={`font-serif text-base md:text-lg mb-1 transition-all duration-500 ${activeSection === cat.id ? 'text-amethyst animate-pulse-colors' : 'text-text-primary'}`}>
                  {cat.title}
                </h3>
                {activeSection === cat.id && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center gap-2 pointer-events-none">
                    <span className="text-xs animate-hearts-rise" style={{ animationDelay: '0s' }}>💜</span>
                    <span className="text-xs animate-hearts-rise" style={{ animationDelay: '0.3s' }}>💜</span>
                    <span className="text-xs animate-hearts-rise" style={{ animationDelay: '0.6s' }}>💜</span>
                  </div>
                )}
              </div>
              <p className="text-text-muted text-xs flex items-center gap-1">
                <span className="opacity-70">{cat.icon}</span>
                {cat.count} {cat.count === 1 ? 'работа' : cat.count < 5 ? 'работы' : 'работ'}
              </p>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Декоративный разделитель */}
      <div className="py-12 opacity-0 animate-fade-in">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center">
          <svg viewBox="0 0 800 60" className="w-full h-12 md:h-16" preserveAspectRatio="none">
            <defs>
              <linearGradient id="zigzag-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" /><stop offset="20%" stopColor="#C4B5D9" /><stop offset="50%" stopColor="#9B7BC7" /><stop offset="80%" stopColor="#C4B5D9" /><stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path d="M0,30 Q50,10 100,30 T200,30 T300,30 T400,30 T500,30 T600,30 T700,30 T800,30" stroke="url(#zigzag-gradient)" strokeWidth="1.5" fill="none" className="animate-pulse-soft" />
            <circle cx="400" cy="30" r="4" fill="#9B7BC7" className="animate-glow-pulse" />
            <circle cx="200" cy="30" r="2" fill="#C4B5D9" className="animate-dots-dance" />
            <circle cx="600" cy="30" r="2" fill="#C4B5D9" className="animate-dots-dance" style={{ animationDelay: '0.5s' }} />
          </svg>
        </div>
      </div>

      {/* Развернутый раздел */}
      <section ref={sectionRef} className="px-6 md:px-12 pb-20 bg-white/30 animate-fade-in scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-light text-2xl md:text-3xl text-text-primary mb-3">
              {categories.find(c => c.id === activeSection)?.title}
            </h2>
            <p className="text-text-secondary font-light text-sm md:text-base">
              {categories.find(c => c.id === activeSection)?.subtitle}
            </p>
          </div>

          {activeSection === 'paintings' && <Gallery showFilters />}
          
          {activeSection === 'workshops' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map((workshop: any) => (
                <div
                  key={workshop._id}
                  className="group card-soft p-5 hover:bg-white cursor-pointer relative overflow-hidden"
                  onClick={() => navigate(`/workshop/${workshop.slug}`)}
                >
                  <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-lavender-soft">
                    <img
                      src={workshop.imageUrl}
                      alt={workshop.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-serif text-lg text-text-primary mb-2 group-hover:text-amethyst transition-colors">{workshop.title}</h3>
                  <p className="text-text-secondary text-sm font-light line-clamp-2 mb-3">{workshop.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-text-muted text-xs">
                      <span>{workshop.duration}</span>
                      {workshop.price && <span>{workshop.price}</span>}
                    </div>
                    <span className="text-amethyst text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Подробнее →</span>
                  </div>
                </div>
              ))}
              {workshops.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-text-muted font-light">Мастер-классы скоро появятся</p>
                </div>
              )}
            </div>
          )}
          
          {activeSection === 'installations' && (
            <div className="grid md:grid-cols-2 gap-6">
              {installations.map((installation: any) => (
                <div
                  key={installation._id}
                  className="group card-soft p-5 hover:bg-white cursor-pointer relative overflow-hidden"
                  onClick={() => navigate(`/installation/${installation.slug}`)}
                >
                  <div className="aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-lavender-soft">
                    <img src={installation.imageUrl} alt={installation.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="font-serif text-lg text-text-primary mb-2 group-hover:text-amethyst transition-colors">{installation.title}</h3>
                  <p className="text-text-secondary text-sm font-light line-clamp-2 mb-3">{installation.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-text-muted text-xs">
                      {installation.location && <span>{installation.location}</span>}
                      {installation.year && <span>{installation.year}</span>}
                    </div>
                    <span className="text-amethyst text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Подробнее →</span>
                  </div>
                </div>
              ))}
              {installations.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-text-muted font-light">Инсталляции скоро появятся</p>
                </div>
              )}
            </div>
          )}
          
          {activeSection === 'projects' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: any) => (
                <div key={project._id} className="group card-soft p-5 hover:bg-white cursor-pointer" onClick={() => navigate(`/project/${project.slug}`)}>
                  <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-lavender-soft">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <span className="text-xs text-lavender uppercase tracking-wider">
                    {project.type === 'exhibition' ? 'Выставка' : project.type === 'collaboration' ? 'Коллаборация' : 'Перформанс'}
                  </span>
                  <h3 className="font-serif text-lg text-text-primary mb-2 mt-2 group-hover:text-amethyst transition-colors">{project.title}</h3>
                  <p className="text-text-secondary text-sm font-light line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex justify-end">
                    <span className="text-amethyst text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Подробнее →</span>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-text-muted font-light">Проекты скоро появятся</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Видео блок */}
<section className="relative w-full h-screen overflow-hidden">
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
    poster="/video-poster.jpg"  // можно удалить или заменить, если не нужен
  >
    <source src="/super.mp4" type="video/mp4" />
    Ваш браузер не поддерживает видео.
  </video>

  <div className="absolute inset-0 bg-gradient-to-b from-milk via-transparent to-milk" />
  <div className="absolute inset-0 bg-milk/20" />

  <div className="absolute inset-0 flex items-center justify-center">
    <p className="font-serif text-2xl md:text-4xl lg:text-5xl text-text-primary/80 text-center px-6 max-w-3xl leading-relaxed">
      Процесс создания — <br className="hidden sm:block" />
      <span className="text-amethyst">это тоже искусство</span>
    </p>
  </div>
</section>

      {/* Блок "Обо мне" */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-gradient-to-b from-milk via-mint-light/20 to-lavender-soft/20 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-smoke/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-lavender-soft/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-[10%] w-[400px] h-[400px] bg-mint/10 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/3 left-[5%] w-[350px] h-[350px] bg-mint-soft/15 rounded-full blur-3xl animate-float" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-lavender" />
              <span className="text-lavender text-sm uppercase tracking-wider">Немного обо мне</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-lavender" />
            </div>
            <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-text-primary leading-relaxed">
              Я — художник, который
              <span className="block text-amethyst mt-2">создаёт в состоянии свободы</span>
            </h2>
          </div>

          <div className="space-y-4">
            {aboutFacts.map((fact, index) => (
              <div key={index} className={`rounded-3xl transition-all duration-700 ease-out overflow-hidden ${expandedFact === index ? 'bg-white shadow-xl shadow-lavender/20' : 'bg-white/60 hover:bg-white hover:shadow-lg hover:shadow-lavender/10'}`}>
                <div onClick={() => { setExpandedFact(expandedFact === index ? null : index); setExpandedSubFact(null); }} className="p-6 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl transition-all duration-500 ${expandedFact === index ? 'scale-125 animate-bounce-soft' : ''}`}>{fact.emoji}</div>
                    <h3 className={`font-serif text-xl transition-colors duration-500 flex-1 ${expandedFact === index ? 'text-amethyst' : 'text-text-primary'}`}>{fact.title}</h3>
                    {expandedFact === index && (
                      <div className="animate-flower-bloom">
                        <svg className="w-6 h-6 text-lavender" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="12" r="3" /><circle cx="12" cy="6" r="2" /><circle cx="12" cy="18" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="12" r="2" />
                        </svg>
                      </div>
                    )}
                    <svg className={`w-5 h-5 text-lavender transition-transform duration-500 ${expandedFact === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <p className={`text-text-secondary font-light mt-2 transition-all duration-500 ${expandedFact === index ? 'opacity-100' : 'opacity-70'}`}>{fact.content}</p>
                </div>

                {expandedFact === index && fact.subFacts && (
                  <div className="px-6 pb-6 space-y-3 animate-unfold">
                    <div className="h-px bg-gradient-to-r from-transparent via-lavender-soft to-transparent mb-4" />
                    {fact.subFacts.map((subFact, subIndex) => (
                      <div key={subIndex} className={`ml-8 rounded-2xl transition-all duration-500 overflow-hidden ${expandedSubFact === subIndex ? 'bg-lavender-soft/50' : 'bg-lavender-soft/20 hover:bg-lavender-soft/30'}`}>
                        <div onClick={(e) => { e.stopPropagation(); setExpandedSubFact(expandedSubFact === subIndex ? null : subIndex); }} className="p-4 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <span className={`text-xl transition-transform duration-300 ${expandedSubFact === subIndex ? 'scale-125' : ''}`}>{subFact.icon}</span>
                            <span className={`font-medium transition-colors ${expandedSubFact === subIndex ? 'text-amethyst' : 'text-text-primary'}`}>{subFact.title}</span>
                            {subFact.deepFacts && (
                              <svg className={`w-4 h-4 text-lavender ml-auto transition-transform duration-500 ${expandedSubFact === subIndex ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                          <p className="text-text-secondary text-sm font-light mt-1">{subFact.content}</p>
                        </div>
                        {expandedSubFact === subIndex && subFact.deepFacts && (
                          <div className="px-4 pb-4 space-y-2 animate-reveal-right">
                            {subFact.deepFacts.map((deepFact, deepIndex) => (
                              <div key={deepIndex} onClick={(e) => { e.stopPropagation(); showGif(deepFact.gif, fact.emoji); }} className="ml-6 p-3 rounded-xl transition-all duration-300 cursor-pointer bg-white/50 hover:bg-white hover:shadow-md active:scale-[0.97] group/deep">
                                <div className="flex items-center gap-2">
                                  <span className="text-base group-hover/deep:scale-125 transition-transform duration-300">{deepFact.icon}</span>
                                  <span className="text-text-secondary text-sm group-hover/deep:text-amethyst transition-colors">{deepFact.text}</span>
                                  <span className="ml-auto text-xs text-lavender/60 opacity-0 group-hover/deep:opacity-100 transition-opacity whitespace-nowrap">нажми 🎬</span>
                                </div>
                              </div>
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

          <div className="mt-16 text-center">
            <div className="inline-block bg-white/80 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-lg shadow-lavender/10 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
              <blockquote className="font-serif text-xl md:text-2xl text-text-primary italic relative z-10">«Мне нравится удивляться тому, что появляется»</blockquote>
              <div className="mt-4 flex items-center justify-center gap-2 relative z-10">
                <div className="w-8 h-px bg-lavender" /><span className="text-lavender text-sm">Надя</span><div className="w-8 h-px bg-lavender" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Финальный блок */}
      <section className="py-40 md:py-52 lg:py-64 px-6 md:px-12 bg-gradient-to-b from-lavender-soft/20 via-lavender-light/30 to-lavender-soft/40 relative overflow-hidden">
        <div className="absolute top-24 left-1/2 -translate-x-1/2">
          <div className="w-3 h-3 bg-amethyst rounded-full animate-glow-pulse" />
          <div className="w-px h-20 bg-gradient-to-b from-amethyst/50 to-transparent mx-auto mt-3" />
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-text-primary mb-16 opacity-0 animate-fade-in-up leading-relaxed">
            Иногда всё начинается<span className="block mt-3">с простого «а вдруг?»</span>
          </h2>
          <div className="space-y-8 mb-20 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl md:text-2xl text-text-secondary font-light leading-relaxed">Я люблю пробовать новое.</p>
            <p className="text-xl md:text-2xl text-text-secondary font-light leading-relaxed">Если тебе хочется исследовать что-то вместе —<br className="hidden sm:block" />можно написать.</p>
            <p className="text-lg text-text-muted font-light italic mt-12">Посмотрим, куда это приведёт.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-5 justify-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button onClick={() => setShowContactModal(true)} className="group btn-primary text-base px-10 py-4 relative overflow-hidden">
              <span className="relative z-10">Написать</span>
              <div className="absolute -top-4 left-1/4 opacity-0 group-hover:opacity-100"><span className="text-sm animate-hearts-rise">💜</span></div>
              <div className="absolute -top-4 right-1/4 opacity-0 group-hover:opacity-100"><span className="text-sm animate-hearts-rise" style={{ animationDelay: '0.2s' }}>💜</span></div>
            </button>
            <button onClick={() => setShowContactModal(true)} className="btn-secondary text-base px-10 py-4">Предложить идею</button>
          </div>
        </div>
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-5">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-lavender" />
          <div className="w-2 h-2 bg-lavender rounded-full animate-dots-dance" />
          <div className="w-1.5 h-1.5 bg-amethyst rounded-full animate-dots-dance" style={{ animationDelay: '0.3s' }} />
          <div className="w-2 h-2 bg-lavender rounded-full animate-dots-dance" style={{ animationDelay: '0.6s' }} />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-lavender" />
        </div>
      </section>

      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}

      {/* GIF Popup */}
      {activeGif && (
        <div key={activeGif.key} className="fixed inset-0 z-[150] pointer-events-none" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="absolute inset-0 bg-text-primary/10 backdrop-blur-[3px]" style={{ animation: 'fade-in 0.3s ease-out' }} />
          <div className="relative z-10" style={{ animation: 'gif-fly 5s ease-in-out forwards' }}>
            <div className="absolute -inset-8 bg-amethyst/20 rounded-[2.5rem] blur-3xl animate-breathe" />
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl shadow-amethyst/40 border-2 border-white/70">
              <div className="absolute inset-0 bg-gradient-to-br from-lavender-soft via-lavender to-amethyst/50 flex items-center justify-center">
                <span className="text-7xl animate-bounce-soft drop-shadow-lg">{activeGif.emoji}</span>
              </div>
              <img src={activeGif.url} alt="" className="absolute inset-0 w-full h-full object-cover z-10" />
            </div>
            <div className="absolute -top-5 -right-5 text-2xl animate-twinkle">✨</div>
            <div className="absolute -bottom-4 -left-5 text-xl animate-twinkle" style={{ animationDelay: '0.4s' }}>💫</div>
          </div>
        </div>
      )}
    </div>
  );
}
