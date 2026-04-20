// Схема: Мысли художника
export default {
  name: 'thought',
  title: 'Мысли художника',
  type: 'document',
  fields: [
    {
      name: 'sender',
      title: 'Кто говорит?',
      type: 'string',
      options: {
        list: [
          { title: 'Надя (художник)', value: 'artist' },
          { title: 'Мир (входящее)', value: 'world' },
        ],
        layout: 'radio',
      },
      initialValue: 'artist',
    },
    {
      name: 'text',
      title: 'Текст мысли',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'time',
      title: 'Время или Эмодзи',
      type: 'string',
      description: 'Например: "12:00" или "✨"',
    },
    {
      name: 'order',
      title: 'Порядок',
      type: 'number',
    },
  ],
  preview: {
    select: {
      title: 'text',
      subtitle: 'sender',
    },
  },
}
