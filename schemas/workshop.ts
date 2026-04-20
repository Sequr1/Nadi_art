// Схема: Мастер-класс
export default {
  name: 'workshop',
  title: 'Мастер-классы',
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
      title: 'Ссылка (генерируется автоматически)',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Порядок в списке',
      type: 'number',
    },
    {
      name: 'heroImage',
      title: 'Обложка (главное фото)',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'content',
      title: 'Страница',
      description: 'Добавляйте блоки: текст, фото, видео и другие',
      type: 'array',
      of: [
        {
          name: 'textBlock',
          type: 'object',
          title: 'Текст',
          fields: [
            {
              name: 'text',
              title: 'Текст',
              type: 'array',
              of: [{ type: 'block' }]
            }
          ]
        },
        {
          name: 'imageBlock',
          type: 'object',
          title: 'Фото',
          fields: [
            { name: 'image', title: 'Выбрать фото', type: 'image', options: { hotspot: true } },
            { name: 'caption', title: 'Подпись под фото', type: 'string' }
          ]
        },
        {
          name: 'videoBlock',
          type: 'object',
          title: 'Видео',
          fields: [
            { name: 'videoFile', title: 'Загрузить видео', type: 'file', options: { accept: 'video/*' } },
            { name: 'caption', title: 'Подпись под видео', type: 'string' }
          ]
        },
        {
          name: 'galleryBlock',
          type: 'object',
          title: 'Несколько фото',
          fields: [
            {
              name: 'images',
              title: 'Фотографии',
              type: 'array',
              of: [{ type: 'image', options: { hotspot: true } }]
            },
            { name: 'columns', title: 'Колонок', type: 'number', initialValue: 3 }
          ]
        },
        {
          name: 'quoteBlock',
          type: 'object',
          title: 'Цитата',
          fields: [
            { name: 'text', title: 'Текст цитаты', type: 'text', rows: 3 },
            { name: 'author', title: 'Автор', type: 'string' }
          ]
        },
        {
          name: 'processBlock',
          type: 'object',
          title: 'Процесс (этапы)',
          fields: [
            { name: 'title', title: 'Заголовок процесса', type: 'string' },
            {
              name: 'steps',
              title: 'Шаги',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'title', title: 'Название шага', type: 'string' },
                    { name: 'description', title: 'Описание', type: 'text', rows: 2 },
                    { name: 'image', title: 'Фото шага', type: 'image' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
    },
  },
}
