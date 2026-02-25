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
// GROQ запросы
//
// МАППИНГ ПОЛЕЙ (Schema → Frontend):
//
//   slug (type: slug)        → "slug": slug.current        → string
//   image (type: image)      → image (raw для urlFor)
//                              + "imageUrl": image.asset->url (для списков)
//   heroImage                → heroImage (raw для urlFor)
//                              + "imageUrl": heroImage.asset->url
//   coverImage               → coverImage (raw для urlFor)
//                              + "imageUrl": coverImage.asset->url
//   projectType              → "type": projectType
//   dateStart / dateEnd      → "startDate" / "endDate"
//   collaborators            → "participants"
//   showBookingButton        → "showCTA"
//   sender (nadia/inner)     → "side" (artist/universe)
//   emoji                    → "mood"
//   states[] (references)    → "stateSlug": states[0]->slug.current
//   year (number)            → string(year) для отображения
//
// КОНТЕНТ:
//   content возвращается RAW — urlFor() работает с image references
//
// КТО КАКИЕ ЗАПРОСЫ ИСПОЛЬЗУЕТ:
//   MainPage       → allWorkshops, allInstallations, allProjects, count(paintings)
//   Gallery        → allPaintings, allStates
//   PaintingPage   → paintingBySlug
//   WorkshopPage   → workshopBySlug
//   InstallationPage → installationBySlug
//   ProjectPage    → projectBySlug
//   Landing        → allStates
//   StatePage      → stateBySlug
//   ThoughtsPage   → allThoughts
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
  // Используют: Landing (список), StatePage (детали), Gallery (фильтры)
  // ─────────────────────────────────────────────

  // Landing: state.slug, state.title, state.audienceType, state.buttonLabel
  // Gallery: state.slug, state.title (для фильтров)
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
    artistPresence,
    colorTheme
  }`,

  // StatePage: state.title, heroText, stateText, audienceType, heroMedia, heroVideo, artistPresence, colorTheme
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
      heroVideo,
      artistPresence,
      colorTheme
    }
  `,

  // ─────────────────────────────────────────────
  // КАРТИНЫ
  // Используют: Gallery (список), PaintingPage (детали), MainPage (count)
  //
  // Gallery использует:
  //   painting.image ? urlFor(painting.image).width(800).url() : painting.imageUrl
  //   → нужны ОБА: raw image + resolved imageUrl
  //
  // Schema: states[] (массив ссылок на state)
  //   → "stateSlug": states[0]->slug.current (берём первое состояние)
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
    "stateSlug": states[0]->slug.current
  }`,

  // PaintingPage использует:
  //   painting.image ? urlFor(painting.image).width(1200).url() : painting.imageUrl
  //   painting.title, feeling, description, technique, dimensions, year
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
      "stateSlug": states[0]->slug.current,
      content
    }
  `,

  // StatePage: Gallery с фильтром по состоянию
  paintingsByState: (stateSlug: string) => `
    *[_type == "painting" && "${stateSlug}" in states[]->slug.current] | order(order asc){
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
      "stateSlug": states[0]->slug.current
    }
  `,

  // ─────────────────────────────────────────────
  // МАСТЕР-КЛАССЫ
  // Используют: MainPage (список карточек), WorkshopPage (детали)
  //
  // MainPage: workshop.imageUrl, title, description, duration, price, slug
  //   → нужен resolved imageUrl
  //
  // WorkshopPage:
  //   workshop.heroImage ? urlFor(workshop.heroImage).width(1200).url() : workshop.imageUrl
  //   → нужны ОБА: raw heroImage + resolved imageUrl
  //   + content для FlexibleContent
  //   + showCTA || showBookingButton
  // ─────────────────────────────────────────────

  // Для MainPage — только resolved imageUrl
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

  // Для WorkshopPage — raw heroImage + imageUrl + content
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
      content,
      "showCTA": showBookingButton,
      showBookingButton,
      bookingButtonText,
      bookingLink
    }
  `,

  // ─────────────────────────────────────────────
  // ИНСТАЛЛЯЦИИ
  // Используют: MainPage (список), InstallationPage (детали)
  //
  // MainPage: installation.imageUrl, title, description, location, year, slug
  //   → нужен resolved imageUrl
  //
  // InstallationPage:
  //   urlFor(installation.heroImage).width(2000).url()
  //   → нужен raw heroImage (без fallback)
  //   + content для inline рендеринга (textBlock, imageBlock, galleryBlock, videoBlock, quoteBlock, processBlock)
  //   + showBookingButton, bookingButtonText
  // ─────────────────────────────────────────────

  // Для MainPage — resolved imageUrl
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

  // Для InstallationPage — raw heroImage + raw content
  installationBySlug: (slug: string) => `
    *[_type == "installation" && slug.current == "${slug}"][0]{
      _id,
      "slug": slug.current,
      title,
      description,
      heroImage,
      heroVideo,
      location,
      year,
      materials,
      dimensions,
      content,
      showBookingButton,
      bookingButtonText,
      bookingLink
    }
  `,

  // ─────────────────────────────────────────────
  // ПРОЕКТЫ
  // Используют: MainPage (список), ProjectPage (детали)
  //
  // MainPage: project.imageUrl, title, type, description, slug
  //   → нужен resolved imageUrl + "type": projectType
  //
  // ProjectPage:
  //   project.coverImage ? urlFor(project.coverImage).width(1200).url() : project.imageUrl
  //   → нужны ОБА: raw coverImage + resolved imageUrl
  //   + content для FlexibleContent
  //   + gallery[] (resolved URLs)
  //   + "participants": collaborators
  // ─────────────────────────────────────────────

  // Для MainPage — resolved imageUrl
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

  // Для MainPage — только избранные
  featuredProjects: `*[_type == "project" && featured == true] | order(order asc){
    _id,
    "slug": slug.current,
    title,
    "type": projectType,
    description,
    "imageUrl": coverImage.asset->url,
    "startDate": dateStart
  }`,

  // Для ProjectPage — raw coverImage + imageUrl + content + gallery
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
      "gallery": gallery[].asset->url,
      showCTA,
      ctaText,
      ctaLink,
      content
    }
  `,

  // ─────────────────────────────────────────────
  // МЫСЛИ ХУДОЖНИКА
  // Используют: ThoughtsPage
  //
  // ThoughtsPage: thought.id, side ('artist'|'universe'), text, time, mood
  //
  // Schema: sender ('nadia'|'inner') → маппим в 'artist'|'universe'
  // Schema: emoji → маппим в 'mood'
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
