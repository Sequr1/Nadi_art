import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Thought {
  id: number;
  side: 'artist' | 'universe';
  text: string;
  time: string;
  mood?: string;
}

const thoughts: Thought[] = [
  {
    id: 1,
    side: 'artist',
    text: 'Знаешь, иногда я начинаю картину без единой мысли в голове.',
    time: '23:47',
    mood: '🌙',
  },
  {
    id: 2,
    side: 'universe',
    text: 'И что получается?',
    time: '23:48',
  },
  {
    id: 3,
    side: 'artist',
    text: 'Что-то настоящее. Как будто руки знают больше, чем я.',
    time: '23:48',
    mood: '✨',
  },
  {
    id: 4,
    side: 'artist',
    text: 'Сегодня три часа смотрела на фиолетовый. Просто сидела и смотрела. Люди бы сказали — ничего не делала. А я чувствовала каждый оттенок.',
    time: '02:15',
    mood: '💜',
  },
  {
    id: 5,
    side: 'universe',
    text: 'Может, в этом и есть работа художника — видеть то, мимо чего все проходят?',
    time: '02:16',
  },
  {
    id: 6,
    side: 'artist',
    text: 'Да. И потом пытаться это передать. Не объяснить — а дать почувствовать.',
    time: '02:17',
    mood: '🎨',
  },
  {
    id: 7,
    side: 'universe',
    text: 'Как ты понимаешь, что картина закончена?',
    time: '10:33',
  },
  {
    id: 8,
    side: 'artist',
    text: 'Она сама говорит «хватит». Это как вдох и выдох — в какой-то момент чувствуешь завершённость.',
    time: '10:35',
    mood: '🌊',
  },
  {
    id: 9,
    side: 'artist',
    text: 'Иногда мне кажется, что я не рисую. Я просто открываю дверь, и что-то проходит через меня на холст.',
    time: '18:22',
    mood: '🚪',
  },
  {
    id: 10,
    side: 'universe',
    text: 'Звучит так, будто ты — проводник.',
    time: '18:23',
  },
  {
    id: 11,
    side: 'artist',
    text: 'Может быть. Я не против такой роли.',
    time: '18:23',
    mood: '😌',
  },
  {
    id: 12,
    side: 'artist',
    text: 'Была в горах. Стояла на краю и думала: вот бы передать это ощущение — когда ты одновременно огромный и крошечный.',
    time: '16:04',
    mood: '⛰️',
  },
  {
    id: 13,
    side: 'universe',
    text: 'Получилось?',
    time: '16:05',
  },
  {
    id: 14,
    side: 'artist',
    text: 'Не знаю. Но я попробовала. И это точно было честно.',
    time: '16:06',
    mood: '💫',
  },
  {
    id: 15,
    side: 'universe',
    text: 'А чего ты боишься в творчестве?',
    time: '21:11',
  },
  {
    id: 16,
    side: 'artist',
    text: 'Перестать удивляться. Если я перестану — значит, что-то умерло внутри.',
    time: '21:13',
    mood: '🔥',
  },
  {
    id: 17,
    side: 'artist',
    text: 'Но пока — каждое утро я встаю и мне хочется что-то создавать. Значит, жива.',
    time: '21:14',
    mood: '🌅',
  },
  {
    id: 18,
    side: 'universe',
    text: 'Что бы ты сказала тому, кто хочет начать, но боится?',
    time: '23:59',
  },
  {
    id: 19,
    side: 'artist',
    text: 'Не надо быть готовым. Не надо быть идеальным. Надо просто начать. Остальное придёт.',
    time: '00:01',
    mood: '🌱',
  },
  {
    id: 20,
    side: 'artist',
    text: 'И ещё — не сравнивай себя ни с кем. Твой путь уникален, потому что ты уникален.',
    time: '00:02',
    mood: '💜',
  },
];

const BATCH_SIZE = 10;

