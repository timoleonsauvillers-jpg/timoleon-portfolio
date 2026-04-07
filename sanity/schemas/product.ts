import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Produit',
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
      name: 'price',
      title: 'Prix (€)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'details',
      title: 'Détails livraison',
      type: 'text',
      rows: 2,
      description: 'Ex: Expédition sous 5-7 jours ouvrés.',
    }),
    defineField({
      name: 'edition',
      title: 'Édition',
      type: 'string',
      description: 'Ex: 3/20',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
      description: 'Ex: 30 × 40 cm',
    }),
    defineField({
      name: 'technique',
      title: 'Technique',
      type: 'string',
      description: 'Ex: Eau-forte, Linogravure',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'isClothing',
      title: 'Habit (précommande)',
      type: 'boolean',
      initialValue: false,
      description: 'Activer pour un vêtement — affiche le choix de taille et passe en précommande.',
    }),
    defineField({
      name: 'sizeVariants',
      title: 'Variantes par taille',
      type: 'array',
      hidden: ({ document }) => !document?.isClothing,
      description: 'Associe chaque taille à un Shopify Variant ID.',
      of: [
        {
          type: 'object',
          name: 'sizeVariant',
          title: 'Taille',
          fields: [
            defineField({
              name: 'size',
              title: 'Taille',
              type: 'string',
              options: {
                list: [
                  { title: 'XS', value: 'XS' },
                  { title: 'S', value: 'S' },
                  { title: 'M', value: 'M' },
                  { title: 'L', value: 'L' },
                  { title: 'XL', value: 'XL' },
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'shopifyVariantId',
              title: 'Shopify Variant ID',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'size', subtitle: 'shopifyVariantId' },
          },
        },
      ],
    }),
    defineField({
      name: 'available',
      title: 'Disponible',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'shopifyVariantId',
      title: 'Shopify Variant ID',
      type: 'string',
      hidden: ({ document }) => !!document?.isClothing,
      description: 'Pour les produits sans taille. ID de la variante Shopify (Produits → ton produit → Variantes → URL).',
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'reference',
      to: [{ type: 'shopCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'price',
      media: 'images.0',
      available: 'available',
      isClothing: 'isClothing',
    },
    prepare({ title, subtitle, media, available, isClothing }) {
      const tags = [];
      if (isClothing) tags.push('Précommande');
      if (!available) tags.push('Épuisé');
      return {
        title: tags.length ? `${title} (${tags.join(', ')})` : title,
        subtitle: `${subtitle} €`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Ordre manuel',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Prix (croissant)',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
  ],
});
