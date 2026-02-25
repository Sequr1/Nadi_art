import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sanityClient, queries } from '../lib/sanity';

interface Thought {
  id: string;
  side: 'artist' | 'universe';
  text: string;
  time: string;
  mood?: string;
}

const BATCH_SIZE = 10;

export default function ThoughtsPage() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    sanityClient
      .fetch(queries.allThoughts)
      .then((data: Thought[]) => {
        setThoughts(data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // При первой загрузке данных скроллим вниз
  useEffect(() => {
    if (!loading && thoughts.length > 0 && isFirstRender.current) {
      isFirstRender.current = false;
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
      }, 200);
    }
  }, [loading, thoughts]);

  const startIndex = Math.max(0, thoughts.length - visibleCount);
  const visibleThoughts = thoughts.slice(startIndex);
  const hasPrevious = startIndex > 0;
  const previousCount = startIndex;

  const loadPrevious = () => {
    const scrollHeightBefore = document.documentElement.scrollHeight;
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, thoughts.length));
    setTimeout(() => {
      const scrollHeightAfter = document.documentElement.scrollHeight;
      const diff = scrollHeightAfter - scrollHeightBefore;
      window.scrollBy({ top: diff, behavior: 'auto' });
    }, 50);
  };

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
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-mint/10 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 left-0 w-[350px] h-[350px] bg-lavender-soft/15 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-mint-soft/10 rounded-full blur-3xl animate-mint-pulse" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-milk/80 backdrop-blur-lg border-b border-mint/30">
        <Link to="/" className="font-serif text-xl md:text-2xl text-text-primary tracking-wide hover:text-amethyst transition-colors duration-500">Надя Сок</Link>
        <Link to="/" className="text-sm text-text-secondary hover:text-mint-deep transition-colors duration-500 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          На главную
        </Link>
      </nav>

      {/* Заголовок */}
      <div className="relative z-10 pt-28 pb-8 px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center opacity-0 animate-fade-in-up">
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
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="flex items-center gap-3 text-text-muted">
            <div className="w-5 h-5 border-2 border-mint/30 border-t-mint-deep rounded-full animate-spin" />
            <span className="font-light">Загружаю мысли...</span>
          </div>
        </div>
      ) : thoughts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-muted font-light text-lg">Мысли скоро появятся...</p>
        </div>
      ) : (
        <>
          {hasPrevious && (
            <div className="relative z-10 text-center py-6">
              <button onClick={loadPrevious} className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/70 hover:bg-white border border-lavender-soft/40 hover:border-lavender/40 text-text-secondary hover:text-amethyst transition-all duration-500 shadow-sm hover:shadow-md">
                <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
                </svg>
                Посмотреть предыдущие ({previousCount})
              </button>
            </div>
          )}

          <div ref={chatContainerRef} className="relative z-10 px-4 md:px-12 pb-8">
            <div className="max-w-2xl mx-auto space-y-6">
              {groupedMessages.map((group, groupIndex) => (
                <div key={`${startIndex}-${groupIndex}`} className={`flex flex-col gap-2 opacity-0 animate-fade-in-up ${group.side === 'artist' ? 'items-start' : 'items-end'}`} style={{ animationDelay: `${groupIndex * 60}ms` }}>
                  <div className={`flex items-center gap-2 px-1 ${group.side === 'artist' ? '' : 'flex-row-reverse'}`}>
                    {group.side === 'artist' ? (
                      <>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-lavender to-amethyst flex items-center justify-center"><span className="text-xs text-white">Н</span></div>
                        <span className="text-xs text-text-muted">Надя</span>
                      </>
                    ) : (
                      <>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-mint to-mint-deep flex items-center justify-center"><span className="text-xs text-white">✦</span></div>
                        <span className="text-xs text-text-muted">внутренний голос</span>
                      </>
                    )}
                  </div>
                  {group.messages.map((thought, msgIndex) => (
                    <div key={thought.id} className={`group relative max-w-[85%] md:max-w-[75%] ${group.side === 'artist' ? 'self-start' : 'self-end'}`}>
                      <div className={`relative px-5 py-3.5 transition-all duration-500 ${
                        group.side === 'artist'
                          ? `rounded-2xl ${msgIndex === 0 ? 'rounded-tl-2xl' : 'rounded-tl-md'} bg-white/80 backdrop-blur-sm border border-lavender-soft/40 shadow-sm hover:shadow-md hover:shadow-lavender/10`
                          : `rounded-2xl ${msgIndex === 0 ? 'rounded-tr-2xl' : 'rounded-tr-md'} bg-gradient-to-br from-mint-light/80 to-mint-soft/60 backdrop-blur-sm border border-mint/20 shadow-sm hover:shadow-md hover:shadow-mint/10`
                      }`}>
                        <p className="font-light leading-relaxed text-text-primary">{thought.text}</p>
                        <div className={`flex items-center gap-2 mt-2 ${group.side === 'artist' ? '' : 'flex-row-reverse'}`}>
                          <span className="text-[10px] text-text-muted">{thought.time}</span>
                          {thought.mood && <span className="text-sm opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300">{thought.mood}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Печатает... */}
              <div className="flex items-start gap-2 opacity-0 animate-fade-in-up" style={{ animationDelay: `${groupedMessages.length * 60 + 200}ms` }}>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-lavender to-amethyst flex items-center justify-center"><span className="text-xs text-white">Н</span></div>
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
        </>
      )}

      <div className="relative z-10 py-16 px-6 bg-gradient-to-t from-mint-light/20 to-transparent">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-block bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-5 border border-mint/20">
            <p className="text-text-muted font-light text-sm italic">
              Этот диалог продолжается каждый день.<br />Заходи снова — возможно, появятся новые мысли.
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-6 h-px bg-mint/40" /><span className="text-mint-deep text-xs">💚</span><div className="w-6 h-px bg-mint/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
