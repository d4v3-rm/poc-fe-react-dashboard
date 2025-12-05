# Task Dashboard (Frontend only)

Dashboard React per gestione task multi-progetto con persistenza locale (`localStorage`), vista lista e Kanban, editing markdown con preview live, drag and drop, import/export completo e localizzazione Italiano/Inglese.

## Stack

- Vite + React + TypeScript
- Ant Design (theme centralizzato)
- Zustand (state management + persistence)
- React Hook Form + Zod (form validation)
- dnd-kit (drag and drop Kanban)
- i18next + react-i18next (i18n IT/EN)
- react-markdown + remark-gfm (markdown render)

## Main Features

- Multi-project workspace (ogni progetto = cartella logica)
- Task CRUD con:
  - titolo
  - contenuto markdown
  - stato
  - data di scadenza
- Viste switchabili:
  - `List`
  - `Kanban`
- Board Kanban con:
  - drag and drop task
  - filtri ricerca/stato/scadenza
  - stati custom (add/edit/delete)
- Local storage persistence (single user)
- Import/Export JSON di tutte le progettualita
- UI moderna e responsive (desktop + mobile)
- Localizzazione IT/EN

## Run

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Data Persistence

I dati vengono salvati automaticamente in `localStorage` con chiave:

- `task-dashboard-v1`

L'import/export usa un file JSON con snapshot completo dello stato.
