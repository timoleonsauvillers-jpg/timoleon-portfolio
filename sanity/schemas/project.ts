import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Projet',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Motion', value: 'motion' },
          { title: 'Print', value: 'print' },
          { title: 'Identité', value: 'identite' },
          { title: 'Bac à sable', value: 'bac-a-sable' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Année',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'context',
      title: 'Contexte',
      type: 'text',
      rows: 3,
      description: 'Description courte du projet (1-2 phrases)',
    }),
    defineField({
      name: 'role',
      title: 'Rôle',
      type: 'string',
      description: 'Ex: Motion Design, Direction Artistique',
    }),
    defineField({
      name: 'link',
      title: 'Lien externe',
      type: 'url',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Image principale',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Galerie',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Affiché en page d\'accueil',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
      description: 'Plus petit = apparaît en premier',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'thumbnail',
    },
  },
  orderings: [
    {
      title: 'Ordre manuel',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Date (récent)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
});
