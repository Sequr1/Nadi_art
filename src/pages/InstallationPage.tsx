import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sanityClient, queries, urlFor } from '../lib/sanity';
import ContactModal from '../components/ContactModal';

export default function InstallationPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [installation, setInstallation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (!slug) return;
    sanityClient
      .fetch(queries.installationBySlug(slug))
      .then(setInstallation)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-milk flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-muted">
          <div className="w-5 h-5 border-2 border-lavender/30 border-t-amethyst rounded-full animate-spin" />
          <span className="font-light">Загружаю...</span>
        </div>
      </div>
    );
  }

  if (!installation) {
    return (
      <div className="min-h-screen bg-milk flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-lg mb-4">Инсталляция не найдена</p>
          <button onClick={() => navigate(-1)} className="btn-primary">Вернуться назад</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-milk">
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-milk/80 backdrop-blur-lg border-b border-lavender-soft/50">
        <Link to="/" className="font-serif text-xl md:text-2xl text-text-primary tracking-wide hover:text-amethyst transition-colors duration-500">Надя Сок</Link>
        <button onClick={() => navigate(-1)} className="text-sm text-text-secondary hover:text-amethyst transition-colors duration-500">← Назад</button>
      </nav>

      {/* Hero */}
      {installation.heroVideo ? (
        <div className="pt-20 aspect-video w-full">
          <iframe src={installation.heroVideo} className="w-full h-full" allowFullScreen />
        </div>
      ) : installation.heroImage ? (
        <div className="pt-20 h-[60vh] overflow-hidden">
          <img src={urlFor(installation.heroImage).width(2000).url()} alt={installation.title} className="w-full h-full object-cover" />
        </div>
      ) : null}

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl md:text-5xl text-text-primary mb-6">{installation.title}</h1>

        <div className="flex gap-6 text-text-muted mb-8">
          {installation.location && <span>📍 {installation.location}</span>}
          {installation.year && <span>📅 {installation.year}</span>}
          {installation.materials && <span>🔧 {installation.materials}</span>}
        </div>

        {installation.description && (
          <p className="text-text-secondary font-light text-lg leading-relaxed mb-12">{installation.description}</p>
        )}

        {/* Flexible content */}
        {installation.content?.map((block: any, index: number) => {
          switch (block._type) {
            case 'textBlock':
              return (
                <div key={index} className="prose mb-10 max-w-none">
                  {block.text?.map((p: any, i: number) => (
                    <p key={i} className="text-text-secondary font-light leading-relaxed">{p.children?.map((c: any) => c.text).join('')}</p>
                  ))}
                </div>
              );
            case 'imageBlock':
              return (
                <div key={index} className="mb-10">
                  {block.image && <img src={urlFor(block.image).width(1200).url()} className="rounded-2xl w-full" alt={block.caption || ''} />}
                  {block.caption && <p className="text-sm text-text-muted mt-2 text-center italic">{block.caption}</p>}
                </div>
              );
            case 'galleryBlock':
              return (
                <div key={index} className={`grid grid-cols-2 md:grid-cols-${block.columns || 3} gap-4 mb-10`}>
                  {block.images?.map((img: any, i: number) => (
                    <img key={i} src={urlFor(img).width(800).url()} className="rounded-xl object-cover aspect-square" alt="" />
                  ))}
                </div>
              );
            case 'videoBlock':
              return (
                <div key={index} className="aspect-video mb-10 rounded-2xl overflow-hidden">
                  <iframe src={block.url} className="w-full h-full" allowFullScreen />
                </div>
              );
            case 'quoteBlock':
              return (
                <blockquote key={index} className="text-center my-16">
                  <div className="inline-block bg-white/80 rounded-3xl px-8 py-6 shadow-lg shadow-lavender/10">
                    <p className="font-serif text-xl md:text-2xl text-text-primary italic">«{block.text}»</p>
                    {block.author && <p className="text-lavender text-sm mt-4">— {block.author}</p>}
                  </div>
                </blockquote>
              );
            case 'processBlock':
              return (
                <div key={index} className="mb-16">
                  <h2 className="font-serif text-2xl text-text-primary mb-6">{block.title}</h2>
                  {block.steps?.map((step: any, i: number) => (
                    <div key={i} className="mb-8">
                      <h3 className="font-medium text-text-primary mb-2">{step.title}</h3>
                      <p className="text-text-secondary font-light mb-4">{step.description}</p>
                      {step.image && <img src={urlFor(step.image).width(1000).url()} className="rounded-xl" alt="" />}
                    </div>
                  ))}
                </div>
              );
            default:
              return null;
          }
        })}

        {installation.showBookingButton && (
          <div className="text-center mt-16">
            <button onClick={() => setShowContactModal(true)} className="btn-primary text-base px-10 py-4">
              {installation.bookingButtonText || 'Посетить'}
            </button>
          </div>
        )}
      </div>

      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
    </div>
  );
}
