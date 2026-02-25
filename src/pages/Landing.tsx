import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sanityClient, queries } from '../lib/sanity';

export default function Landing() {
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch(queries.allStates)
      .then((data) => setStates(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-milk flex flex-col">
      <nav className="flex justify-between items-center px-6 md:px-12 py-5 bg-milk/80 backdrop-blur-lg border-b border-lavender-soft/50">
        <Link to="/" className="font-serif text-xl md:text-2xl text-text-primary tracking-wide hover:text-amethyst transition-colors duration-500">
          Надя Сок
        </Link>
        <Link to="/" className="text-sm text-text-secondary hover:text-amethyst transition-colors duration-500">
          ← На главную
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center mb-16 opacity-0 animate-fade-in-up">
          <h1 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6 leading-tight">
            Выбери своё
            <span className="block text-amethyst mt-2">состояние</span>
          </h1>
          <p className="text-text-secondary font-light text-lg max-w-md mx-auto">
            Каждое состояние — это отдельный мир. Войди в тот, который откликается.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-text-muted">
            <div className="w-5 h-5 border-2 border-lavender/30 border-t-amethyst rounded-full animate-spin" />
            <span className="font-light">Загружаю состояния...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
            {states.map((state: any, index: number) => (
              <Link
                key={state._id}
                to={`/state/${state.slug}`}
                className="group card-soft p-8 text-center hover:bg-white cursor-pointer opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 animate-breathe"
                  style={{ backgroundColor: (state.color || '#9B7BC7') + '30' }}
                />
                <h3 className="font-serif text-2xl text-text-primary mb-2 group-hover:text-amethyst transition-colors">
                  {state.title}
                </h3>
                <p className="text-text-secondary font-light text-sm">{state.subtitle || state.description}</p>
              </Link>
            ))}
            {states.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-text-muted font-light">Состояния скоро появятся</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
