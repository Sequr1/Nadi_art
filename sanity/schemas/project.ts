// Schema: Project (Проект) - для Sanity Studio
// Поддержка гибкого контента: чередование фото, текст, видео

export default {
  name: 'project',
  title: 'Проект',
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
      name: 'projectType',
      title: 'Тип проекта',
      type: 'string',
      options: {
        list: [
          { title: 'Выставка', value: 'exhibition' },
          { title: 'Коллаборация', value: 'collaboration' },
          { title: 'Перформанс', value: 'performance' },
          { title: 'Другое', value: 'other' },
        ],
      },
    },
    {
      name: 'description',
      title: 'Краткое описание',
      type: 'text',
    },
    {
      name: 'coverImage',
      title: 'Обложка',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'video',
      title: 'Видео (URL)',
      type: 'url',
    },
    // Гибкий контент — чередование блоков
    {
      name: 'content',
      title: 'Полное описание (гибкий контент)',
      description: 'Добавляйте текст, фото и видео в любом порядке',
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
            {
              name: 'size',
              title: 'Размер',
              type: 'string',
              options: {
                list: [
                  { title: 'Полная ширина', value: 'full' },
                  { title: 'Средний', value: 'medium' },
                  { title: 'Маленький', value: 'small' },
                ],
              },
              initialValue: 'full',
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
              title: 'URL видео (YouTube, Vimeo)',
              type: 'url',
            },
            {
              name: 'caption',
              title: 'Подпись',
              type: 'string',
            },
          ],
        },
        {
          type: 'object',
          name: 'imageGallery',
          title: 'Галерея изображений',
          fields: [
            {
              name: 'images',
              title: 'Изображения',
              type: 'array',
              of: [{ type: 'image', options: { hotspot: true } }],
            },
            {
              name: 'columns',
              title: 'Колонок',
              type: 'number',
              initialValue: 3,
            },
          ],
        },
      ],
    },
    {
      name: 'gallery',
      title: 'Галерея (простая)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'location',
      title: 'Место',
      type: 'string',
    },
    {
      name: 'dateStart',
      title: 'Дата начала',
      type: 'date',
    },
    {
      name: 'dateEnd',
      title: 'Дата окончания',
      type: 'date',
    },
    {
      name: 'collaborators',
      title: 'Участники/Партнёры',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'showCTA',
      title: 'Показать кнопку действия',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'ctaText',
      title: 'Текст кнопки',
      type: 'string',
    },
    {
      name: 'ctaLink',
      title: 'Ссылка кнопки',
      type: 'url',
    },
    {
      name: 'featured',
      title: 'Показать на главной',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'order',
      title: 'Порядок отображения',
      type: 'number',
    },
  ],
  orderings: [
    {
      title: 'По дате',
      name: 'dateDesc',
      by: [{ field: 'dateStart', direction: 'desc' }],
    },
    {
      title: 'По порядку',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'projectType',
      media: 'coverImage',
    },
  },
};
