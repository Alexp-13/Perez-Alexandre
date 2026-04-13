# Portfolio - Alexandre Perez

Portfolio personnel developpe avec React, TypeScript et Vite.

Objectif: presenter mon profil, mes projets, mes competences et permettre aux recruteurs d'interagir avec un chat IA base sur mes infos.

## Demo

- Production (Vercel): renseigner ton URL finale ici

## Stack technique

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion / GSAP
- Gemini API (chat recruteur)

## Fonctionnalites principales

- Interface moderne, responsive et animee
- Sections portfolio: Hero, About, Projects, Skills, Contact
- Modale projet detaillee
- Chat widget flottant en bas a droite
- Reponses IA en streaming
- Rendu Markdown des reponses IA

## Chat IA recruteur

Le chat utilise un endpoint serveur pour interroger Gemini sans exposer la cle API cote client.

- Widget frontend: src/components/ChatWidget.tsx
- Endpoint serveur: api/chat.ts
- Contexte injecte au modele:
	- src/assets/data/me.md
	- src/assets/data/projects.md
	- src/assets/data/technos.md

## Installation locale

1. Installer les dependances

```bash
bun install
```

2. Creer le fichier .env.local a la racine

```bash
GOOGLE_API_KEY=your_google_ai_studio_key
```

3. Lancer le projet

```bash
bun run dev
```

4. Build production

```bash
bun run build
```

5. Preview locale du build

```bash
bun run preview
```

## Variables d'environnement

- GOOGLE_API_KEY: cle Google AI Studio / Gemini (serveur uniquement)

Important:

- Ne jamais exposer la cle dans le frontend
- Ne pas utiliser de variable VITE_ pour cette cle

## Deploiement Vercel

Ajouter la variable GOOGLE_API_KEY dans:

1. Project Settings
2. Environment Variables
3. Environnements: Production (et Preview/Development si besoin)

Puis redeployer le projet.

## Scripts utiles

```bash
bun run dev
bun run dev:vercel
bun run build
bun run preview
```

## Personnalisation rapide

- Infos perso: src/assets/data/me.md
- Liste projets: src/assets/data/projects.md
- Liste technos: src/assets/data/technos.md

## Contact

- Email: perezalexandre.it@gmail.com
- GitHub: https://github.com/Alexp-13

