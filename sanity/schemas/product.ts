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
      name: 'available',
      title: 'Disponible',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'shopifyVariantId',
      title: 'Shopify Variant ID',
      type: 'string',
      description: 'ID de la variante Shopify. Dans Shopify: Produits → ton produit → Variantes → copie l\'ID depuis l\'URL.',
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
    },
    prepare({ title, subtitle, media, available }) {
      return {
        title: `${title}${available ? '' : ' (Épuisé)'}`,
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
