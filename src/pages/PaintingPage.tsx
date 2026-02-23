import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { defaultPaintings } from '../types';
import ContactModal from '../components/ContactModal';

export default function PaintingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);

  const painting = defaultPaintings.find((p) => p.slug === slug);

  if (!painting) {
    return (
      <div className="min-h-screen bg-milk flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-lg mb-4">Картина не найдена</p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-milk overflow-auto">
      {/* Фоновые декорации */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-lavender-soft/20 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] bg-violet-smoke/15 rounded-full blur-3xl animate-float" />
        <div className="absolute top-20 left-10 w-2 h-2 bg-lavender/40 rounded-full animate-twinkle" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-amethyst/30 rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-lilac/50 rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-40 w-2 h-2 bg-violet-deep/30 rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Кнопка Назад — фиксированная, всегда видна */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-text-secondary hover:text-text-primary hover:bg-white transition-all duration-300 shadow-lg shadow-text-primary/5"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm">Назад</span>
      </button>

      {/* Контент */}
      <div className="relative z-10 min-h-screen pt-24 pb-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Изображение */}
          <div className="flex justify-center mb-12 animate-fade-in-up">
            <div className="relative">
              <img
                src={painting.imageUrl}
                alt={painting.title}
                className="max-h-[60vh] md:max-h-[70vh] w-auto object-contain rounded-2xl shadow-2xl shadow-text-primary/10"
              />
              {/* Мерцающие точки вокруг картины */}
              <div className="absolute -top-4 -left-4 w-3 h-3 bg-lavender/60 rounded-full animate-float" />
              <div className="absolute -bottom-4 -right-4 w-4 h-4 bg-amethyst/40 rounded-full animate-float" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          {/* Информация о картине */}
          <div className="text-center max-w-2xl mx-auto space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-text-primary">
              {painting.title}
            </h1>
            
            {painting.feeling && (
              <p className="text-lavender text-xl md:text-2xl italic font-light">
                {painting.feeling}
              </p>
            )}
            
            {painting.description && (
              <p className="text-text-secondary font-light leading-relaxed text-lg">
                {painting.description}
              </p>
            )}
            
            <div className="flex items-center justify-center gap-4 text-text-muted text-sm">
              {painting.technique && <span>{painting.technique}</span>}
              {painting.technique && painting.year && <span>·</span>}
              {painting.year && <span>{painting.year}</span>}
            </div>
          </div>

          {/* CTA блок */}
          <div 
            className="mt-16 md:mt-24 text-center animate-fade-in-up" 
            style={{ animationDelay: '0.4s' }}
          >
            <div className="relative inline-block">
              {/* Декоративная рамка */}
              <div className="absolute -inset-8 border border-lavender/20 rounded-3xl" />
              <div className="absolute -inset-4 border border-lavender/30 rounded-2xl" />
              
              <div className="relative bg-gradient-to-br from-lavender-soft/50 to-lavender-light/50 rounded-xl p-10 md:p-14">
                <p className="text-text-secondary font-light mb-6 text-lg">
                  Хотите узнать больше об этой работе?
                </p>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-lavender to-amethyst text-white rounded-full font-medium transition-all duration-500 hover:shadow-xl hover:shadow-lavender/30 hover:-translate-y-1"
                >
                  <span>Обсудить картину с художником</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  
                  {/* Сердечки при наведении */}
                  <div className="absolute -top-2 left-1/4 opacity-0 group-hover:opacity-100">
                    <span className="text-lg animate-hearts-rise" style={{ animationDelay: '0s' }}>💜</span>
                  </div>
                  <div className="absolute -top-2 left-1/2 opacity-0 group-hover:opacity-100">
                    <span className="text-sm animate-hearts-rise" style={{ animationDelay: '0.2s' }}>💜</span>
                  </div>
                  <div className="absolute -top-2 right-1/4 opacity-0 group-hover:opacity-100">
                    <span className="text-lg animate-hearts-rise" style={{ animationDelay: '0.4s' }}>💜</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модалка контактов */}
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </div>
  );
}
