// Schema: Painting (Картина)
//
// Поле stateTag — простая строка (energy/depth/balance/light)
// НЕ ссылка на state документ — состояния захардкожены на фронте
//
// В Sanity Studio художница просто выбирает из выпадающего списка:
// 🔥 Энергия / 🧠 Глубина / 🌿 Баланс / ✨ Свет

export default {
  name: 'painting',
  title: 'Картины',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Название',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Изображение картины',
      type: 'image',
      options: { hotspot: true },
      description: 'Загрузите фото картины',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'feeling',
      title: 'Чувство',
      type: 'string',
      description: 'Какое ощущение вызывает? Например: Про движение, которое нельзя остановить',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Описание',
      type: 'text',
      rows: 3,
    },
    {
      name: 'year',
      title: 'Год создания',
      type: 'number',
      description: 'Например: 2024',
    },
    {
      name: 'format',
      title: 'Формат',
      type: 'string',
      options: {
        list: [
          { title: 'Малый', value: 'small' },
          { title: 'Средний', value: 'medium' },
          { title: 'Крупный', value: 'large' },
        ],
      },
      initialValue: 'medium',
    },
    {
      name: 'technique',
      title: 'Техника',
      type: 'string',
      description: 'Например: Масло на холсте, Акварель',
    },
    {
      name: 'dimensions',
      title: 'Размеры',
      type: 'string',
      description: 'Например: 60×80 см',
    },
    {
      name: 'available',
      title: 'Доступна для покупки',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'stateTag',
      title: 'Состояние',
      type: 'string',
      description: 'К какому состоянию относится картина',
      options: {
        list: [
          { title: '🔥 Энергия', value: 'energy' },
          { title: '🧠 Глубина', value: 'depth' },
          { title: '🌿 Баланс', value: 'balance' },
          { title: '✨ Свет', value: 'light' },
        ],
        layout: 'radio',
      },
    },
    // Гибкий контент — чередование блоков
    {
      name: 'content',
      title: 'Подробное описание (гибкий контент)',
      description: 'Добавляйте текст, фото и видео в любом порядке',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'textBlock',
          title: 'Текст',
          fields: [
            {
              name: 'text',
              title: 'Текст',
              type: 'array',
              of: [{ type: 'block' }],
            },
          ],
          preview: {
            prepare: () => ({ title: '📝 Текстовый блок' }),
          },
        },
        {
          type: 'object',
          name: 'imageBlock',
          title: 'Изображение',
          fields: [
            {
              name: 'image',
              title: 'Изображение',
              type: 'image',
              options: { hotspot: true },
            },
            {
              name: 'caption',
              title: 'Подпись',
              type: 'string',
            },
            {
              name: 'size',
              title: 'Размер',
              type: 'string',
              options: {
                list: [
                  { title: 'Во всю ширину', value: 'full' },
                  { title: 'Большое', value: 'large' },
                  { title: 'Среднее', value: 'medium' },
                  { title: 'Маленькое', value: 'small' },
                ],
              },
              initialValue: 'large',
            },
          ],
          preview: {
            select: { media: 'image', caption: 'caption' },
            prepare: ({ media, caption }: any) => ({
              title: caption || '🖼 Изображение',
              media,
            }),
          },
        },
        {
          type: 'object',
          name: 'videoBlock',
          title: 'Видео',
          fields: [
            {
              name: 'url',
              title: 'URL видео',
              type: 'url',
              description: 'YouTube или Vimeo',
            },
            {
              name: 'caption',
              title: 'Подпись',
              type: 'string',
            },
          ],
          preview: {
            select: { caption: 'caption' },
            prepare: ({ caption }: any) => ({
              title: caption || '🎬 Видео',
            }),
          },
        },
        {
          type: 'object',
          name: 'galleryBlock',
          title: 'Галерея',
          fields: [
            {
              name: 'images',
              title: 'Изображения',
              type: 'array',
              of: [
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    { name: 'caption', title: 'Подпись', type: 'string' },
                  ],
                },
              ],
            },
            {
              name: 'columns',
              title: 'Колонок',
              type: 'number',
              options: { list: [2, 3, 4] },
              initialValue: 3,
            },
          ],
          preview: {
            select: { images: 'images' },
            prepare: ({ images }: any) => ({
              title: `🖼 Галерея (${images?.length || 0} фото)`,
            }),
          },
        },
        {
          type: 'object',
          name: 'quoteBlock',
          title: 'Цитата',
          fields: [
            { name: 'text', title: 'Текст цитаты', type: 'text' },
            { name: 'author', title: 'Автор', type: 'string' },
          ],
          preview: {
            select: { text: 'text' },
            prepare: ({ text }: any) => ({
              title: `💬 "${text?.slice(0, 50)}..."`,
            }),
          },
        },
      ],
    },
    {
      name: 'order',
      title: 'Порядок отображения',
      type: 'number',
    },
  ],
  orderings: [
    {
      title: 'По порядку',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'feeling',
      media: 'image',
      stateTag: 'stateTag',
    },
    prepare: ({ title, subtitle, media, stateTag }: any) => {
      const stateEmoji: Record<string, string> = {
        energy: '🔥', depth: '🧠', balance: '🌿', light: '✨',
      };
      return {
        title: `${stateEmoji[stateTag] || ''} ${title}`,
        subtitle,
        media,
      };
    },
  },
};
