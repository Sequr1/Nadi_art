import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { defaultInstallations } from '../types';
import ContactModal from '../components/ContactModal';

export default function InstallationPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);
  
  const installation = defaultInstallations.find(i => i.slug === slug) || defaultInstallations[0];

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
      <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
        <img
          src={installation.imageUrl}
          alt={installation.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-milk via-milk/30 to-transparent" />
      </div>

      {/* Контент */}
      <div className="relative -mt-32 px-6 md:px-12 pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Заголовок */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl shadow-lavender/10 mb-12">
            <span className="text-lavender text-sm uppercase tracking-wider">Инсталляция</span>
            <h1 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-text-primary mt-4 mb-6">
              {installation.title}
            </h1>
            
            {/* Детали */}
            <div className="flex flex-wrap gap-6 mb-8 text-text-secondary">
              {installation.location && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{installation.location}</span>
                </div>
              )}
              {installation.year && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{installation.year}</span>
                </div>
              )}
            </div>

            <p className="text-text-secondary font-light leading-relaxed text-lg">
              {installation.description}
            </p>
          </div>

          {/* Дополнительный контент */}
          <div className="space-y-8 mb-16">
            <div className="prose prose-lg max-w-none">
              <p className="text-text-secondary font-light leading-relaxed">
                Инсталляция — это пространство, в которое можно войти. 
                Не просто смотреть на искусство, а оказаться внутри него.
              </p>
              <p className="text-text-secondary font-light leading-relaxed">
                Каждая деталь здесь продумана: свет, звук, форма. 
                Всё работает вместе, чтобы создать определённое состояние.
              </p>
            </div>

            {/* Видео если есть */}
            <div className="aspect-video rounded-2xl overflow-hidden bg-lavender-soft">
              <video
                controls
                className="w-full h-full object-cover"
                poster={installation.imageUrl}
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Галерея если есть */}
            {installation.gallery && installation.gallery.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {installation.gallery.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA кнопка */}
          {installation.showCTA && (
            <div className="text-center">
              <div className="inline-block bg-gradient-to-br from-lavender-soft/50 to-violet-smoke/30 rounded-3xl p-8 md:p-12">
                <p className="text-text-secondary font-light mb-6 text-lg">
                  Хочешь посетить или узнать больше?
                </p>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="btn-primary text-lg px-10 py-4"
                >
                  Записаться на посещение
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
