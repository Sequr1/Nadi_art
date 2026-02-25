import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sanityClient, queries } from '../lib/sanity';
import Gallery from '../components/Gallery';
import ArtistPresence from '../components/ArtistPresence';
import CTASection from '../components/CTASection';

export default function StatePage() {
  const { slug } = useParams<{ slug: string }>();
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    sanityClient
      .fetch(queries.stateBySlug(slug))
      .then(setState)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-milk flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-muted">
          <div className="w-5 h-5 border-2 border-lavender/30 border-t-amethyst rounded-full animate-spin" />
          <span className="font-light">Загружаю...</span>
        </div>
      </div>
    );
  }

  if (!state) {
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
    <div className="min-h-screen bg-milk">
      {/* Навигация */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-milk/80 backdrop-blur-lg border-b border-lavender-soft/50">
        <Link to="/" className="font-serif text-xl md:text-2xl text-text-primary tracking-wide hover:text-amethyst transition-colors duration-500">
          Надя Сок
        </Link>
        <Link to="/enter" className="text-sm text-text-secondary hover:text-amethyst transition-colors duration-500">
          ← Состояния
        </Link>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 md:px-12 text-center relative">
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 animate-breathe"
          style={{ backgroundColor: state.color || '#9B7BC7' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto opacity-0 animate-fade-in-up">
          <h1 className="font-serif font-light text-5xl md:text-6xl lg:text-7xl text-text-primary mb-6">
            {state.title}
          </h1>
          <p className="text-text-secondary font-light text-xl md:text-2xl leading-relaxed">
            {state.heroText}
          </p>
        </div>
      </section>

      {/* Галерея */}
      <section className="px-6 md:px-12 pb-20 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-4">Работы</h2>
            <p className="text-text-secondary font-light max-w-lg mx-auto">
              Каждая картина — это остановленное ощущение. Замершее мгновение внутреннего мира.
            </p>
          </div>
          <Gallery stateFilter={slug} showFilters={false} />
        </div>
      </section>

      {/* Присутствие художника */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-transparent via-lavender-soft/30 to-transparent">
        <ArtistPresence />
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-12">
        <CTASection />
      </section>
    </div>
  );
}
