import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

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
// Проекция для гибкого контента (content[])
// Разворачивает все вложенные image и video asset-ы
// ═══════════════════════════════════════════════════════════

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
      "videoUrl": select(
        defined(videoFile) => videoFile.asset->url,
        url
      ),
      "videoFileUrl": videoFile.asset->url,
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

  // ─── КАРТИНЫ ───

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
      "stateSlug": stateTag
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

  // ─── МАСТЕР-КЛАССЫ ───

  allWorkshops: `*[_type == "workshop"] | order(order asc, date desc){
    _id,
    "slug": slug.current,
    title,
    description,
    heroImage,
    "imageUrl": heroImage.asset->url,
    "videoUrl": select(
      defined(videoFile) => videoFile.asset->url,
      heroVideo
    ),
    "videoFileUrl": videoFile.asset->url,
    duration,
    price,
    "date": select(defined(date) => string(date), null),
    location
  }`,

  workshopBySlug: (slug: string) => `
    *[_type == "workshop" && slug.current == "${slug}"][0]{
      _id,
      "slug": slug.current,
      title,
      description,
      heroImage,
      "imageUrl": heroImage.asset->url,
      "videoUrl": select(
        defined(videoFile) => videoFile.asset->url,
        heroVideo
      ),
      "videoFileUrl": videoFile.asset->url,
      duration,
      price,
      "date": select(defined(date) => string(date), null),
      location,
      ${contentProjection}
    }
  `,

  // ─── ИНСТАЛЛЯЦИИ ───

  allInstallations: `*[_type == "installation"] | order(order asc, year desc){
    _id,
    "slug": slug.current,
    title,
    description,
    heroImage,
    "imageUrl": heroImage.asset->url,
    "videoUrl": select(
      defined(videoFile) => videoFile.asset->url,
      heroVideo
    ),
    "videoFileUrl": videoFile.asset->url,
    location,
    "year": select(defined(year) => string(year), null)
  }`,

  installationBySlug: (slug: string) => `
    *[_type == "installation" && slug.current == "${slug}"][0]{
      _id,
      "slug": slug.current,
      title,
      description,
      heroImage,
      "imageUrl": heroImage.asset->url,
      "videoUrl": select(
        defined(videoFile) => videoFile.asset->url,
        heroVideo
      ),
      "videoFileUrl": videoFile.asset->url,
      heroVideo,
      location,
      year,
      materials,
      dimensions,
      ${contentProjection}
    }
  `,

  // ─── ПРОЕКТЫ ───

  allProjects: `*[_type == "project"] | order(order asc, dateStart desc){
    _id,
    "slug": slug.current,
    title,
    "type": projectType,
    description,
    coverImage,
    "imageUrl": coverImage.asset->url,
    "videoUrl": select(
      defined(videoFile) => videoFile.asset->url,
      video
    ),
    "videoFileUrl": videoFile.asset->url,
    location,
    "startDate": dateStart,
    "endDate": dateEnd,
    "participants": collaborators,
    ctaText
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
      "videoUrl": select(
        defined(videoFile) => videoFile.asset->url,
        video
      ),
      "videoFileUrl": videoFile.asset->url,
      location,
      "startDate": dateStart,
      "endDate": dateEnd,
      "participants": collaborators,
      "gallery": gallery[]{
        ...,
        "url": asset->url
      },
      ctaText,
      ${contentProjection}
    }
  `,

  // ─── МЫСЛИ ХУДОЖНИКА ───

  allThoughts: `*[_type == "thought"] | order(order asc, _createdAt asc){
    "id": _id,
    "side": sender,
    text,
    time,
    mood
  }`,
};
