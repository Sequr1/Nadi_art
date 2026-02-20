// Schema: Painting (Картина) - для Sanity Studio
// Поддержка гибкого контента: чередование фото, текст, видео

export default {
  name: 'painting',
  title: 'Картина',
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
    },
    {
      name: 'image',
      title: 'Главное изображение',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'feeling',
      title: 'Чувство (вместо цены)',
      type: 'string',
      description: 'Какое чувство вызывает эта работа?',
      validation: (Rule: any) => Rule.required(),
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
    },
    {
      name: 'states',
      title: 'Состояния (аудитории)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'state' }] }],
      description: 'К каким состояниям относится картина',
    },
    {
      name: 'description',
      title: 'Краткое описание',
      type: 'text',
    },
    // Гибкий контент — чередование блоков
    {
      name: 'content',
      title: 'Подробное описание (гибкий контент)',
      type: 'array',
      of: [
        {
          type: 'block',
          title: 'Текст',
        },
        {
          type: 'image',
          title: 'Изображение',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              title: 'Подпись',
              type: 'string',
            },
            {
              name: 'alt',
              title: 'Alt текст',
              type: 'string',
            },
          ],
        },
        {
          type: 'object',
          name: 'videoEmbed',
          title: 'Видео',
          fields: [
            {
              name: 'url',
              title: 'URL видео',
              type: 'url',
            },
            {
              name: 'caption',
              title: 'Подпись',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'year',
      title: 'Год создания',
      type: 'number',
    },
    {
      name: 'technique',
      title: 'Техника',
      type: 'string',
    },
    {
      name: 'dimensions',
      title: 'Размеры',
      type: 'string',
    },
    {
      name: 'available',
      title: 'Доступна для покупки',
      type: 'boolean',
      initialValue: true,
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
    },
  },
};
