interface ArtistPresenceProps {
  texts?: string[];
  accentColor?: string;
}

export default function ArtistPresence({ 
  texts = [
    'Я создаю из состояния.',
    'Иногда процесс ведёт меня, иногда я его.',
    'Мне нравится удивляться тому, что появляется.',
  ],
  accentColor = 'text-amethyst'
}: ArtistPresenceProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Фото */}
        <div className="relative opacity-0 animate-fade-in-up">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-lavender-soft">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80"
              alt="Художница"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Декоративный элемент */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-lavender-light/50 rounded-full blur-2xl" />
        </div>

        {/* Текст */}
        <div className="opacity-0 animate-fade-in-up delay-200">
          <span className={`text-sm tracking-widest uppercase ${accentColor} opacity-70 mb-6 block`}>
            Присутствие
          </span>
          
          <div className="space-y-6">
            {texts.map((text, index) => (
              <p 
                key={index}
                className="font-serif text-xl md:text-2xl text-text-primary leading-relaxed"
              >
                {text}
              </p>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-lilac/30">
            <p className="text-text-secondary font-light">
              Надя Сок
            </p>
            <p className="text-text-muted text-sm mt-1">
              Художница, создающая из состояния
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
