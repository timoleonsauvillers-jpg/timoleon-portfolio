import { CopyIcon } from '@sanity/icons';
import { useClient, useDocumentOperation } from 'sanity';

export function DuplicateProductAction(props: {
  id: string;
  type: string;
  onComplete: () => void;
}) {
  const client = useClient({ apiVersion: '2024-01-01' });

  return {
    label: 'Dupliquer',
    icon: CopyIcon,
    onHandle: async () => {
      const original = await client.getDocument(props.id);
      if (!original) return;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, _rev, _createdAt, _updatedAt, slug, ...rest } = original;

      const newDoc = {
        ...rest,
        _type: 'product',
        title: `${rest.title} (copie)`,
        slug: {
          _type: 'slug',
          current: `${(slug as { current: string })?.current ?? 'produit'}-copie-${Date.now()}`,
        },
      };

      const created = await client.create(newDoc);
      // Navigate to the new document
      window.location.href = window.location.href.replace(props.id, created._id);
      props.onComplete();
    },
  };
}
