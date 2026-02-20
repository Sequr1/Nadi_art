// Schema: State (Состояние) - для Sanity Studio
// Скопируйте в ваш Sanity Studio проект: schemas/state.ts

export default {
  name: 'state',
  title: 'Состояние (Аудитория)',
  type: 'document',
  fields: [
    {
      name: 'slug',
      title: 'URL идентификатор',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Название состояния',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'audienceType',
      title: 'Тип аудитории',
      type: 'string',
      options: {
        list: [
          { title: 'Дерзкие (Крутые, статусные)', value: 'bold' },
          { title: 'Чувствующие (Эмоциональные)', value: 'emotional' },
          { title: 'Эстеты (Интеллектуалы)', value: 'aesthetic' },
          { title: 'Гармоничные (Уравновешенные)', value: 'harmonic' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'buttonLabel',
      title: 'Текст кнопки на лендинге',
      type: 'string',
    },
    {
      name: 'heroText',
      title: 'Главный текст (Меня считали...)',
      type: 'text',
    },
    {
      name: 'stateText',
      title: 'Текст состояния',
      type: 'text',
    },
    {
      name: 'heroMedia',
      title: 'Фон/Медиа героя',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'heroVideo',
      title: 'Видео фон (опционально)',
      type: 'url',
    },
    {
      name: 'artistPresence',
      title: 'Живое присутствие художника',
      type: 'object',
      fields: [
        { name: 'photo', title: 'Фото', type: 'image', options: { hotspot: true } },
        { name: 'video', title: 'Видео URL', type: 'url' },
        { name: 'text', title: 'Текст доверия', type: 'text' },
      ],
    },
    {
      name: 'colorTheme',
      title: 'Цветовая тема',
      type: 'object',
      fields: [
        { name: 'primary', title: 'Основной цвет', type: 'string' },
        { name: 'secondary', title: 'Вторичный цвет', type: 'string' },
        { name: 'accent', title: 'Акцентный цвет', type: 'string' },
      ],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'audienceType' },
  },
};
