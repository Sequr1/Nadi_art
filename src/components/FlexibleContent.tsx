import { urlFor } from '../lib/sanity';

interface FlexibleContentProps {
  content: any[];
}

// Простой рендер portable text (массив блоков Sanity)
function renderPortableText(textArray: any) {
  if (!textArray) return null;

  // Если это просто строка
  if (typeof textArray === 'string') {
    return <p className="text-text-secondary font-light leading-relaxed text-lg">{textArray}</p>;
  }

  // Если это массив блоков portable text
  if (Array.isArray(textArray)) {
    return textArray.map((block: any, i: number) => {
      if (block._type === 'block' && block.children) {
        const text = block.children.map((c: any) => c.text).join('');
        if (!text.trim()) return null;

        // Определяем стиль
        switch (block.style) {
          case 'h2':
            return <h2 key={i} className="font-serif text-2xl md:text-3xl text-text-primary mb-4">{text}</h2>;
          case 'h3':
            return <h3 key={i} className="font-serif text-xl md:text-2xl text-text-primary mb-3">{text}</h3>;
          case 'h4':
            return <h4 key={i} className="font-serif text-lg text-text-primary mb-2">{text}</h4>;
          case 'blockquote':
            return (
              <blockquote key={i} className="border-l-2 border-lavender pl-6 italic text-text-secondary font-light text-lg my-4">
                {text}
              </blockquote>
            );
          default:
            return <p key={i} className="text-text-secondary font-light leading-relaxed text-lg mb-3">{text}</p>;
        }
      }
      return null;
    });
  }

  return null;
}

// Получить URL изображения (resolved или через urlFor)
function getImageUrl(image: any, resolvedUrl?: string, width = 1200): string {
  if (resolvedUrl) return resolvedUrl;
  if (image) {
    try {
      return urlFor(image).width(width).url();
    } catch {
      return '';
    }
  }
  return '';
}

export default function FlexibleContent({ content }: FlexibleContentProps) {
  if (!content || content.length === 0) return null;

  return (
    <div className="space-y-10">
      {content.map((block: any, index: number) => {
        switch (block._type) {

          // ── Текстовый блок ──
          case 'textBlock':
            return (
              <div key={block._key || index} className="max-w-2xl mx-auto">
                {renderPortableText(block.text)}
              </div>
            );

          // ── Изображение ──
          case 'imageBlock': {
            const imgUrl = getImageUrl(block.image, block.imageUrl);
            if (!imgUrl) return null;

            return (
              <div
                key={block._key || index}
                className={`mx-auto ${
                  block.size === 'full' ? 'max-w-full' :
                  block.size === 'large' ? 'max-w-4xl' :
                  block.size === 'medium' ? 'max-w-2xl' :
                  'max-w-md'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={block.caption || ''}
                  className="w-full rounded-2xl shadow-lg shadow-text-primary/5"
                />
                {block.caption && (
                  <p className="text-text-muted text-sm text-center mt-3 font-light italic">
                    {block.caption}
                  </p>
                )}
              </div>
            );
          }

          // ── Видео ──
          case 'videoBlock': {
            const videoUrl = block.videoUrl || block.url;
            if (!videoUrl) return null;

            return (
              <div key={block._key || index} className="max-w-4xl mx-auto">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg shadow-text-primary/5">
                  <iframe
                    src={videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={block.caption || 'Видео'}
                  />
                </div>
                {block.caption && (
                  <p className="text-text-muted text-sm text-center mt-3 font-light italic">
                    {block.caption}
                  </p>
                )}
              </div>
            );
          }

          // ── Галерея ──
          case 'galleryBlock': {
            if (!block.images || block.images.length === 0) return null;

            return (
              <div key={block._key || index} className="max-w-5xl mx-auto">
                <div className={`grid gap-4 ${
                  block.columns === 2 ? 'grid-cols-2' :
                  block.columns === 4 ? 'grid-cols-2 md:grid-cols-4' :
                  'grid-cols-2 md:grid-cols-3'
                }`}>
                  {block.images.map((img: any, imgIndex: number) => {
                    // img.url (resolved) или urlFor(img) (raw image ref)
                    const imgUrl = img.url || getImageUrl(img, undefined, 800);
                    if (!imgUrl) return null;

                    return (
                      <div key={img._key || imgIndex} className="aspect-square rounded-xl overflow-hidden">
                        <img
                          src={imgUrl}
                          alt={img.caption || ''}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          // ── Цитата ──
          case 'quoteBlock':
            return (
              <div key={block._key || index} className="max-w-2xl mx-auto text-center py-8">
                <div className="inline-block bg-white/80 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-lg shadow-lavender/10">
                  <blockquote className="font-serif text-xl md:text-2xl text-text-primary italic">
                    «{block.quote || block.text}»
                  </blockquote>
                  {block.author && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <div className="w-8 h-px bg-lavender" />
                      <span className="text-lavender text-sm">{block.author}</span>
                      <div className="w-8 h-px bg-lavender" />
                    </div>
                  )}
                </div>
              </div>
            );

          // ── Процесс создания (только инсталляции) ──
          case 'processBlock':
            return (
              <div key={block._key || index} className="max-w-3xl mx-auto mb-16">
                <h2 className="font-serif text-2xl text-text-primary mb-8">
                  {block.title || 'Процесс создания'}
                </h2>
                {block.steps?.map((step: any, i: number) => {
                  const stepImgUrl = getImageUrl(step.image, step.imageUrl, 1000);

                  return (
                    <div key={step._key || i} className="mb-10">
                      <h3 className="font-medium text-text-primary mb-2 text-lg">{step.title}</h3>
                      <p className="text-text-secondary font-light leading-relaxed mb-4">{step.description}</p>
                      {stepImgUrl && (
                        <img src={stepImgUrl} className="rounded-xl w-full" alt={step.title || ''} />
                      )}
                    </div>
                  );
                })}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
