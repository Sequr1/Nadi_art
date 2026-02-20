import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { defaultWorkshops } from '../types';
import ContactModal from '../components/ContactModal';

export default function WorkshopPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);
  
  const workshop = defaultWorkshops.find(w => w.slug === slug) || defaultWorkshops[0];

  return (
    <div className="min-h-screen bg-milk">
      {/* Кнопка назад */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-300 bg-milk/80 backdrop-blur-sm px-4 py-2 rounded-full"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm">Назад</span>
      </button>

      {/* Hero изображение */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={workshop.imageUrl}
          alt={workshop.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-milk via-milk/20 to-transparent" />
      </div>

      {/* Контент */}
      <div className="relative -mt-32 px-6 md:px-12 pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Заголовок */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl shadow-lavender/10 mb-12">
            <span className="text-lavender text-sm uppercase tracking-wider">Мастер-класс</span>
            <h1 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-text-primary mt-4 mb-6">
              {workshop.title}
            </h1>
            
            {/* Детали */}
            <div className="flex flex-wrap gap-6 mb-8 text-text-secondary">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{workshop.duration}</span>
              </div>
              {workshop.price && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{workshop.price}</span>
                </div>
              )}
              {workshop.date && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{workshop.date}</span>
                </div>
              )}
            </div>

            <p className="text-text-secondary font-light leading-relaxed text-lg">
              {workshop.description}
            </p>
          </div>

          {/* Дополнительный контент */}
          <div className="space-y-8 mb-16">
            <div className="prose prose-lg max-w-none">
              <p className="text-text-secondary font-light leading-relaxed">
                Мастер-класс — это возможность попробовать что-то новое в безопасном пространстве. 
                Здесь нет правильного или неправильного. Есть только ты и процесс.
              </p>
              <p className="text-text-secondary font-light leading-relaxed">
                Мы работаем с интуицией, цветом, формой. Учимся слышать себя через кисть. 
                Каждый уходит с собственной работой и, возможно, с чем-то большим.
              </p>
            </div>

            {/* Галерея если есть */}
            {workshop.gallery && workshop.gallery.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {workshop.gallery.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA кнопка */}
          {workshop.showCTA && (
            <div className="text-center">
              <div className="inline-block bg-gradient-to-br from-lavender-soft/50 to-violet-smoke/30 rounded-3xl p-8 md:p-12">
                <p className="text-text-secondary font-light mb-6 text-lg">
                  Хочешь попробовать?
                </p>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="btn-primary text-lg px-10 py-4"
                >
                  Записаться на мастер-класс
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модалка контактов */}
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </div>
  );
}
