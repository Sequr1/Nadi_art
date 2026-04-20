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
  if (!source) return null;
  
  // Если это уже строка (URL), возвращаем объект-заглушку, который вернет этот URL
  if (typeof source === 'string' && (source.startsWith('http') || source.startsWith('/'))) {
    return {
      url: () => source,
      width: () => ({ url: () => source, height: () => ({ url: () => source }) }),
      fit: () => ({ url: () => source })
    } as any;
  }

  try {
    return builder.image(source);
  } catch (err) {
    console.error('urlFor error:', err);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════
// Проекция для гибкого контента (content[])
// Разворачивает все вложенные image и video asset-ы
// ═══════════════════════════════════════════════════════════

const contentProjection = `
  content[]{
    ...,
    _type,
    _type == "imageBlock" => {
      ...,
      "imageUrl": image.asset->url,
      caption
    },
    _type == "videoBlock" => {
      ...,
      "videoUrl": videoFile.asset->url,
      caption
    },
    _type == "galleryBlock" => {
      ...,
      "images": images[]{
        ...,
        "url": asset->url
      }
    },
    _type == "processBlock" => {
      ...,
      "steps": steps[]{
        ...,
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

  allWorkshops: `*[_type == "workshop"] | order(order asc, title asc){
    _id,
    "slug": slug.current,
    title,
    description,
    heroImage,
    "imageUrl": heroImage.asset->url,
    "videoUrl": videoFile.asset->url,
    duration,
    price,
    date,
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
      "videoUrl": videoFile.asset->url,
      duration,
      price,
      date,
      location,
      ${contentProjection}
    }
  `,

  // ─── ИНСТАЛЛЯЦИИ ───

  allInstallations: `*[_type == "installation"] | order(order asc, title asc){
    _id,
    "slug": slug.current,
    title,
    description,
    heroImage,
    "imageUrl": heroImage.asset->url,
    "videoUrl": videoFile.asset->url,
    location,
    year
  }`,

  installationBySlug: (slug: string) => `
    *[_type == "installation" && slug.current == "${slug}"][0]{
      _id,
      "slug": slug.current,
      title,
      description,
      heroImage,
      "imageUrl": heroImage.asset->url,
      "videoUrl": videoFile.asset->url,
      location,
      year,
      materials,
      dimensions,
      ${contentProjection}
    }
  `,

  // ─── ПРОЕКТЫ ───

  allProjects: `*[_type == "project"] | order(order asc, title asc){
    _id,
    "slug": slug.current,
    title,
    "type": projectType,
    description,
    coverImage,
    "imageUrl": coverImage.asset->url,
    "videoUrl": videoFile.asset->url,
    location,
    "startDate": dateStart,
    "endDate": dateEnd,
    "participants": collaborators
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
      "videoUrl": videoFile.asset->url,
      location,
      "startDate": dateStart,
      "endDate": dateEnd,
      "participants": collaborators,
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
