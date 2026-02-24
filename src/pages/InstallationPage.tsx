import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sanityClient, queries, urlFor } from '../lib/sanity';
import ContactModal from '../components/ContactModal';

export default function InstallationPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [installation, setInstallation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (!slug) return;

    sanityClient
      .fetch(queries.installationBySlug(slug))
      .then((data) => {
        setInstallation(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!installation) return <div className="p-10">Installation not found</div>;

  return (
    <div className="min-h-screen bg-milk">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 bg-milk/80 backdrop-blur-sm px-4 py-2 rounded-full"
      >
        Назад
      </button>

      {/* Hero */}
      {installation.heroImage && (
        <div className="relative h-[60vh] overflow-hidden">
          <img
            src={urlFor(installation.heroImage).width(2000).url()}
            alt={installation.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl mb-6">{installation.title}</h1>

        <div className="flex gap-6 text-gray-500 mb-8">
          {installation.location && <span>{installation.location}</span>}
          {installation.year && <span>{installation.year}</span>}
        </div>

        <p className="text-lg leading-relaxed mb-12">
          {installation.description}
        </p>

        {/* Галерея */}
        {installation.gallery && installation.gallery.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            {installation.gallery.map((img: any, idx: number) => (
              <img
                key={idx}
                src={urlFor(img).width(800).url()}
                className="rounded-xl object-cover"
              />
            ))}
          </div>
        )}

        {installation.showBookingButton && (
          <button
            onClick={() => setShowContactModal(true)}
            className="btn-primary"
          >
            Записаться
          </button>
        )}
      </div>

      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </div>
  );
}
