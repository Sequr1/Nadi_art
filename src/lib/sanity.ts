import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// ═══════════════════════════════════════════════════════════
// Конфигурация Sanity
//
// ⚠️ CORS: https://www.sanity.io/manage
//    → Проект wombesw7 → API → CORS Origins
//    → Добавь: https://твой-сайт.vercel.app
//    → И: http://localhost:5173
// ═══════════════════════════════════════════════════════════

export const sanityConfig = {
  projectId: "wombesw7",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
};

export const sanityClient = createClient(sanityConfig);

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  if (!source) return { url: () => '', width: () => ({ url: () => '', height: () => ({ url: () => '' }) }) };
  return builder.image(source);
}

// ═══════════════════════════════════════════════════════════
// Проекции для гибкого контента
// ═══════════════════════════════════════════════════════════

// Для Workshop / Installation / Painting (обёрнутые блоки: textBlock, imageBlock и т.д.)
const contentProjection = `
  content[]{
    ...,
    _type,
    _type == "textBlock" => {
      ...,
      text
    },
    _type == "imageBlock" => {
      ...,
      image,
      "imageUrl": image.asset->url,
      caption,
      size
    },
    _type == "galleryBlock" => {
      ...,
      "images": images[]{
        ...,
        "url": asset->url,
        caption
      },
      columns
    },
    _type == "videoBlock" => {
      ...,
      "videoUrl": url,
      caption
    },
    _type == "quoteBlock" => {
      ...,
      "quote": text,
      author
    },
    _type == "processBlock" => {
      ...,
      title,
      "steps": steps[]{
        ...,
        title,
        description,
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
  // КАРТИНЫ
  //
  // Schema: stateTag (string: "energy"|"depth"|"balance"|"light")
  // Schema: year (number) → Frontend: year (string)
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
    "stateSlug": stateTag
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
      "stateSlug": stateTag,
      ${contentProjection}
    }
  `,

  paintingsByState: (stateTag: string) => `
    *[_type == "painting" && stateTag == "${stateTag}"] | order(order asc){
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
      "stateSlug": stateTag
    }
  `,

  // ─────────────────────────────────────────────
  // МАСТЕР-КЛАССЫ
  //
  // Schema: heroImage, heroVideo, showBookingButton
  // Frontend: imageUrl, videoUrl, showCTA
  // ─────────────────────────────────────────────

  allWorkshops: `*[_type == "workshop"] | order(order asc, date desc){
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
      "showCTA": showBookingButton,
      bookingButtonText,
      bookingLink,
      ${contentProjection}
    }
  `,

  // ─────────────────────────────────────────────
  // ИНСТАЛЛЯЦИИ
  //
  // Schema: heroImage, heroVideo, showBookingButton
  // Frontend: imageUrl, showCTA
  // ─────────────────────────────────────────────

  allInstallations: `*[_type == "installation"] | order(order asc, year desc){
    _id,
    "slug": slug.current,
    title,
    description,
    heroImage,
    "imageUrl": heroImage.asset->url,
    "heroVideo": heroVideo,
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
  //
  // Schema: coverImage, projectType, dateStart/End, collaborators
  // Frontend: imageUrl, type, startDate/endDate, participants
  // ─────────────────────────────────────────────

  allProjects: `*[_type == "project"] | order(order asc, dateStart desc){
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
    showCTA,
    ctaText,
    ctaLink,
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
