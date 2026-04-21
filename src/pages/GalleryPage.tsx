import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sanityClient, queries } from '../lib/sanity';
import { urlFor } from '../lib/sanity';

interface Painting {
  _id: string;
  title: string;
  slug: string;
  image: any;
  imageUrl: string;
  state?: {
    title: string;
    slug: string;
  };
}

interface State {
  _id: string;
  title: string;
  slug: string;
}

export default function GalleryPage() {
  const navigate = useNavigate();
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      sanityClient.fetch(`*[_type == "painting"] | order(order asc){
        _id,
        title,
        "slug": slug.current,
        image,
        "imageUrl": image.asset->url,
        state->{
          _id,
          title,
          "slug": slug.current
        }
      }`),
      sanityClient.fetch(`*[_type == "state"] | order(order asc){
        _id,
        title,
        "slug": slug.current
      }`)
    ])
      .then(([p, s]) => {
        setPaintings(p || []);
        setStates(s || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const filteredPaintings = selectedState === 'all' 
    ? paintings 
    : paintings.filter(p => p.state?.slug === selectedState);

  if (loading) {
    return (
      <div className="min-h-screen bg-milk flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amethyst"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-milk">
      {/* Навигация */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-12 py-4 bg-milk/80 backdrop-blur-lg border-b border-lavender-soft/50">
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
        </div>
      </nav>

      {/* Hero секция */}
      <section className="pt-28 pb-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6 leading-tight">
            Галерея
            <span className="block text-amethyst">картин</span>
          </h1>
          <p className="text-base md:text-lg text-text-secondary font-light max-w-2xl mx-auto">
            Каждая картина — это застывший момент внутреннего переживания. 
            Исследуйте разные состояния через цвет и форму.
          </p>
        </div>
      </section>

      {/* Фильтры по состояниям */}
      <section className="px-6 md:px-12 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedState('all')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-500 ${
                selectedState === 'all'
                  ? 'bg-amethyst text-white shadow-lg shadow-amethyst/20'
                  : 'bg-white/60 text-text-primary hover:bg-white/80 hover:shadow-md'
              }`}
            >
              Все картины ({paintings.length})
            </button>
            {states.map((state) => (
              <button
                key={state._id}
                onClick={() => setSelectedState(state.slug)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-500 ${
                  selectedState === state.slug
                    ? 'bg-amethyst text-white shadow-lg shadow-amethyst/20'
                    : 'bg-white/60 text-text-primary hover:bg-white/80 hover:shadow-md'
                }`}
              >
                {state.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Сетка картин */}
      <section className="px-6 md:px-12 pb-20">
        <div className="max-w-7xl mx-auto">
          {filteredPaintings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-secondary text-lg">
                {selectedState === 'all' ? 'Картины не найдены' : 'В этом состоянии пока нет картин'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPaintings.map((painting, index) => (
                <div 
                  key={painting._id} 
                  className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-lavender-soft cursor-pointer"
                  onClick={() => navigate(`/painting/${painting.slug}`)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img 
                    src={urlFor(painting.image)?.width(600)?.url() || '/nadi.png'} 
                    alt={painting.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <h3 className="text-white font-serif text-xl mb-2">{painting.title}</h3>
                    {painting.state && (
                      <span className="text-white/70 text-sm">{painting.state.title}</span>
                    )}
                    <span className="text-white/80 text-sm mt-2">Смотреть работу →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Навигация назад */}
      <section className="px-6 md:px-12 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-text-primary hover:text-amethyst transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Вернуться на главную
          </Link>
        </div>
      </section>
    </div>
  );
}
