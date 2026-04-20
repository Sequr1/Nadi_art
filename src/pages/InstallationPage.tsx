import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sanityClient, queries, urlFor } from '../lib/sanity';
import ContactModal from '../components/ContactModal';
import FlexibleContent from '../components/FlexibleContent';

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

  const imageUrl = installation.heroImage ? urlFor(installation.heroImage).width(1200).url() : installation.imageUrl;

  return (
    <div className="min-h-screen bg-milk overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-milk/80 backdrop-blur-lg border-b border-lavender-soft/50">
        <Link to="/" className="font-serif text-xl md:text-2xl text-text-primary tracking-wide hover:text-amethyst transition-colors duration-500">Надя Сок</Link>
        <button onClick={() => navigate(-1)} className="text-sm text-text-secondary hover:text-amethyst transition-colors duration-500">← Назад</button>
      </nav>

      {/* Hero */}
      {installation.heroVideo ? (
        <div className="pt-20 aspect-video w-full">
          <iframe src={installation.heroVideo} className="w-full h-full" allowFullScreen />
        </div>
      ) : imageUrl ? (
        <div className="pt-20 h-[60vh] overflow-hidden">
          <img src={imageUrl} alt={installation.title} className="w-full h-full object-cover" />
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
        {installation.content && installation.content.length > 0 && (
          <div className="mt-12">
            <FlexibleContent content={installation.content} />
          </div>
        )}

        {installation.showCTA && (
          <div className="text-center mt-16">
            <button onClick={() => setShowContactModal(true)} className="btn-primary text-base px-10 py-4">
              {installation.ctaText || 'Узнать больше'}
            </button>
          </div>
        )}
      </div>

      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
    </div>
  );
}
