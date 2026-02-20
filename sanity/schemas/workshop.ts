// Workshop schema for Sanity Studio
// Мастер-классы с гибким контентом

export default {
  name: 'workshop',
  title: 'Мастер-классы',
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
      name: 'duration',
      title: 'Продолжительность',
      type: 'string',
      description: 'Например: 3 часа, 2 дня'
    },
    {
      name: 'price',
      title: 'Стоимость',
      type: 'number'
    },
    {
      name: 'date',
      title: 'Дата проведения',
      type: 'datetime'
    },
    {
      name: 'location',
      title: 'Место проведения',
      type: 'string'
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
          title: 'Цитата',
          fields: [
            {
              name: 'text',
              title: 'Текст цитаты',
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
        }
      ]
    },
    {
      name: 'showBookingButton',
      title: 'Показать кнопку записи',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'bookingButtonText',
      title: 'Текст кнопки',
      type: 'string',
      initialValue: 'Записаться',
      hidden: ({ document }: any) => !document?.showBookingButton
    },
    {
      name: 'bookingLink',
      title: 'Ссылка для записи',
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
      title: 'По дате',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
      date: 'date'
    },
    prepare: ({ title, media, date }: any) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString('ru') : 'Дата не указана',
      media
    })
  }
};
