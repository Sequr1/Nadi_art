import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sanityClient, queries, urlFor } from '../lib/sanity';
import ContactModal from '../components/ContactModal';
import FlexibleContent from '../components/FlexibleContent';

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    sanityClient
      .fetch(queries.projectBySlug(slug))
      .then(setProject)
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

  if (!project) {
    return (
      <div className="min-h-screen bg-milk flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-lg mb-4">Проект не найден</p>
          <button onClick={() => navigate(-1)} className="btn-primary">Вернуться назад</button>
        </div>
      </div>
    );
  }

  const typeLabel = project.type === 'exhibition' ? 'Выставка' :
                    project.type === 'collaboration' ? 'Коллаборация' : 'Перформанс';

  const imageUrl = project.coverImage ? urlFor(project.coverImage)?.width(1200)?.url() : project.imageUrl;

  return (
    <div className="min-h-screen bg-milk overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] bg-indigo-100/15 rounded-full blur-3xl animate-float" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-milk/80 backdrop-blur-lg border-b border-lavender-soft/50">
        <Link to="/" className="font-serif text-xl md:text-2xl text-text-primary tracking-wide hover:text-amethyst transition-colors duration-500">Надя Сок</Link>
        <button onClick={() => navigate(-1)} className="text-sm text-text-secondary hover:text-amethyst transition-colors duration-500">← Назад</button>
      </nav>

      <div className="relative z-10 pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          {imageUrl && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-10 shadow-xl shadow-text-primary/10 animate-fade-in-up">
              <img src={imageUrl} alt={project.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="text-center max-w-2xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="font-serif text-4xl md:text-5xl text-text-primary mb-4 mt-2 break-words">{project.title}</h1>
            <p className="text-text-secondary font-light text-lg leading-relaxed mb-10 break-words">{project.description}</p>
          </div>

          {project.content && project.content.length > 0 && (
            <div className="mt-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <FlexibleContent content={project.content} />
            </div>
          )}

          {project.showCTA && (
            <div className="text-center mt-16 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="inline-block bg-gradient-to-br from-lavender-soft/50 to-violet-smoke/30 rounded-3xl p-8 md:p-12">
                <p className="text-text-secondary font-light mb-6 text-lg">Хочешь узнать больше или участвовать?</p>
                <button onClick={() => setShowContactModal(true)} className="btn-primary text-base px-10 py-4">
                  {project.ctaText || 'Узнать больше'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
    </div>
  );
}
