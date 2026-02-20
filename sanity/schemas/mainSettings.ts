// Schema: Main Settings (Singleton) - для Sanity Studio
// Настройки главной страницы

export default {
  name: 'mainSettings',
  title: 'Настройки сайта',
  type: 'document',
  // Singleton - только один документ
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'siteName',
      title: 'Название сайта',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'artistName',
      title: 'Имя художника',
      type: 'string',
    },
    {
      name: 'heroTitle',
      title: 'Заголовок главной страницы',
      type: 'string',
    },
    {
      name: 'heroSubtitle',
      title: 'Подзаголовок',
      type: 'text',
    },
    {
      name: 'heroMedia',
      title: 'Медиа на главной',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'heroVideo',
      title: 'Видео на главной (URL)',
      type: 'url',
    },
    {
      name: 'aboutText',
      title: 'О художнике',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'contactEmail',
      title: 'Email для связи',
      type: 'email',
    },
    {
      name: 'socialLinks',
      title: 'Социальные сети',
      type: 'object',
      fields: [
        { name: 'instagram', title: 'Instagram', type: 'url' },
        { name: 'telegram', title: 'Telegram', type: 'url' },
        { name: 'whatsapp', title: 'WhatsApp', type: 'url' },
        { name: 'vk', title: 'VK', type: 'url' },
      ],
    },
  ],
  preview: {
    select: { title: 'siteName' },
  },
};
