import { useState } from 'react';
import { defaultPaintings, defaultStates } from '../types';
import ContactModal from './ContactModal';

interface GalleryProps {
  stateFilter?: string;
  showFilters?: boolean;
}

export default function Gallery({ stateFilter, showFilters = true }: GalleryProps) {
  const [selectedState, setSelectedState] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedPainting, setSelectedPainting] = useState<typeof defaultPaintings[0] | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const filteredPaintings = defaultPaintings.filter((painting) => {
    if (stateFilter) {
      return painting.stateSlug === stateFilter;
    }
    return selectedState === 'all' || painting.stateSlug === selectedState;
  });

  const visiblePaintings = filteredPaintings.slice(0, visibleCount);
  const hasMore = filteredPaintings.length > visibleCount;

  // Фильтры только по состояниям
  const stateFilters = [
    { value: 'all', label: 'Все состояния' },
    ...defaultStates.map(state => ({
      value: state.slug,
      label: state.title
    }))
  ];

  return (
    <div>
      {/* Фильтры по состояниям */}
      {showFilters && !stateFilter && (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {stateFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                setSelectedState(filter.value);
                setVisibleCount(6);
              }}
              className={`px-5 py-2 rounded-full text-sm transition-all duration-500 ${
                selectedState === filter.value
                  ? 'bg-lavender text-white shadow-lg shadow-lavender/20'
                  : 'bg-white/70 text-text-secondary hover:bg-lavender-light hover:text-text-primary'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {/* Счётчик работ */}
      <div className="text-center mb-8">
        <p className="text-text-muted text-sm">
          {filteredPaintings.length} {filteredPaintings.length === 1 ? 'работа' : filteredPaintings.length < 5 ? 'работы' : 'работ'}
        </p>
      </div>

      {/* Сетка работ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {visiblePaintings.map((painting, index) => (
          <div
            key={painting.id}
            onClick={() => setSelectedPainting(painting)}
            className="group cursor-pointer opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-lavender-soft/30 mb-4">
              <img
                src={painting.imageUrl}
                alt={painting.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Мягкое затемнение */}
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Цветок при наведении */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <svg className="w-8 h-8 text-white/80 animate-flower-bloom" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C14.2 8 16 9.8 16 12C16 14.2 14.2 16 12 16C9.8 16 8 14.2 8 12C8 9.8 9.8 8 12 8ZM5.5 8C6.3 8 7 8.7 7 9.5C7 10.3 6.3 11 5.5 11C4.7 11 4 10.3 4 9.5C4 8.7 4.7 8 5.5 8ZM18.5 8C19.3 8 20 8.7 20 9.5C20 10.3 19.3 11 18.5 11C17.7 11 17 10.3 17 9.5C17 8.7 17.7 8 18.5 8ZM5.5 13C6.3 13 7 13.7 7 14.5C7 15.3 6.3 16 5.5 16C4.7 16 4 15.3 4 14.5C4 13.7 4.7 13 5.5 13ZM18.5 13C19.3 13 20 13.7 20 14.5C20 15.3 19.3 16 18.5 16C17.7 16 17 15.3 17 14.5C17 13.7 17.7 13 18.5 13ZM12 18C13.1 18 14 18.9 14 20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20C10 18.9 10.9 18 12 18Z"/>
                </svg>
              </div>
            </div>
            
            <h3 className="font-serif text-xl text-text-primary mb-1 group-hover:text-amethyst transition-colors duration-500">
              {painting.title}
            </h3>
            <p className="text-text-muted text-sm font-light italic">
              {painting.feeling}
            </p>
          </div>
        ))}
      </div>

      {/* Показать больше */}
      {hasMore && (
        <div className="text-center mt-12 md:mt-16">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="btn-secondary"
          >
            Показать ещё ({filteredPaintings.length - visibleCount})
          </button>
        </div>
      )}

      {/* Полноэкранный просмотр картины */}
      {selectedPainting && (
        <div className="fixed inset-0 z-50 bg-milk overflow-auto">
          {/* Фоновые декорации */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-10 w-2 h-2 bg-lavender/40 rounded-full animate-twinkle" />
            <div className="absolute top-40 right-20 w-3 h-3 bg-amethyst/30 rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-40 left-20 w-2 h-2 bg-lilac/50 rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-20 right-40 w-2 h-2 bg-violet-deep/30 rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }} />
          </div>

          {/* Кнопка Назад */}
          <button
            onClick={() => setSelectedPainting(null)}
            className="fixed top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-text-secondary hover:text-text-primary hover:bg-white transition-all duration-300 shadow-lg shadow-text-primary/5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm">Назад</span>
          </button>

          {/* Контент */}
          <div className="min-h-screen pt-24 pb-16 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
              {/* Изображение */}
              <div className="flex justify-center mb-12 animate-fade-in-up">
                <div className="relative">
                  <img
                    src={selectedPainting.imageUrl}
                    alt={selectedPainting.title}
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
                  {selectedPainting.title}
                </h1>
                
                <p className="text-lavender text-xl md:text-2xl italic font-light">
                  {selectedPainting.feeling}
                </p>
                
                {selectedPainting.description && (
                  <p className="text-text-secondary font-light leading-relaxed text-lg">
                    {selectedPainting.description}
                  </p>
                )}
                
                {selectedPainting.year && (
                  <p className="text-text-muted text-sm">
                    {selectedPainting.year}
                  </p>
                )}
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
      )}
    </div>
  );
}
