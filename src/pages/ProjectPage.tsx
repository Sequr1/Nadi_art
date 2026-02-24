import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { defaultProjects } from '../types';
import ContactModal from '../components/ContactModal';
import FlexibleContent from '../components/FlexibleContent';

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);

  const project = defaultProjects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-milk flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-lg mb-4">Проект не найден</p>
          <button onClick={() => navigate(-1)} className="btn-primary">Вернуться назад</button>
        </div>
      </div>
    );
  }

  const typeLabel = project.type === 'exhibition' ? 'Выставка' :
                    project.type === 'collaboration' ? 'Коллаборация' : 'Перформанс';

  return (
    <div className="min-h-screen bg-milk">
      {/* Фоновые декорации */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] bg-indigo-100/15 rounded-full blur-3xl animate-float" />
      </div>

      {/* Навигация */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-milk/80 backdrop-blur-lg border-b border-lavender-soft/50">
        <Link to="/" className="font-serif text-xl md:text-2xl text-text-primary tracking-wide hover:text-amethyst transition-colors duration-500">
          Надя Сок
        </Link>
        <button onClick={() => navigate(-1)} className="text-sm text-text-secondary hover:text-amethyst transition-colors duration-500">
          ← Назад
        </button>
      </nav>

      {/* Контент */}
      <div className="relative z-10 pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Изображение */}
          <div className="aspect-video rounded-2xl overflow-hidden mb-10 shadow-xl shadow-text-primary/10 animate-fade-in-up">
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
          </div>

          {/* Информация */}
          <div className="text-center max-w-2xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="text-xs text-lavender uppercase tracking-wider">{typeLabel}</span>
            <h1 className="font-serif text-4xl md:text-5xl text-text-primary mb-4 mt-2">{project.title}</h1>
            <p className="text-text-secondary font-light text-lg leading-relaxed mb-6">{project.description}</p>
            
            <div className="flex items-center justify-center gap-6 text-text-muted text-sm mb-10">
              {project.startDate && (
                <span>📅 {project.startDate}{project.endDate && ` — ${project.endDate}`}</span>
              )}
            </div>

            {/* Участники */}
            {project.participants && project.participants.length > 0 && (
              <div className="mb-10 pt-6 border-t border-lavender-soft/50">
                <h3 className="text-sm text-text-muted uppercase tracking-wider mb-3">Участники</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {project.participants.map((participant, idx) => (
                    <span key={idx} className="px-3 py-1 bg-lavender-soft/50 rounded-full text-sm text-text-secondary">
                      {participant}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Гибкий контент — текст, фото, видео в свободном порядке */}
          {project.content && project.content.length > 0 && (
            <div className="mt-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <FlexibleContent content={project.content} />
            </div>
          )}

          {/* Галерея если есть */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              {project.gallery.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-2xl overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          )}

          {/* CTA кнопка */}
          {project.showCTA && (
            <div className="text-center mt-16 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="inline-block bg-gradient-to-br from-lavender-soft/50 to-violet-smoke/30 rounded-3xl p-8 md:p-12">
                <p className="text-text-secondary font-light mb-6 text-lg">
                  Хочешь узнать больше или участвовать?
                </p>
                <button onClick={() => setShowContactModal(true)} className="btn-primary text-base px-10 py-4">
                  {project.ctaText || 'Узнать больше'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
    </div>
  );
}
