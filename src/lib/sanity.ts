import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// ═══════════════════════════════════════════════════════════
// Конфигурация Sanity
// ═══════════════════════════════════════════════════════════

export const sanityConfig = {
  projectId: "wombesw7",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
};

export const sanityClient = createClient(sanityConfig);

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

// ═══════════════════════════════════════════════════════════
// Общая проекция для гибкого контента (content[])
//
// Все schemas (painting, workshop, installation, project)
// используют одинаковые блоки: textBlock, imageBlock,
// videoBlock, galleryBlock, quoteBlock
// + installation добавляет processBlock
//
// `...` — spread, чтобы ВСЕ поля пришли
// Плюс разворачиваем вложенные image asset-ы в URL
// ═══════════════════════════════════════════════════════════

const contentProjection = `
  content[]{
    ...,
    _type == "imageBlock" => {
      ...,
      image,
      "imageUrl": image.asset->url
    },
    _type == "galleryBlock" => {
      ...,
      "images": images[]{
        ...,
        "url": asset->url
      }
    },
    _type == "videoBlock" => {
      ...,
      "videoUrl": url
    },
    _type == "processBlock" => {
      ...,
      "steps": steps[]{
        ...,
        image,
        "imageUrl": image.asset->url
      }
    }
  }
`;

// ═══════════════════════════════════════════════════════════
// GROQ запросы
// ═══════════════════════════════════════════════════════════

