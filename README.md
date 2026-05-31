# ScalTrade — Landing Page

Landing page marketing pour **ScalTrade** (nom commercial du projet RiskDesk) — un workspace
de trading Futures « AI-mentored » qui se connecte à Interactive Brokers et valide chaque trade
contre la stratégie du trader, en temps réel.

> En ligne : **https://scaltrade.com**

## Stack

**React 18 + Vite** (build de production : JSX pré-compilé, React minifié, plus de Babel-in-browser).

```
index.html            Entrée Vite (balises SEO/OG, polices Google Fonts, #root)
src/
  main.jsx            Point d'entrée prod (importe les modules dans l'ordre)
  globals.js          Expose React/ReactDOM en global pour les modules legacy
  icons.jsx           Icônes SVG inline (style Lucide)
  chart.jsx           Chandeliers procéduraux animés + sparklines
  mockups.jsx         Chrome terminal, dashboard, chat AI Mentor
  sections.jsx        Nav, social proof, problème/solution, features, comparatif, pricing, footer
  app.jsx             Composition de la page (Tweaks panel retiré en prod)
public/
  favicon.svg         Logo ST (vectoriel)
  terms.html          Conditions d'utilisation (servies à /terms.html)
  privacy.html        Politique de confidentialité (servie à /privacy.html)
docs/
  DESIGN_HANDOFF.md   Instructions d'export Claude Design d'origine
  CICD_SETUP.md       Mise en place du déploiement automatique
  PUBLIC_ASSETS.md    Assets à fournir (favicon.ico, apple-touch-icon, og-image)
  chats/              Transcripts de la conversation de design
```

## Développement

```bash
npm install
npm run dev        # serveur de dev Vite (HMR) sur http://localhost:5173
npm run build      # build de production -> dist/
npm run preview    # sert dist/ localement pour vérifier
```

## Déploiement

Le site est servi en statique par **nginx** sur une instance GCP, domaine `scaltrade.com`
(HTTPS Let's Encrypt). Le contenu de `dist/` est copié dans `/var/www/scaltrade`.

- **Automatique (recommandé)** : chaque push sur `main` déclenche un build + déploiement via
  GitHub Actions (`.github/workflows/deploy.yml`). Mise en place : voir
  [`docs/CICD_SETUP.md`](docs/CICD_SETUP.md).
- **Manuel** : `npm run build` puis copier `dist/` sur la VM (`gcloud compute scp`).

## À fournir (assets)

`index.html` référence quelques fichiers à déposer dans `public/` pour éviter des 404 et
soigner les partages sociaux — voir [`docs/PUBLIC_ASSETS.md`](docs/PUBLIC_ASSETS.md) :
`favicon.ico`, `apple-touch-icon.png`, `og-image.png` (1200×630).

## TODO

- [ ] Brancher le **formulaire waitlist** (boutons « Get Early Access ») à un service réel
      (Formspree / Google Sheets / Mailchimp).
- [ ] Ajouter **og-image.png** + favicons raster (voir `docs/PUBLIC_ASSETS.md`).
- [ ] (Optionnel) Analytics (GA4 / Plausible).
