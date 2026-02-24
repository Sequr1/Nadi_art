import type { ContentBlock } from '../types';

interface FlexibleContentProps {
  content: ContentBlock[];
}

export default function FlexibleContent({ content }: FlexibleContentProps) {
  if (!content || content.length === 0) return null;

  return (
    <div className="space-y-10">
      {content.map((block, index) => {
        switch (block._type) {
          case 'textBlock':
            return (
              <div key={index} className="max-w-2xl mx-auto">
                <p className="text-text-secondary font-light leading-relaxed text-lg">
                  {block.text}
                </p>
              </div>
            );

          case 'imageBlock':
            return (
              <div
                key={index}
                className={`mx-auto ${
                  block.size === 'full' ? 'max-w-full' :
                  block.size === 'large' ? 'max-w-4xl' :
                  block.size === 'medium' ? 'max-w-2xl' :
                  'max-w-md'
                }`}
              >
                {block.imageUrl && (
                  <img
                    src={block.imageUrl}
                    alt={block.caption || ''}
                    className="w-full rounded-2xl shadow-lg shadow-text-primary/5"
                  />
                )}
                {block.caption && (
                  <p className="text-text-muted text-sm text-center mt-3 font-light italic">
                    {block.caption}
                  </p>
                )}
              </div>
            );

          case 'videoBlock':
            return (
              <div key={index} className="max-w-4xl mx-auto">
                {block.videoUrl && (
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-lg shadow-text-primary/5">
                    <iframe
                      src={block.videoUrl}
                      className="w-full h-full"
                      allowFullScreen
                      title={block.caption || 'Видео'}
                    />
                  </div>
                )}
                {block.caption && (
                  <p className="text-text-muted text-sm text-center mt-3 font-light italic">
                    {block.caption}
                  </p>
                )}
              </div>
            );

          case 'galleryBlock':
            return (
              <div key={index} className="max-w-5xl mx-auto">
                <div className={`grid gap-4 ${
                  block.columns === 2 ? 'grid-cols-2' :
                  block.columns === 4 ? 'grid-cols-2 md:grid-cols-4' :
                  'grid-cols-2 md:grid-cols-3'
                }`}>
                  {block.images?.map((img, imgIndex) => (
                    <div key={imgIndex} className="aspect-square rounded-xl overflow-hidden">
                      <img
                        src={img.url}
                        alt={img.caption || ''}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );

          case 'quoteBlock':
            return (
              <div key={index} className="max-w-2xl mx-auto text-center py-8">
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

          default:
            return null;
        }
      })}
    </div>
  );
}