export default function ThoughtsPage() {
  // Сколько записок показывать (считая от конца)
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const topAnchorRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Вычисляем видимые записки: берём последние N из массива
  const startIndex = Math.max(0, thoughts.length - visibleCount);
  const visibleThoughts = thoughts.slice(startIndex);
  const hasPrevious = startIndex > 0;
  const previousCount = startIndex;

  // При первом рендере скроллим вниз (к последнему сообщению)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Скроллим к самому низу чата
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
      }, 100);
    }
  }, []);

  // Подгрузить предыдущие
  const loadPrevious = () => {
    // Запоминаем текущую высоту скролла
    const scrollHeightBefore = document.documentElement.scrollHeight;
    
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, thoughts.length));

    // После добавления новых сообщений сверху — сохраняем позицию скролла
    setTimeout(() => {
      const scrollHeightAfter = document.documentElement.scrollHeight;
      const diff = scrollHeightAfter - scrollHeightBefore;
      window.scrollBy({ top: diff, behavior: 'auto' });
    }, 50);
  };

  // Группируем сообщения
  const groupedMessages: { side: 'artist' | 'universe'; messages: Thought[] }[] = [];
  visibleThoughts.forEach((thought) => {
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    if (lastGroup && lastGroup.side === thought.side) {
      lastGroup.messages.push(thought);
    } else {
      groupedMessages.push({ side: thought.side, messages: [thought] });
    }
  });

  return (
    <div className="min-h-screen bg-milk relative">
      {/* Фоновые декорации */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-mint/10 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 left-0 w-[350px] h-[350px] bg-lavender-soft/15 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-mint-soft/10 rounded-full blur-3xl animate-mint-pulse" />
        
        {/* Мерцающие точки */}
        <div className="absolute top-32 left-[10%] w-2 h-2 bg-mint/40 rounded-full animate-twinkle" />
        <div className="absolute top-[40%] right-[15%] w-2 h-2 bg-lavender/40 rounded-full animate-twinkle" style={{ animationDelay: '0.7s' }} />
        <div className="absolute bottom-[25%] left-[15%] w-3 h-3 bg-mint-deep/30 rounded-full animate-twinkle" style={{ animationDelay: '1.4s' }} />
      </div>

      {/* Навигация */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-milk/80 backdrop-blur-lg border-b border-mint/30">
        <Link
          to="/"
          className="font-serif text-xl md:text-2xl text-text-primary tracking-wide hover:text-amethyst transition-colors duration-500"
        >
          Надя Сок
        </Link>
        <Link
          to="/"
          className="text-sm text-text-secondary hover:text-mint-deep transition-colors duration-500 flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          На главную
        </Link>
      </nav>

      {/* Заголовок */}
      <div className="relative z-10 pt-28 pb-8 px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center opacity-0 animate-fade-in-up">
          {/* Иконка чата */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-mint-soft to-mint/40 mb-6">
            <svg className="w-7 h-7 text-mint-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          
          <h1 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-text-primary mb-4 leading-tight">
            Мысли <span className="text-mint-deep">художника</span>
          </h1>
          <p className="text-text-secondary font-light text-base md:text-lg max-w-md mx-auto">
            Записки из мастерской. Разговор, который никогда не заканчивается.
          </p>

          {/* Линия-разделитель */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-mint/50" />
            <div className="w-2 h-2 bg-mint/40 rounded-full animate-dots-dance" />
            <div className="w-1.5 h-1.5 bg-mint-deep/50 rounded-full animate-dots-dance" style={{ animationDelay: '0.3s' }} />
            <div className="w-2 h-2 bg-mint/40 rounded-full animate-dots-dance" style={{ animationDelay: '0.6s' }} />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-mint/50" />
          </div>
        </div>
      </div>

      {/* Кнопка «Посмотреть предыдущие» — СВЕРХУ чата */}
      <div ref={topAnchorRef} />
      {hasPrevious && (
        <div className="relative z-10 text-center py-6">
          <button
            onClick={loadPrevious}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/70 hover:bg-white border border-lavender-soft/40 hover:border-lavender/40 text-text-secondary hover:text-amethyst transition-all duration-500 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
            </svg>
            Посмотреть предыдущие ({previousCount})
          </button>
        </div>
      )}

      {/* Чат */}
      <div ref={chatContainerRef} className="relative z-10 px-4 md:px-12 pb-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {groupedMessages.map((group, groupIndex) => (
            <div
              key={`${startIndex}-${groupIndex}`}
              className={`flex flex-col gap-2 opacity-0 animate-fade-in-up ${
                group.side === 'artist' ? 'items-start' : 'items-end'
              }`}
              style={{ animationDelay: `${groupIndex * 60}ms` }}
            >
              {/* Метка отправителя — только первый раз в группе */}
              <div className={`flex items-center gap-2 px-1 ${
                group.side === 'artist' ? '' : 'flex-row-reverse'
              }`}>
                {group.side === 'artist' ? (
                  <>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-lavender to-amethyst flex items-center justify-center">
                      <span className="text-xs text-white">Н</span>
                    </div>
                    <span className="text-xs text-text-muted">Надя</span>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-mint to-mint-deep flex items-center justify-center">
                      <span className="text-xs text-white">✦</span>
                    </div>
                    <span className="text-xs text-text-muted">внутренний голос</span>
                  </>
                )}
              </div>

              {/* Сообщения в группе */}
              {group.messages.map((thought, msgIndex) => (
                <div
                  key={thought.id}
                  className={`group relative max-w-[85%] md:max-w-[75%] ${
                    group.side === 'artist' ? 'self-start' : 'self-end'
                  }`}
                >
                  <div
                    className={`relative px-5 py-3.5 transition-all duration-500 ${
                      group.side === 'artist'
                        ? `rounded-2xl rounded-tl-md bg-white/80 backdrop-blur-sm border border-lavender-soft/40 shadow-sm hover:shadow-md hover:shadow-lavender/10 ${
                            msgIndex === 0 ? 'rounded-tl-2xl' : ''
                          }`
                        : `rounded-2xl rounded-tr-md bg-gradient-to-br from-mint-light/80 to-mint-soft/60 backdrop-blur-sm border border-mint/20 shadow-sm hover:shadow-md hover:shadow-mint/10 ${
                            msgIndex === 0 ? 'rounded-tr-2xl' : ''
                          }`
                    }`}
                  >
                    {/* Текст сообщения */}
                    <p className="font-light leading-relaxed text-text-primary">
                      {thought.text}
                    </p>

                    {/* Время + эмодзи настроения */}
                    <div className={`flex items-center gap-2 mt-2 ${
                      group.side === 'artist' ? '' : 'flex-row-reverse'
                    }`}>
                      <span className="text-[10px] text-text-muted">{thought.time}</span>
                      {thought.mood && (
                        <span className="text-sm opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300">
                          {thought.mood}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Индикатор «печатает...» — внизу (после последнего сообщения) */}
          <div className="flex items-start gap-2 opacity-0 animate-fade-in-up" style={{ animationDelay: `${groupedMessages.length * 60 + 200}ms` }}>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-lavender to-amethyst flex items-center justify-center">
              <span className="text-xs text-white">Н</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-lavender-soft/40 rounded-2xl rounded-tl-md px-5 py-3.5 shadow-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-lavender/60 rounded-full animate-dots-dance" />
                <div className="w-2 h-2 bg-lavender/60 rounded-full animate-dots-dance" style={{ animationDelay: '0.15s' }} />
                <div className="w-2 h-2 bg-lavender/60 rounded-full animate-dots-dance" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Нижний блок — декоративный */}
      <div className="relative z-10 py-16 px-6 bg-gradient-to-t from-mint-light/20 to-transparent">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-block bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-5 border border-mint/20">
            <p className="text-text-muted font-light text-sm italic">
              Этот диалог продолжается.
              <br />
              Заходи снова, чтобы узнать о чём думает художник.
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-6 h-px bg-mint/40" />
              <span className="text-mint-deep text-xs">💚</span>
              <div className="w-6 h-px bg-mint/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
