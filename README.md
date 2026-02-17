# Portfolio Timoléon Sauvillers

Portfolio de Motion Designer et Graveur.

## Stack Technique

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **CMS**: Sanity (à configurer)
- **E-commerce**: Shopify (à configurer)
- **Hébergement**: Vercel (recommandé)

## Installation

```bash
# Cloner le projet
git clone <repo-url>
cd portfolio-timoleon

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local

# Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
├── app/                  # Pages (App Router)
│   ├── layout.tsx        # Layout principal
│   ├── page.tsx          # Home
│   ├── work/             # Page Work
│   ├── shop/             # Page Shop
│   ├── about/            # Page About
│   └── project/[slug]/   # Pages projet
├── components/           # Composants React
├── lib/                  # Utilitaires (Sanity, Shopify)
└── types/                # Types TypeScript
```

## Configuration

### Sanity CMS

1. Créer un compte sur [sanity.io](https://sanity.io)
2. Créer un nouveau projet
3. Récupérer le Project ID
4. Créer un token API (lecture)
5. Remplir `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=xxx
   ```

### Shopify

1. Créer une boutique sur [shopify.com](https://shopify.com)
2. Aller dans Settings > Apps > Develop apps
3. Créer une app privée
4. Activer Storefront API
5. Récupérer le token
6. Remplir `.env.local`:
   ```
   NEXT_PUBLIC_SHOPIFY_DOMAIN=xxx.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxx
   ```

### Déploiement Vercel

1. Créer un compte sur [vercel.com](https://vercel.com)
2. Importer le projet depuis GitHub
3. Ajouter les variables d'environnement
4. Déployer

## Sécurité

- Headers de sécurité configurés dans `next.config.js`
- Variables sensibles dans `.env.local` (non commitées)
- API tokens côté serveur uniquement
- HTTPS forcé en production

## Phases de développement

- [x] Phase 1: Setup projet
- [x] Phase 2: Composants UI (Nav, Footer, pages)
- [x] Phase 3: HOME (scroll infini + parallax)
- [x] Phase 4: WORK (grille masonry, présentation)
- [x] Phase 5: Pages projet
- [x] Phase 6: ABOUT
- [x] Phase 7: SHOP (grille + pages produit)
- [ ] Phase 8: Sanity CMS
- [ ] Phase 9: Shopify integration
- [ ] Phase 10: Polish & déploiement

## Contact

Timoléon Sauvillers
