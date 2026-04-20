import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { sanityClient, queries, urlFor } from '../lib/sanity';

// ═══════════════════════════════════════════════
// Данные состояний — захардкожены, без Sanity
// ═══════════════════════════════════════════════

const statesData: Record<string, {
  emoji: string;
  title: string;
  gradient: string;
  gradientHero: string;
  textColor: string;
  accentBg: string;
  borderColor: string;
  dotColor: string;
  // Блок 1: Подтверждение
  statement: string;
  description: string;
  // Блок 3: Личность художницы
  artistTexts: {
    feel: string;
    paint: string;
    believe: string;
  };
  // Блок 4: Мастерская
  workshopText: string;
  // Визуальные ассоциации (теги)
  associations: string[];
}> = {
  energy: {
    emoji: '🔥',
    title: 'Энергия',
    gradient: 'from-red-50 via-orange-50 to-amber-50',
    gradientHero: 'from-red-100/80 via-orange-50/60 to-milk',
    textColor: 'text-red-600',
    accentBg: 'bg-red-500',
    borderColor: 'border-red-200/40',
    dotColor: 'bg-red-400',
    statement: 'Я хочу жить на полной скорости',
    description: 'Ты выбираешь энергию. Это значит — внутри тебя сейчас импульс, движение, готовность действовать. Ты не боишься яркости и не ищешь компромиссов. Тебе близки контрасты, резкие мазки и цвета, от которых перехватывает дыхание.',
    artistTexts: {
      feel: 'Я чувствую огонь — иногда он внутри, иногда на холсте. Когда пишу в этом состоянии, кисть двигается быстрее, чем мысль.',
      paint: 'Я пишу энергию через контрасты: красное на чёрном, оранжевое на синем. Резкие мазки, которые не извиняются за свою силу.',
      believe: 'Я верю, что настоящая энергия — это не агрессия. Это честность. Когда ты позволяешь себе быть громким.',
    },
    workshopText: 'Здесь рождаются самые смелые решения. Мастерская — это место, где энергия обретает форму.',
    associations: ['динамика', 'страсть', 'контраст', 'экспрессия', 'огонь', 'импульс', 'риск', 'яркость'],
  },
  depth: {
    emoji: '🧠',
    title: 'Глубина',
    gradient: 'from-blue-50 via-indigo-50 to-slate-50',
    gradientHero: 'from-blue-100/80 via-indigo-50/60 to-milk',
    textColor: 'text-blue-600',
    accentBg: 'bg-blue-500',
    borderColor: 'border-blue-200/40',
    dotColor: 'bg-blue-400',
    statement: 'Я ищу глубину и отражение',
    description: 'Ты выбираешь глубину. Это значит — тебе важны смыслы, скрытые за поверхностью. Ты замечаешь то, что другие пропускают. Тебе близки символы, метафоры и тишина, в которой можно услышать главное.',
    artistTexts: {
      feel: 'Я чувствую, что за каждой картиной есть второе дно. История, которую нельзя рассказать словами — только цветом и формой.',
      paint: 'Я пишу глубину через холодные оттенки и сложные композиции. Каждый слой краски — это ещё один слой смысла.',
      believe: 'Я верю, что искусство — это зеркало. Не для лица, а для того, что внутри. И каждый видит в нём своё.',
    },
    workshopText: 'В тишине мастерской рождаются работы, которые нужно рассматривать долго. В них всегда есть то, что замечаешь не сразу.',
    associations: ['философия', 'символизм', 'тишина', 'метафоры', 'анализ', 'детали', 'созерцание', 'смысл'],
  },
  balance: {
    emoji: '🌿',
    title: 'Баланс',
    gradient: 'from-emerald-50 via-teal-50 to-green-50',
    gradientHero: 'from-emerald-100/80 via-teal-50/60 to-milk',
    textColor: 'text-emerald-600',
    accentBg: 'bg-emerald-500',
    borderColor: 'border-emerald-200/40',
    dotColor: 'bg-emerald-400',
    statement: 'Я выбираю спокойствие и равновесие',
    description: 'Ты выбираешь баланс. Это значит — тебе важна гармония. Не идеальность, а ощущение, что всё на своих местах. Тебе близки плавные линии, пастельные тона и природные формы, которые успокаивают взгляд.',
    artistTexts: {
      feel: 'Я чувствую, что равновесие — это не застывание. Это танец, в котором каждое движение естественно и на своём месте.',
      paint: 'Я пишу баланс через мягкие переходы: зелёный перетекает в голубой, линия изгибается, но не ломается.',
      believe: 'Я верю, что покой — это не скучно. Это самое сложное состояние. И самое красивое.',
    },
    workshopText: 'Мастерская — это моё место тишины. Здесь я нахожу тот самый баланс, который потом переношу на холст.',
    associations: ['гармония', 'природа', 'покой', 'плавные линии', 'мягкость', 'устойчивость', 'пастель', 'тишина'],
  },
  light: {
    emoji: '✨',
    title: 'Свет',
    gradient: 'from-amber-50 via-yellow-50 to-orange-50',
    gradientHero: 'from-amber-100/80 via-yellow-50/60 to-milk',
    textColor: 'text-amber-600',
    accentBg: 'bg-amber-500',
    borderColor: 'border-amber-200/40',
    dotColor: 'bg-amber-400',
    statement: 'Я хочу чувствовать и делиться',
    description: 'Ты выбираешь свет. Это значит — тебе близка радость без причины, лёгкость, которая не требует объяснений. Ты чувствуешь красоту в простых вещах: в луче солнца, в воздухе, в улыбке.',
    artistTexts: {
      feel: 'Я чувствую свет как физическое ощущение — тёплый, мягкий, наполняющий. Он меняет всё, к чему прикасается.',
      paint: 'Я пишу свет через жёлтый, голубой и белый. Лёгкие формы, которые будто парят. Воздух между мазками.',
      believe: 'Я верю, что свет — это не наивность. Это смелость. Смелость быть открытым и делиться тем, что наполняет.',
    },
    workshopText: 'Когда в мастерской много света — работы рождаются сами. Светлые, воздушные, наполненные теплом.',
    associations: ['лёгкость', 'радость', 'воздух', 'вдохновение', 'яркость', 'игра', 'эмоции', 'тепло'],
  },
};