export const queries = {

  // ─────────────────────────────────────────────
  // НАСТРОЙКИ САЙТА
  // ─────────────────────────────────────────────
  mainSettings: `*[_type == "mainSettings"][0]{
    _id,
    artistName,
    heroTitle,
    heroSubtitle,
    contactEmail,
    contactPhone,
    socialLinks
  }`,

  // ─────────────────────────────────────────────
  // СОСТОЯНИЯ
  // Landing: slug, title, audienceType, buttonLabel
  // StatePage: всё
  // Gallery: slug, title (для фильтров)
  // ─────────────────────────────────────────────

  allStates: `*[_type == "state"] | order(order asc){
    _id,
    "slug": slug.current,
    title,
    audienceType,
    buttonLabel,
    heroText,
    stateText,
    heroMedia,
    heroVideo,
    artistPresence{
      ...,
      "photoUrl": photo.asset->url,
      photo
    },
    colorTheme
  }`,

  stateBySlug: (slug: string) => `
    *[_type == "state" && slug.current == "${slug}"][0]{
      _id,
      "slug": slug.current,
      title,
      audienceType,
      buttonLabel,
      heroText,
      stateText,
      heroMedia,
      "heroMediaUrl": heroMedia.asset->url,
      heroVideo,
      artistPresence{
        ...,
        "photoUrl": photo.asset->url,
        photo
      },
      colorTheme
    }
  `,

  // ─────────────────────────────────────────────
  // КАРТИНЫ
  // Gallery: id, slug, imageUrl, title, feeling, stateSlug, image (raw)
  // PaintingPage: всё + content[]
  // MainPage: count
  // ─────────────────────────────────────────────

  allPaintings: `*[_type == "painting"] | order(order asc){
    "id": _id,
    _id,
    "slug": slug.current,
    title,
    feeling,
    description,
    image,
    "imageUrl": image.asset->url,
    "year": select(defined(year) => string(year), null),
    format,
    technique,
    dimensions,
    available,
    "stateSlug": state->slug.current
  }`,

  paintingBySlug: (slug: string) => `
    *[_type == "painting" && slug.current == "${slug}"][0]{
      "id": _id,
      _id,
      "slug": slug.current,
      title,
      feeling,
      description,
      image,
      "imageUrl": image.asset->url,
      "year": select(defined(year) => string(year), null),
      format,
      technique,
      dimensions,
      available,
      "stateSlug": state->slug.current,
      ${contentProjection}
    }
  `,

  paintingsByState: (stateSlug: string) => `
    *[_type == "painting" && state->slug.current == "${stateSlug}"] | order(order asc){
      "id": _id,
      _id,
      "slug": slug.current,
      title,
      feeling,
      description,
      image,
      "imageUrl": image.asset->url,
      "year": select(defined(year) => string(year), null),
      format,
      "stateSlug": state->slug.current
    }
  `,

  // ─────────────────────────────────────────────
  // МАСТЕР-КЛАССЫ
  // MainPage: slug, title, description, imageUrl, duration, price
  // WorkshopPage: всё + heroImage (raw) + content[]
  // ─────────────────────────────────────────────

  allWorkshops: `*[_type == "workshop"] | order(order asc, date desc){
    _id,
    "slug": slug.current,
    title,
    description,
    "imageUrl": heroImage.asset->url,
    duration,
    price,
    "date": select(defined(date) => string(date), null),
    location,
    "showCTA": showBookingButton
  }`,

  workshopBySlug: (slug: string) => `
    *[_type == "workshop" && slug.current == "${slug}"][0]{
      _id,
      "slug": slug.current,
      title,
      description,
      heroImage,
      "imageUrl": heroImage.asset->url,
      "videoUrl": heroVideo,
      duration,
      price,
      "date": select(defined(date) => string(date), null),
      location,
      "gallery": gallery[]{
        ...,
        "url": asset->url
      },
      "showCTA": showBookingButton,
      bookingButtonText,
      bookingLink,
      ${contentProjection}
    }
  `,

  // ─────────────────────────────────────────────
  // ИНСТАЛЛЯЦИИ
  // MainPage: slug, title, description, imageUrl, location, year
  // InstallationPage: всё + heroImage (raw) + content[] (рендерит inline)
  // ─────────────────────────────────────────────

  allInstallations: `*[_type == "installation"] | order(order asc, year desc){
    _id,
    "slug": slug.current,
    title,
    description,
    "imageUrl": heroImage.asset->url,
    location,
    "year": select(defined(year) => string(year), null),
    "showCTA": showBookingButton,
    featured
  }`,

  installationBySlug: (slug: string) => `
    *[_type == "installation" && slug.current == "${slug}"][0]{
      _id,
      "slug": slug.current,
      title,
      description,
      heroImage,
      "imageUrl": heroImage.asset->url,
      heroVideo,
      location,
      year,
      materials,
      dimensions,
      showBookingButton,
      bookingButtonText,
      bookingLink,
      ${contentProjection}
    }
  `,

  // ─────────────────────────────────────────────
  // ПРОЕКТЫ
  // MainPage: slug, title, type, description, imageUrl
  // ProjectPage: всё + coverImage (raw) + content[] + gallery[]
  // ─────────────────────────────────────────────

  allProjects: `*[_type == "project"] | order(order asc, dateStart desc){
    _id,
    "slug": slug.current,
    title,
    "type": projectType,
    description,
    "imageUrl": coverImage.asset->url,
    "startDate": dateStart,
    showCTA,
    ctaText,
    featured
  }`,

  featuredProjects: `*[_type == "project" && featured == true] | order(order asc){
    _id,
    "slug": slug.current,
    title,
    "type": projectType,
    description,
    "imageUrl": coverImage.asset->url,
    "startDate": dateStart
  }`,

  projectBySlug: (slug: string) => `
    *[_type == "project" && slug.current == "${slug}"][0]{
      _id,
      "slug": slug.current,
      title,
      "type": projectType,
      description,
      coverImage,
      "imageUrl": coverImage.asset->url,
      video,
      location,
      "startDate": dateStart,
      "endDate": dateEnd,
      "participants": collaborators,
      "gallery": gallery[]{
        ...,
        "url": asset->url
      },
      showCTA,
      ctaText,
      ctaLink,
      ${contentProjection}
    }
  `,

  // ─────────────────────────────────────────────
  // МЫСЛИ ХУДОЖНИКА
  // ThoughtsPage: id, side, text, time, mood
  // ─────────────────────────────────────────────

  allThoughts: `*[_type == "thought"] | order(order asc){
    "id": _id,
    "side": select(
      sender == "nadia" => "artist",
      sender == "inner" => "universe",
      "artist"
    ),
    text,
    time,
    "mood": emoji
  }`,
};
