import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sanityClient, queries } from '../lib/sanity';
import { urlFor } from '../lib/sanity';

interface Workshop {
  _id: string;
  title: string;
  slug: string;
  description: string;
  heroImage: any;
  duration?: string;
  level?: string;
  price?: string;
}

export default function WorkshopsPage() {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient.fetch(queries.allWorkshops)
      .then((data) => {
        const sorted = Array.isArray(data) 
          ? [...data].sort((a, b) => (Number(a?.order) || 99) - (Number(b?.order) || 99))
          : [];
        setWorkshops(sorted);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

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
            Мастер-классы
          </h1>
          <p className="text-base md:text-lg text-text-secondary font-light max-w-2xl mx-auto">
            Опыт создания, где важна не форма, а ваше внутреннее открытие. 
            Погрузитесь в творческий процесс под моим руководством.
          </p>
        </div>
      </section>

      {/* Список мастер-классов */}
      <section className="px-6 md:px-12 pb-20">
        <div className="max-w-6xl mx-auto">
          {workshops.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-secondary text-lg">Мастер-классы не найдены</p>
            </div>
          ) : (
            <div className="space-y-16">
              {workshops.map((workshop, index) => (
                <div 
                  key={workshop._id}
                  className="flex flex-col lg:flex-row gap-10 bg-white/50 backdrop-blur-sm rounded-[40px] p-8 md:p-12 hover:shadow-2xl hover:shadow-lavender/10 transition-all duration-700 cursor-pointer border border-white/50"
                  onClick={() => workshop.slug && navigate(`/workshop/${workshop.slug}`)}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="w-full lg:w-2/5 aspect-square lg:aspect-auto rounded-3xl overflow-hidden shadow-inner">
                    <img
                      src={urlFor(workshop.heroImage)?.width(800)?.url() || '/nadi.png'}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="w-full lg:w-3/5 flex flex-col justify-center">
                    <h3 className="font-serif text-3xl lg:text-4xl text-text-primary mb-6">{workshop.title}</h3>
                    <p className="text-text-secondary font-light leading-relaxed mb-8 text-lg line-clamp-4">
                      {workshop.description}
                    </p>
                    
                    {/* Дополнительная информация */}
                    <div className="flex flex-wrap gap-4 mb-8">
                      {workshop.duration && (
                        <div className="flex items-center gap-2 text-sm text-text-muted">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {workshop.duration}
                        </div>
                      )}
                      {workshop.level && (
                        <div className="flex items-center gap-2 text-sm text-text-muted">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          {workshop.level}
                        </div>
                      )}
                      {workshop.price && (
                        <div className="flex items-center gap-2 text-sm text-text-muted">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {workshop.price}
                        </div>
                      )}
                    </div>

                    <div className="mt-auto">
                      <span className="text-amethyst font-medium inline-flex items-center gap-2 text-lg group">
                        Узнать подробнее
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
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
