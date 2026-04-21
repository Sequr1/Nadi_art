import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sanityClient, queries } from '../lib/sanity';
import { urlFor } from '../lib/sanity';

interface Installation {
  _id: string;
  title: string;
  slug: string;
  description: string;
  heroImage: any;
  gallery?: any[];
  year?: string;
  location?: string;
}

export default function InstallationsPage() {
  const navigate = useNavigate();
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient.fetch(queries.allInstallations)
      .then((data) => {
        const sorted = Array.isArray(data) 
          ? [...data].sort((a, b) => (Number(a?.order) || 99) - (Number(b?.order) || 99))
          : [];
        setInstallations(sorted);
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
            Инсталляции
          </h1>
          <p className="text-base md:text-lg text-text-secondary font-light max-w-2xl mx-auto">
            Пространство как продолжение идеи. 
            Исследуйте immersive-проекты, где границы между искусством и реальностью стираются.
          </p>
        </div>
      </section>

      {/* Список инсталляций */}
      <section className="px-6 md:px-12 pb-20">
        <div className="max-w-7xl mx-auto">
          {installations.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-secondary text-lg">Инсталляции не найдены</p>
            </div>
          ) : (
            <div className="space-y-20">
              {installations.map((installation, index) => (
                <div 
                  key={installation._id}
                  className="group cursor-pointer"
                  onClick={() => installation.slug && navigate(`/installation/${installation.slug}`)}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Большая карусель-картинка */}
                  <div className="relative rounded-[60px] overflow-hidden bg-black aspect-[21/9] mb-8">
                    {/* Анимированная карусель */}
                    <div className="absolute inset-0 flex">
                      <div className="w-full h-full flex animate-slow-carousel">
                        <img 
                          src={urlFor(installation.heroImage)?.width(1600)?.url() || '/nadi.png'} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                        {/* Если есть галерея, добавляем второе фото для эффекта карусели */}
                        {installation.gallery && installation.gallery.length > 0 && (
                          <img 
                            src={urlFor(installation.gallery[0])?.width(1600)?.url() || '/nadi.png'} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        )}
                        {/* Дублируем первый элемент для бесшовной карусели */}
                        <img 
                          src={urlFor(installation.heroImage)?.width(1600)?.url() || '/nadi.png'} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Оверлей с текстом */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent flex flex-col justify-center p-12 md:p-20">
                      <div className="max-w-xl">
                        <h3 className="text-white font-serif text-4xl md:text-6xl mb-6">{installation.title}</h3>
                        <p className="text-white/80 font-light text-lg mb-8 line-clamp-3">{installation.description}</p>
                        
                        {/* Метаданные */}
                        <div className="flex flex-wrap gap-4 mb-8">
                          {installation.year && (
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {installation.year}
                            </div>
                          )}
                          {installation.location && (
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {installation.location}
                            </div>
                          )}
                        </div>

                        <span className="inline-flex items-center gap-3 px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-amethyst hover:text-white transition-all duration-500">
                          Исследовать инсталляцию
                        </span>
                      </div>
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
