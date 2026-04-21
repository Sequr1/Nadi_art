import { urlFor } from '../lib/sanity';

interface FlexibleContentProps {
  content: any[];
}

// Простой рендер portable text (массив блоков Sanity)
function renderPortableText(textArray: any) {
  if (!textArray) return null;

  // Если это просто строка
  if (typeof textArray === 'string') {
    return <p className="text-text-secondary font-light leading-relaxed text-lg break-words">{textArray}</p>;
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
            return <h2 key={i} className="font-serif text-2xl md:text-3xl text-text-primary mb-4 break-words">{text}</h2>;
          case 'h3':
            return <h3 key={i} className="font-serif text-xl md:text-2xl text-text-primary mb-3 break-words">{text}</h3>;
          case 'h4':
            return <h4 key={i} className="font-serif text-lg text-text-primary mb-2 break-words">{text}</h4>;
          case 'blockquote':
            return (
              <blockquote key={i} className="border-l-2 border-lavender pl-6 italic text-text-secondary font-light text-lg my-4 break-words">
                {text}
              </blockquote>
            );
          default:
            return <p key={i} className="text-text-secondary font-light leading-relaxed text-lg mb-3 break-words">{text}</p>;
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
  if (!image) return '';
  
  try {
    const builder = urlFor(image);
    if (!builder) return '';
    return builder.width(width)?.url() || '';
  } catch (err) {
    console.error('getImageUrl error:', err);
    return '';
  }
}

export default function FlexibleContent({ content }: FlexibleContentProps) {
  if (!content || !Array.isArray(content) || content.length === 0) return null;

  return (
    <div className="space-y-10">
      {content.map((block: any, index: number) => {
        try {
          if (!block || !block._type) return null;

          switch (block._type) {
            // ── Текст ──
            case 'textBlock':
              if (!block.text) return null;
              return (
                <div key={block._key || index} className="max-w-2xl mx-auto">
                  {renderPortableText(block.text)}
                </div>
              );

            // ── Фото ──
            case 'imageBlock': {
              const imgUrl = block.imageUrl || getImageUrl(block.image, undefined);
              if (!imgUrl) return null;

              return (
                <div key={block._key || index} className="max-w-4xl mx-auto">
                  <img
                    src={imgUrl}
                    alt={block.caption || ''}
                    className="w-full rounded-2xl shadow-lg shadow-text-primary/5 bg-lavender-soft/20"
                    loading="lazy"
                  />
                  {block.caption && (
                    <p className="text-text-muted text-sm text-center mt-3 font-light italic break-words">
                      {block.caption}
                    </p>
                  )}
                </div>
              );
            }

            // ── Видео ──
            case 'videoBlock': {
              const videoUrl = block.videoUrl;
              if (!videoUrl) return null;

              return (
                <div key={block._key || index} className="max-w-4xl mx-auto">
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-lg shadow-text-primary/5 bg-black">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full"
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

            // ── Несколько фото (Галерея) ──
            case 'galleryBlock': {
              if (!block.images || !Array.isArray(block.images) || block.images.length === 0) return null;

              return (
                <div key={block._key || index} className="max-w-5xl mx-auto">
                  <div className={`grid gap-4 ${
                    block.columns === 2 ? 'grid-cols-2' :
                    block.columns === 4 ? 'grid-cols-2 md:grid-cols-4' :
                    'grid-cols-2 md:grid-cols-3'
                  }`}>
                    {block.images.map((img: any, imgIndex: number) => {
                      const imgUrl = img?.url || getImageUrl(img, undefined, 800);
                      if (!imgUrl) return null;

                      return (
                        <div key={img._key || imgIndex} className="aspect-square rounded-xl overflow-hidden">
                          <img
                            src={imgUrl}
                            alt=""
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
              if (!block.text) return null;
              return (
                <div key={block._key || index} className="max-w-2xl mx-auto text-center py-8 px-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-lg shadow-lavender/10">
                    <blockquote className="font-serif text-xl md:text-2xl text-text-primary italic break-words">
                      «{String(block.text)}»
                    </blockquote>
                    {block.author && (
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <div className="w-8 h-px bg-lavender" />
                        <span className="text-lavender text-sm break-words">{block.author}</span>
                        <div className="w-8 h-px bg-lavender" />
                      </div>
                    )}
                  </div>
                </div>
              );

            // ── Процесс ──
            case 'processBlock':
              if (!block.steps || !Array.isArray(block.steps)) return null;
              return (
                <div key={block._key || index} className="max-w-3xl mx-auto mb-16">
                  {block.title && (
                    <h2 className="font-serif text-2xl text-text-primary mb-8">{block.title}</h2>
                  )}
                  {block.steps.map((step: any, i: number) => {
                    const stepImgUrl = getImageUrl(step?.image, undefined, 1000);

                    return (
                      <div key={step?._key || i} className="mb-10">
                        {step?.title && <h3 className="font-medium text-text-primary mb-2 text-lg">{step.title}</h3>}
                        {step?.description && <p className="text-text-secondary font-light leading-relaxed mb-4">{step.description}</p>}
                        {stepImgUrl && (
                          <img src={stepImgUrl} className="rounded-xl w-full" alt="" />
                        )}
                      </div>
                    );
                  })}
                </div>
              );

            default:
              return null;
          }
        } catch (err) {
          console.error('Error rendering block:', err, block);
          return null;
        }
      })}
    </div>
  );
}
