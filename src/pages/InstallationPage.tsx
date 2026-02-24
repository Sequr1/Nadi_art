import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sanityClient, queries, urlFor } from "../lib/sanity";
import ContactModal from "../components/ContactModal";

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
  if (!installation) return <div className="p-10">Not found</div>;

  return (
    <div className="min-h-screen bg-milk">

      {/* Кнопка назад */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 bg-white/80 px-4 py-2 rounded-full"
      >
        Назад
      </button>

      {/* HERO */}
      {installation.heroVideo ? (
        <div className="aspect-video w-full">
          <iframe
            src={installation.heroVideo}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      ) : installation.heroImage ? (
        <div className="h-[60vh] overflow-hidden">
          <img
            src={urlFor(installation.heroImage).width(2000).url()}
            alt={installation.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : null}

      <div className="max-w-4xl mx-auto px-6 py-16">

        <h1 className="text-4xl mb-6">{installation.title}</h1>

        <div className="flex gap-6 text-gray-500 mb-8">
          {installation.location && <span>{installation.location}</span>}
          {installation.year && <span>{installation.year}</span>}
        </div>

        {installation.description && (
          <p className="text-lg leading-relaxed mb-12">
            {installation.description}
          </p>
        )}

        {/* FLEXIBLE CONTENT */}
        {installation.content?.map((block: any, index: number) => {
          switch (block._type) {

            case "textBlock":
              return (
                <div key={index} className="prose mb-10">
                  {block.text?.map((p: any, i: number) => (
                    <p key={i}>{p.children?.map((c: any) => c.text)}</p>
                  ))}
                </div>
              );

            case "imageBlock":
              return (
                <div key={index} className="mb-10">
                  <img
                    src={urlFor(block.image).width(1200).url()}
                    className="rounded-2xl"
                  />
                  {block.caption && (
                    <p className="text-sm text-gray-500 mt-2">
                      {block.caption}
                    </p>
                  )}
                </div>
              );

            case "galleryBlock":
              return (
                <div key={index} className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                  {block.images?.map((img: any, i: number) => (
                    <img
                      key={i}
                      src={urlFor(img).width(800).url()}
                      className="rounded-xl object-cover"
                    />
                  ))}
                </div>
              );

            case "videoBlock":
              return (
                <div key={index} className="aspect-video mb-10">
                  <iframe
                    src={block.url}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              );

            case "quoteBlock":
              return (
                <blockquote key={index} className="text-2xl italic my-16 text-center">
                  “{block.text}”
                  {block.author && (
                    <div className="text-sm mt-4">— {block.author}</div>
                  )}
                </blockquote>
              );

            case "processBlock":
              return (
                <div key={index} className="mb-16">
                  <h2 className="text-2xl mb-6">{block.title}</h2>
                  {block.steps?.map((step: any, i: number) => (
                    <div key={i} className="mb-8">
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="mb-4">{step.description}</p>
                      {step.image && (
                        <img
                          src={urlFor(step.image).width(1000).url()}
                          className="rounded-xl"
                        />
                      )}
                    </div>
                  ))}
                </div>
              );

            default:
              return null;
          }
        })}

        {/* Кнопка */}
        {installation.showBookingButton && (
          <div className="text-center mt-16">
            <button
              onClick={() => setShowContactModal(true)}
              className="btn-primary"
            >
              {installation.bookingButtonText || "Посетить"}
            </button>
          </div>
        )}
      </div>

      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </div>
  );
}
