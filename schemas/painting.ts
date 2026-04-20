// Схема: Картина
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
      title: 'Ссылка (генерируется автоматически)',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Фото картины',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'feeling',
      title: 'Ощущение',
      type: 'string',
      description: 'Например: Про движение, которое нельзя остановить',
    },
    {
      name: 'description',
      title: 'Описание (необязательно)',
      type: 'text',
      rows: 3,
    },
    {
      name: 'order',
      title: 'Порядок в списке',
      type: 'number',
    },
    {
      name: 'stateTag',
      title: 'Состояние',
      type: 'string',
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
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
}
