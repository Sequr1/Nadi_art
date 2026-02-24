import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Конфигурация Sanity
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

// GROQ запросы
export const queries = {

  // Главные настройки
  mainSettings: `*[_type == "mainSettings"][0]{
    _id,
    siteName,
    artistName,
    heroTitle,
    heroSubtitle,
    heroMedia,
    heroVideo,
    aboutText,
    contactEmail,
    socialLinks
  }`,

  // Все состояния
  allStates: `*[_type == "state"] | order(audienceType asc){
    _id,
    slug,
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

  // Состояние по slug
  stateBySlug: (slug: string) => `
    *[_type == "state" && slug.current == "${slug}"][0]{
      _id,
      slug,
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

  // Все картины
  allPaintings: `*[_type == "painting"] | order(order asc){
    _id,
    title,
    slug,
    image,
    feeling,
    format,
    states[]->{_id, title, audienceType},
    description,
    year,
    technique,
    dimensions,
    available
  }`,

  // Картины по состоянию
  paintingsByState: (stateId: string) => `
    *[_type == "painting" && references("${stateId}")] | order(order asc){
      _id,
      title,
      slug,
      image,
      feeling,
      description,
      year,
      technique,
      dimensions,
      format,
      available
    }
  `,

  // Все мастер-классы
  allWorkshops: `*[_type == "workshop"] | order(order asc, date desc){
    _id,
    title,
    slug,
    description,
    image,
    video,
    date,
    duration,
    price,
    showBookingButton,
    bookingLink
  }`,

  // Мастер-класс по slug
  workshopBySlug: (slug: string) => `
    *[_type == "workshop" && slug.current == "${slug}"][0]{
      _id,
      title,
      slug,
      description,
      image,
      video,
      date,
      duration,
      price,
      showBookingButton,
      bookingLink
    }
  `,

  // Все инсталляции
  allInstallations: `*[_type == "installation"] | order(order asc, year desc){
    _id,
    title,
    slug,
    description,
    heroImage,
    heroVideo,
    location,
    year,
    featured,
    order
  }`,

  // Инсталляция по slug
  installationBySlug: (slug: string) => `
    *[_type == "installation" && slug.current == "${slug}"][0]{
      _id,
      title,
      slug,
      description,
      heroImage,
      heroVideo,
      location,
      year,
      content,
      showBookingButton,
      bookingButtonText,
      bookingLink
    }
  `,

  // Все проекты
  allProjects: `*[_type == "project"] | order(order asc, dateStart desc){
    _id,
    title,
    slug,
    projectType,
    description,
    coverImage,
    video,
    location,
    dateStart,
    dateEnd,
    collaborators,
    showCTA,
    ctaText,
    ctaLink,
    featured
  }`,

  // Избранные проекты
  featuredProjects: `*[_type == "project" && featured == true] | order(order asc){
    _id,
    title,
    slug,
    projectType,
    description,
    coverImage,
    dateStart
  }`,

  // Проект по slug
  projectBySlug: (slug: string) => `
    *[_type == "project" && slug.current == "${slug}"][0]{
      _id,
      title,
      slug,
      projectType,
      description,
      coverImage,
      video,
      location,
      dateStart,
      dateEnd,
      collaborators,
      showCTA,
      ctaText,
      ctaLink
    }
  `,
};
