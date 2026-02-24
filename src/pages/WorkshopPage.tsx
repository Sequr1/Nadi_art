import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { defaultWorkshops } from '../types';
import ContactModal from '../components/ContactModal';
import FlexibleContent from '../components/FlexibleContent';

export default function WorkshopPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);

  const workshop = defaultWorkshops.find((w) => w.slug === slug);

  if (!workshop) {
    return (
      <div className="min-h-screen bg-milk flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-lg mb-4">Мастер-класс не найден</p>
          <button onClick={() => navigate(-1)} className="btn-primary">Вернуться назад</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-milk">
      {/* Фоновые декорации */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-amber-100/20 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] bg-orange-100/15 rounded-full blur-3xl animate-float" />
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
            <img src={workshop.imageUrl} alt={workshop.title} className="w-full h-full object-cover" />
          </div>

          {/* Информация */}
          <div className="text-center max-w-2xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="font-serif text-4xl md:text-5xl text-text-primary mb-4">{workshop.title}</h1>
            <p className="text-text-secondary font-light text-lg leading-relaxed mb-6">{workshop.description}</p>
            
            <div className="flex items-center justify-center gap-6 text-text-muted text-sm mb-10">
              <span>⏱ {workshop.duration}</span>
              {workshop.price && <span>💰 {workshop.price}</span>}
              {workshop.date && <span>📅 {workshop.date}</span>}
            </div>
          </div>

          {/* Гибкий контент — текст, фото, видео в свободном порядке */}
          {workshop.content && workshop.content.length > 0 && (
            <div className="mt-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <FlexibleContent content={workshop.content} />
            </div>
          )}

          {/* Галерея если есть */}
          {workshop.gallery && workshop.gallery.length > 0 && (
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              {workshop.gallery.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-2xl overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          )}

          {/* CTA кнопка */}
          {workshop.showCTA && (
            <div className="text-center mt-16 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="inline-block bg-gradient-to-br from-lavender-soft/50 to-violet-smoke/30 rounded-3xl p-8 md:p-12">
                <p className="text-text-secondary font-light mb-6 text-lg">
                  Хочешь попробовать?
                </p>
                <button onClick={() => setShowContactModal(true)} className="btn-primary text-base px-10 py-4">
                  Записаться на мастер-класс
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
