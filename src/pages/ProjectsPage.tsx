import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sanityClient, queries } from '../lib/sanity';
import { urlFor } from '../lib/sanity';

interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: any;
  startDate?: string;
  endDate?: string;
  status?: string;
  tags?: string[];
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient.fetch(queries.allProjects)
      .then((data) => {
        const sorted = Array.isArray(data) 
          ? [...data].sort((a, b) => (Number(a?.order) || 99) - (Number(b?.order) || 99))
          : [];
        setProjects(sorted);
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
            Проекты
          </h1>
          <p className="text-base md:text-lg text-text-secondary font-light max-w-2xl mx-auto">
            Коллаборации и творческие исследования. 
            Иногда идеи выходят за рамки холста и превращаются в нечто большее.
          </p>
        </div>
      </section>

      {/* Список проектов */}
      <section className="px-6 md:px-12 pb-20">
        <div className="max-w-5xl mx-auto">
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-secondary text-lg">Проекты не найдены</p>
            </div>
          ) : (
            <div className="space-y-12">
              {projects.map((project, index) => (
                <div 
                  key={project._id} 
                  className="group flex items-start gap-8 pb-12 border-b border-lavender-soft last:border-0 cursor-pointer hover:bg-white/30 -mx-6 px-6 py-8 rounded-3xl transition-all duration-500" 
                  onClick={() => project.slug && navigate(`/project/${project.slug}`)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Обложка проекта */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-lavender-soft shadow-lg">
                    <img 
                      src={urlFor(project.coverImage)?.width(200)?.url() || '/nadi.png'} 
                      alt="" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  
                  {/* Информация о проекте */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-serif text-2xl text-text-primary group-hover:text-amethyst transition-colors">
                        {project.title}
                      </h3>
                      <div className="text-right ml-4">
                        <span className="text-text-muted text-sm font-light block">
                          {project.startDate || 'Текущий'}
                        </span>
                        {project.status && (
                          <span className="inline-block mt-1 px-2 py-1 bg-lavender-soft text-xs text-text-primary rounded-full">
                            {project.status}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-text-secondary font-light text-base leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Теги */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="px-3 py-1 bg-mint/20 text-mint-deep text-xs rounded-full font-light"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-3 py-1 bg-lavender-soft text-lavender text-xs rounded-full font-light">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Стрелка */}
                  <div className="hidden md:flex self-center">
                    <div className="w-10 h-10 rounded-full border border-lavender-soft flex items-center justify-center group-hover:bg-amethyst group-hover:border-amethyst transition-all duration-500">
                      <svg className="w-4 h-4 text-amethyst group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                      </svg>
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
