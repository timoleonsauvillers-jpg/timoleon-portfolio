import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { DuplicateProductAction } from './actions/duplicateProduct';

export default defineConfig({
  name: 'default',
  title: 'Portfolio Timoléon',

  projectId: 'oz88eact',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            // About singleton
            S.listItem()
              .title('À propos')
              .id('about')
              .child(
                S.document()
                  .schemaType('about')
                  .documentId('about')
              ),
            S.divider(),
            // Projects
            S.documentTypeListItem('project').title('Projets'),
            // Products
            S.documentTypeListItem('product').title('Produits'),
            // Shop categories
            S.documentTypeListItem('shopCategory').title('Catégories shop'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, { schemaType }) => {
      if (schemaType !== 'product') return prev;
      return [...prev, DuplicateProductAction];
    },
  },
});
