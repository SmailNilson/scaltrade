# ScalTrade — Landing Page

Landing page marketing pour **ScalTrade** (nom commercial du projet RiskDesk) — un workspace
de trading Futures « AI-mentored » qui se connecte à Interactive Brokers et valide chaque trade
contre la stratégie du trader, en temps réel.

> Domaine cible : **scaltrade.com**

## Stack

Prototype **React 18 + JSX**, en un seul fichier HTML qui charge React, ReactDOM et Babel
Standalone depuis un CDN et compile le JSX **dans le navigateur** (`type="text/babel"`).

```
index.html            Entrée de la page (CDN React/Babel, polices Google Fonts)
src/
  icons.jsx           Icônes SVG inline (style Lucide)
  chart.jsx           Chandeliers procéduraux animés + sparklines
  mockups.jsx         Chrome terminal, dashboard, chat AI Mentor
  sections.jsx        Nav, social proof, problème/solution, features, comparatif, pricing, footer
  app.jsx             Composition de la page (hero + sections + Tweaks panel)
tweaks-panel.jsx      Panneau de réglages design (outil de maquette — à retirer en prod)
docs/
  DESIGN_HANDOFF.md   Instructions d'export Claude Design d'origine
  chats/              Transcripts de la conversation de design
```

## Lancer en local

C'est un fichier statique — il suffit de le servir :

```bash
# au choix
python3 -m http.server 8000     # puis ouvrir http://localhost:8000
# ou
npx serve .
```

Ouvrir directement `index.html` via `file://` peut bloquer le chargement des modules `.jsx` :
préférez un petit serveur HTTP local.

## ⚠️ Avant la production

Ce dépôt est un **prototype**, pas un build de production :

- Babel compile le JSX **dans le navigateur** → page lente, à pré-compiler.
- React est chargé en build **développement** (non minifié).
- Le **Tweaks panel** (`tweaks-panel.jsx`) est un outil de design à retirer.

Pour la mise en ligne : convertir en build statique (Vite + React), retirer le Tweaks panel,
puis déployer les assets sur l'instance GCP via un server block nginx dédié à `scaltrade.com`
(IP statique, A records chez le registrar, HTTPS Let's Encrypt).
