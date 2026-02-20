export interface State {
  _id: string;
  slug: string;
  title: string;
  subtitle: string;
  heroText: string;
  description: string;
  heroMedia?: {
    type: 'image' | 'video';
    url: string;
  };
  color: string;
}

export interface Painting {
  id: string;
  slug: string;
  title: string;
  feeling: string;
  description?: string;
  imageUrl: string;
  year?: string;
  format: 'small' | 'medium' | 'large';
  stateSlug: string;
  content?: ContentBlock[];
}

export interface ContentBlock {
  _type: 'textBlock' | 'imageBlock' | 'videoBlock' | 'galleryBlock' | 'quoteBlock';
  text?: string;
  imageUrl?: string;
  caption?: string;
  size?: 'full' | 'large' | 'medium' | 'small';
  videoUrl?: string;
  images?: { url: string; caption?: string }[];
  columns?: number;
  quote?: string;
  author?: string;
}

export interface Workshop {
  _id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  price?: string;
  date?: string;
  imageUrl: string;
  videoUrl?: string;
  gallery?: string[];
  showCTA: boolean;
  content?: ContentBlock[];
}

export interface Installation {
  _id: string;
  slug: string;
  title: string;
  description: string;
  location?: string;
  year?: string;
  imageUrl: string;
  gallery?: string[];
  showCTA: boolean;
  content?: ContentBlock[];
}

export interface Project {
  _id: string;
  slug: string;
  title: string;
  type: 'exhibition' | 'collaboration' | 'performance';
  description: string;
  startDate?: string;
  endDate?: string;
  participants?: string[];
  imageUrl: string;
  gallery?: string[];
  showCTA: boolean;
  ctaText?: string;
  featured: boolean;
  content?: ContentBlock[];
}

export interface MainSettings {
  artistName: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks: {
    telegram?: string;
    vk?: string;
    instagram?: string;
  };
}

// Дефолтные данные для демо
export const defaultStates: State[] = [
  {
    _id: '1',
    slug: 'inspiration',
    title: 'Вдохновение',
    subtitle: 'Когда хочется создавать',
    heroText: 'Возможно, сейчас внутри что-то просится наружу. Энергия, которая ищет форму.',
    description: 'Состояние творческого потока',
    color: '#9B7BC7',
  },
  {
    _id: '2',
    slug: 'silence',
    title: 'Тишина',
    subtitle: 'Когда хочется остановиться',
    heroText: 'Иногда нужно просто замереть и послушать себя. В тишине рождается ясность.',
    description: 'Состояние покоя и созерцания',
    color: '#7B9BC7',
  },
  {
    _id: '3',
    slug: 'impulse',
    title: 'Импульс',
    subtitle: 'Когда хочется действовать',
    heroText: 'Момент, когда чувствуешь — пора. Энергия, готовая к прыжку.',
    description: 'Состояние движения и перемен',
    color: '#C77B9B',
  },
  {
    _id: '4',
    slug: 'harmony',
    title: 'Гармония',
    subtitle: 'Когда всё на своих местах',
    heroText: 'Равновесие не означает неподвижность. Это танец, в котором ты ведёшь.',
    description: 'Состояние баланса и целостности',
    color: '#7BC79B',
  },
];

export const defaultPaintings: Painting[] = [
  {
    id: '1',
    slug: 'morning-light',
    title: 'Утренний свет',
    feeling: 'Про движение, которое нельзя остановить',
    description: 'Момент, когда первые лучи касаются земли и всё начинает просыпаться.',
    imageUrl: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=800&q=80',
    year: '2024',
    format: 'large',
    stateSlug: 'inspiration',
  },
  {
    id: '2',
    slug: 'inner-ocean',
    title: 'Внутренний океан',
    feeling: 'Про глубину, которую нельзя измерить',
    description: 'То, что внутри — бесконечно.',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
    year: '2024',
    format: 'medium',
    stateSlug: 'silence',
  },
  {
    id: '3',
    slug: 'purple-wind',
    title: 'Фиолетовый ветер',
    feeling: 'Про свободу внутри',
    description: 'Когда отпускаешь — всё становится легче.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    year: '2023',
    format: 'large',
    stateSlug: 'impulse',
  },
  {
    id: '4',
    slug: 'mountain-breath',
    title: 'Дыхание гор',
    feeling: 'Про равновесие',
    description: 'Горы учат терпению.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    year: '2023',
    format: 'medium',
    stateSlug: 'harmony',
  },
  {
    id: '5',
    slug: 'fire-dance',
    title: 'Танец огня',
    feeling: 'Про энергию созидания',
    description: 'Внутренний огонь, который невозможно потушить.',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
    year: '2024',
    format: 'small',
    stateSlug: 'inspiration',
  },
  {
    id: '6',
    slug: 'silent-lake',
    title: 'Тихое озеро',
    feeling: 'Про покой внутри',
    description: 'Когда снаружи буря, внутри может быть тишина.',
    imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
    year: '2023',
    format: 'large',
    stateSlug: 'silence',
  },
  {
    id: '7',
    slug: 'sudden-turn',
    title: 'Внезапный поворот',
    feeling: 'Про момент решения',
    description: 'Иногда всё меняется за одну секунду.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    year: '2024',
    format: 'medium',
    stateSlug: 'impulse',
  },
  {
    id: '8',
    slug: 'garden-peace',
    title: 'Сад спокойствия',
    feeling: 'Про принятие',
    description: 'Всё, что нужно — уже есть.',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    year: '2023',
    format: 'small',
    stateSlug: 'harmony',
  },
];

export const defaultWorkshops: Workshop[] = [
  {
    _id: '1',
    slug: 'intuitive-painting',
    title: 'Интуитивная живопись',
    description: 'Процесс важнее формы. Мы не учимся "правильно" рисовать — мы учимся слышать себя.',
    duration: '3 часа',
    price: 'По запросу',
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
    showCTA: true,
  },
];

export const defaultInstallations: Installation[] = [
  {
    _id: '1',
    slug: 'space-of-breath',
    title: 'Пространство дыхания',
    description: 'Инсталляция, в которую можно войти и почувствовать расширение.',
    location: 'Москва',
    year: '2024',
    imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80',
    showCTA: true,
  },
];

export const defaultProjects: Project[] = [
  {
    _id: '1',
    slug: 'beyond-canvas',
    title: 'За пределами холста',
    type: 'exhibition',
    description: 'Иногда идеи выходят за рамки привычного формата.',
    startDate: '2024-06',
    imageUrl: 'https://images.unsplash.com/photo-1577720643272-265f09367456?w=800&q=80',
    showCTA: true,
    ctaText: 'Узнать больше',
    featured: true,
  },
];