export default function StatePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const data = statesData[slug || ''];

  // Загружаем картины из Sanity по состоянию
  const [paintings, setPaintings] = useState<any[]>([]);
  const [loadingPaintings, setLoadingPaintings] = useState(true);

  useEffect(() => {
    if (!slug) return;
    sanityClient
      .fetch(queries.paintingsByState(slug))
      .then((result) => setPaintings((result || []).slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoadingPaintings(false));
  }, [slug]);

  if (!data) {
    return (
      <div className="min-h-screen bg-milk flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-lg mb-4">Состояние не найдено</p>
          <Link to="/enter" className="btn-primary">Вернуться к состояниям</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-milk overflow-x-hidden">

      {/* ══════════════════════════════════════ */}
      {/* Навигация */}
      {/* ══════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-white/70 backdrop-blur-lg border-b border-lavender-soft/30">
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
          ← Все состояния
        </Link>
      </nav>

      {/* ══════════════════════════════════════ */}
      {/* БЛОК 1: Подтверждение выбора */}
      {/* ══════════════════════════════════════ */}
      <section className={`min-h-[80vh] flex flex-col items-center justify-center px-6 pt-28 pb-16 bg-gradient-to-b ${data.gradientHero} relative`}>
        {/* Декоративные элементы */}
        <div className={`absolute top-32 left-[10%] w-3 h-3 ${data.dotColor}/40 rounded-full animate-twinkle`} />
        <div className={`absolute top-48 right-[15%] w-2 h-2 ${data.dotColor}/30 rounded-full animate-twinkle`} style={{ animationDelay: '0.7s' }} />
        <div className={`absolute bottom-32 left-[20%] w-2 h-2 ${data.dotColor}/50 rounded-full animate-twinkle`} style={{ animationDelay: '1.4s' }} />

        <div className="max-w-2xl text-center opacity-0 animate-fade-in-up">
          {/* Эмодзи */}
          <div className="text-6xl md:text-7xl mb-8 animate-breathe">
            {data.emoji}
          </div>

          {/* Название состояния */}
          <h1 className={`font-serif font-light text-4xl md:text-5xl lg:text-6xl ${data.textColor} mb-6 leading-tight`}>
            {data.title}
          </h1>

          {/* Цитата-подтверждение */}
          <p className="font-serif text-xl md:text-2xl text-text-primary/80 italic mb-8">
            «{data.statement}»
          </p>

          {/* Описание */}
          <p className="text-text-secondary font-light text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            {data.description}
          </p>
        </div>


      </section>

      {/* ══════════════════════════════════════ */}
      {/* БЛОК 2: Визуальное попадание (4 картины) */}
      {/* ══════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-white/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif font-light text-2xl md:text-3xl text-text-primary mb-3">
              Работы этого состояния
            </h2>
            <p className="text-text-secondary font-light text-sm md:text-base max-w-md mx-auto">
              Каждая картина создана из похожей энергии — той, что звучит в тебе сейчас
            </p>
          </div>

          {loadingPaintings ? (
            <div className="flex justify-center py-16">
              <div className="flex items-center gap-3 text-text-muted">
                <div className="w-5 h-5 border-2 border-lavender/30 border-t-amethyst rounded-full animate-spin" />
                <span className="font-light">Загружаю работы...</span>
              </div>
            </div>
          ) : paintings.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">{data.emoji}</div>
              <p className="text-text-muted font-light text-lg">Работы этого состояния скоро появятся</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {paintings.map((painting: any, index: number) => (
                <div
                  key={painting._id || painting.id}
                  onClick={() => navigate(`/painting/${painting.slug}`)}
                  className="group cursor-pointer opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-lavender-soft/20 mb-4">
                    <img
                      src={painting.image ? urlFor(painting.image)?.width(800)?.url() : painting.imageUrl}
                      alt={painting.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-text-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Стрелка при наведении */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-0 translate-x-2">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                        <svg className="w-4 h-4 text-amethyst" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-serif text-xl text-text-primary mb-1 group-hover:text-amethyst transition-colors duration-500">
                    {painting.title}
                  </h3>
                  <p className="text-text-muted text-sm font-light italic">
                    {painting.feeling}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Ассоциации */}
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {data.associations.map((tag, i) => (
              <span
                key={tag}
                className={`px-4 py-1.5 rounded-full text-sm font-light border ${data.borderColor} text-text-secondary bg-white/60 opacity-0 animate-fade-in`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* БЛОК 3: Личность художницы */}
      {/* ══════════════════════════════════════ */}
      <section className={`py-20 md:py-28 px-6 md:px-12 bg-gradient-to-b ${data.gradient} to-milk relative`}>
        {/* Декоративный блоб */}
        <div className={`absolute top-20 right-10 w-[250px] h-[250px] ${data.dotColor}/10 rounded-full blur-3xl`} />
        <div className={`absolute bottom-20 left-10 w-[200px] h-[200px] ${data.dotColor}/10 rounded-full blur-3xl`} />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Фото художницы */}
<div className="relative opacity-0 animate-fade-in-up">
  <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-lavender-soft shadow-xl shadow-text-primary/10">
    <img
      src="/nadi.png"
      alt="Художница Надя Сок"
      className="w-full h-full object-cover"
    />
  </div>
              {/* Декоративные точки */}
              <div className={`absolute -top-3 -right-3 w-6 h-6 ${data.dotColor}/40 rounded-full animate-breathe`} />
              <div className={`absolute -bottom-3 -left-3 w-4 h-4 ${data.dotColor}/30 rounded-full animate-breathe`} style={{ animationDelay: '1s' }} />
            </div>

            {/* Тексты */}
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center gap-3 mb-8">
                <div className={`w-10 h-px ${data.accentBg}/40`} />
                <span className={`${data.textColor} text-sm uppercase tracking-wider`}>О художнице</span>
              </div>

              <div className="space-y-6">
                {/* Я чувствую */}
                <div>
                  <p className={`font-serif text-sm ${data.textColor} mb-2`}>Я чувствую…</p>
                  <p className="text-text-primary font-light leading-relaxed text-lg">
                    {data.artistTexts.feel}
                  </p>
                </div>

                {/* Я пишу */}
                <div>
                  <p className={`font-serif text-sm ${data.textColor} mb-2`}>Я пишу…</p>
                  <p className="text-text-primary font-light leading-relaxed text-lg">
                    {data.artistTexts.paint}
                  </p>
                </div>

                {/* Я верю */}
                <div>
                  <p className={`font-serif text-sm ${data.textColor} mb-2`}>Я верю…</p>
                  <p className="text-text-primary font-light leading-relaxed text-lg">
                    {data.artistTexts.believe}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-lavender-soft/40">
                <p className="text-text-secondary font-light">Надя Сок</p>
                <p className="text-text-muted text-sm mt-1">Художница, создающая из состояния</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* БЛОК 4: Социальное доказательство */}
      {/* ══════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-white/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center">
            {/* Фото мастерской */}
            <div className="md:col-span-3 opacity-0 animate-fade-in-up">
              <div className="aspect-[16/10] rounded-3xl overflow-hidden bg-lavender-soft shadow-lg shadow-text-primary/5">
                <img
                  src="/mast.png"
                  alt="Мастерская художницы"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Фолбэк если файл не найден
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&q=80';
                  }}
                />
              </div>
            </div>

            {/* Текст */}
            <div className="md:col-span-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className={`w-8 h-px ${data.accentBg}/40`} />
                <span className={`${data.textColor} text-sm uppercase tracking-wider`}>Мастерская</span>
              </div>
              
              <p className="font-serif text-xl md:text-2xl text-text-primary leading-relaxed mb-6">
                {data.workshopText}
              </p>

              <p className="text-text-muted text-sm font-light italic">
                Место, где состояние становится формой
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* БЛОК 5: Переход (не продажа!) */}
      {/* ══════════════════════════════════════ */}
      <section className={`py-24 md:py-32 px-6 md:px-12 bg-gradient-to-b from-milk ${data.gradient} relative`}>
        {/* Декоративные точки */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <div className={`w-1.5 h-1.5 ${data.dotColor}/50 rounded-full animate-dots-dance`} />
          <div className={`w-2 h-2 ${data.dotColor}/70 rounded-full animate-dots-dance`} style={{ animationDelay: '0.3s' }} />
          <div className={`w-1.5 h-1.5 ${data.dotColor}/50 rounded-full animate-dots-dance`} style={{ animationDelay: '0.6s' }} />
        </div>

        <div className="max-w-xl mx-auto text-center">
          <div className="text-4xl mb-6">{data.emoji}</div>
          
          <h2 className="font-serif font-light text-3xl md:text-4xl text-text-primary mb-6 leading-relaxed opacity-0 animate-fade-in-up">
            Это откликнулось?
          </h2>
          
          <p className="text-text-secondary font-light text-lg mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            В основной галерее — все работы. 
            Разные состояния, разные энергии. 
            Может быть, там ждёт именно твоя.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/"
              className="group btn-primary text-base px-8 py-4 relative overflow-hidden"
            >
              <span className="relative z-10">Открыть основную галерею</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </Link>
            <Link
              to="/enter"
              className="btn-secondary text-base px-8 py-4"
            >
              Другое состояние
            </Link>
          </div>
        </div>

        {/* Нижние декоративные точки */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <div className="w-10 h-px bg-gradient-to-r from-transparent to-lavender/50" />
          <div className="w-1.5 h-1.5 bg-lavender/40 rounded-full" />
          <div className="w-10 h-px bg-gradient-to-l from-transparent to-lavender/50" />
        </div>
      </section>
    </div>
  );
}
