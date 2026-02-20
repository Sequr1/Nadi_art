// Installation schema for Sanity Studio
// Инсталляции с гибким контентом

export default {
  name: 'installation',
  title: 'Инсталляции',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Название',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'description',
      title: 'Краткое описание',
      type: 'text',
      rows: 3
    },
    {
      name: 'heroImage',
      title: 'Главное изображение',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'heroVideo',
      title: 'Видео (вместо изображения)',
      type: 'url',
      description: 'YouTube или Vimeo ссылка'
    },
    {
      name: 'location',
      title: 'Место',
      type: 'string'
    },
    {
      name: 'year',
      title: 'Год',
      type: 'number'
    },
    {
      name: 'materials',
      title: 'Материалы',
      type: 'string',
      description: 'Используемые материалы'
    },
    {
      name: 'dimensions',
      title: 'Размеры',
      type: 'string',
      description: 'Габариты инсталляции'
    },
    // Гибкий контент — чередование блоков
    {
      name: 'content',
      title: 'Контент страницы',
      description: 'Добавляйте блоки в любом порядке',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'textBlock',
          title: 'Текстовый блок',
          fields: [
            {
              name: 'text',
              title: 'Текст',
              type: 'array',
              of: [{ type: 'block' }]
            }
          ],
          preview: {
            select: { title: 'text' },
            prepare: () => ({ title: '📝 Текстовый блок' })
          }
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
              options: { hotspot: true }
            },
            {
              name: 'caption',
              title: 'Подпись',
              type: 'string'
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
                  { title: 'Маленькое', value: 'small' }
                ]
              },
              initialValue: 'large'
            }
          ],
          preview: {
            select: { media: 'image', caption: 'caption' },
            prepare: ({ media, caption }: any) => ({
              title: caption || '🖼 Изображение',
              media
            })
          }
        },
        {
          type: 'object',
          name: 'videoBlock',
          title: 'Видео',
          fields: [
            {
              name: 'url',
              title: 'Ссылка на видео',
              type: 'url',
              description: 'YouTube или Vimeo'
            },
            {
              name: 'caption',
              title: 'Подпись',
              type: 'string'
            }
          ],
          preview: {
            select: { caption: 'caption' },
            prepare: ({ caption }: any) => ({
              title: caption || '🎬 Видео'
            })
          }
        },
        {
          type: 'object',
          name: 'galleryBlock',
          title: 'Галерея изображений',
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
                    {
                      name: 'caption',
                      title: 'Подпись',
                      type: 'string'
                    }
                  ]
                }
              ]
            },
            {
              name: 'columns',
              title: 'Колонок',
              type: 'number',
              options: {
                list: [2, 3, 4]
              },
              initialValue: 3
            }
          ],
          preview: {
            select: { images: 'images' },
            prepare: ({ images }: any) => ({
              title: `🖼 Галерея (${images?.length || 0} фото)`
            })
          }
        },
        {
          type: 'object',
          name: 'quoteBlock',
          title: 'Цитата / Мысль',
          fields: [
            {
              name: 'text',
              title: 'Текст',
              type: 'text'
            },
            {
              name: 'author',
              title: 'Автор',
              type: 'string'
            }
          ],
          preview: {
            select: { text: 'text' },
            prepare: ({ text }: any) => ({
              title: `💬 "${text?.slice(0, 50)}..."`
            })
          }
        },
        {
          type: 'object',
          name: 'processBlock',
          title: 'Процесс создания',
          fields: [
            {
              name: 'title',
              title: 'Заголовок',
              type: 'string',
              initialValue: 'Процесс создания'
            },
            {
              name: 'steps',
              title: 'Этапы',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'title', title: 'Название этапа', type: 'string' },
                    { name: 'description', title: 'Описание', type: 'text' },
                    { name: 'image', title: 'Фото', type: 'image', options: { hotspot: true } }
                  ]
                }
              ]
            }
          ],
          preview: {
            prepare: () => ({ title: '🔧 Процесс создания' })
          }
        }
      ]
    },
    {
      name: 'showBookingButton',
      title: 'Показать кнопку',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'bookingButtonText',
      title: 'Текст кнопки',
      type: 'string',
      initialValue: 'Посетить',
      hidden: ({ document }: any) => !document?.showBookingButton
    },
    {
      name: 'bookingLink',
      title: 'Ссылка',
      type: 'url',
      hidden: ({ document }: any) => !document?.showBookingButton
    },
    {
      name: 'featured',
      title: 'Показать на главной',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'order',
      title: 'Порядок сортировки',
      type: 'number'
    }
  ],
  orderings: [
    {
      title: 'По порядку',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    },
    {
      title: 'По году',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
      location: 'location',
      year: 'year'
    },
    prepare: ({ title, media, location, year }: any) => ({
      title,
      subtitle: [location, year].filter(Boolean).join(' • '),
      media
    })
  }
};
