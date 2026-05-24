# Daily Tracker

Ein eleganter und minimalistischer Tages- und Gewohnheits-Tracker mit Clean Design, gebaut mit Next.js und Supabase.

## Features

✨ **Kernfunktionen:**
- 📌 PIN-geschützter Login (keine Authentifizierung erforderlich)
- 📋 Todo-Board mit Kategoriengruppierer
- 🎯 Habit Tracker für tägliche Gewohnheiten
- 📝 Tagesrückblick mit auto-save
- 📊 Wochenrückblick mit Statistiken
- 📅 Tagesnavigation (vorher/heute/morgen)
- 🎨 Minimalistisches Navy-Blue Design
- 📱 Vollständig responsive (Mobile, Tablet, Desktop)

## Tech Stack

- **Frontend:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS
- **Datenbank:** Supabase (PostgreSQL)
- **Authentifizierung:** PIN-basiert (httpOnly Cookies)
- **Sprache:** TypeScript
- **Deployment:** Vercel-ready

## Quickstart (Lokal)

### 1. Dependencies installieren
```bash
npm install
```

### 2. Environment Variables
Erstelle `.env.local` im Root-Verzeichnis:
```
TRACKER_PIN=1234
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Supabase Setup
1. Gehe zu deinem Supabase-Projekt
2. SQL Editor öffnen
3. Kopiere gesamten Inhalt aus `/supabase/schema.sql`
4. Paste in SQL Editor und Execute
5. Tabellen werden erstellt: categories, habits, habit_checks, tasks, daily_reviews

### 4. Starten
```bash
npm run dev
```

Öffne http://localhost:3000 → Login mit PIN `1234` → Done! 🎉

## Lokale Entwicklung

```bash
npm run dev      # Starten mit HMR
npm run build    # Produktions-Build
npm start        # Produktions-Server
```

## Deployment auf Vercel

### Schritt 1: Zu GitHub pushen
```bash
git init
git add .
git commit -m "Initial commit: Daily Tracker"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

### Schritt 2: Vercel Projekt erstellen
1. Gehe zu vercel.com
2. "Add New Project" → GitHub Repository auswählen
3. Import Settings bestätigen
4. Deploy

### Schritt 3: Environment Variables auf Vercel
1. Projekt Dashboard → Settings → Environment Variables
2. Hinzufügen:
   - `TRACKER_PIN`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Speichern → "Redeploy"

### Schritt 4: Live!
App läuft auf `https://<domain>.vercel.app`

Weitere Deploys automatisch bei jedem `git push origin main`.

## Projektstruktur

```
daily-tracker/
├── app/
│   ├── api/
│   │   ├── login/route.ts
│   │   └── logout/route.ts
│   ├── login/page.tsx
│   ├── dashboard/page.tsx
│   ├── layout.tsx
│   ├── page.tsx (redirect)
│   └── globals.css
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Card.tsx
│   ├── EmptyState.tsx
│   ├── HabitTracker.tsx
│   ├── HabitCard.tsx
│   ├── TodoBoard.tsx
│   ├── TodoCard.tsx
│   ├── TodoForm.tsx
│   ├── DailyReview.tsx
│   ├── WeeklyReview.tsx
│   └── CategoryManager.tsx
├── lib/
│   ├── types.ts
│   ├── auth.ts
│   ├── supabaseServer.ts
│   ├── dates.ts
│   ├── calculations.ts
│   ├── utils.ts
│   └── actions.ts
├── supabase/
│   └── schema.sql
├── middleware.ts
├── tailwind.config.ts
├── .env.example
└── README.md
```

## Environment Variables

| Variable | Beschreibung | Beispiel |
|----------|------------|---------|
| `TRACKER_PIN` | Login PIN | `"1234"` oder `"4567"` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key (sensitiv!) | `eyJhbGc...` |

**⚠️ WICHTIG:**
- `SUPABASE_SERVICE_ROLE_KEY` niemals in Git committen
- Nutze `.env.local` für lokale Development
- Auf Vercel: Settings → Environment Variables

## Sicherheit

✅ **PIN-Login:**
- Serverseitige Prüfung
- httpOnly Cookies (Session 30 Tage)
- Keine PIN im Frontend

✅ **Supabase:**
- Service Role Key läuft nur auf dem Server
- Keine direkten Client-Queries mit Service Key
- RLS kann disabled sein (privates Tool)

✅ **Middleware:**
- Schützt alle Routes außer `/login`
- Automatische Weiterleitung bei fehlender Session

## Features Übersicht

### Dashboard
- 5 Statistik-Cards (Offene Tasks, Erledigt heute, Gewohnheiten %, Aufwand, Verschoben)
- Datum-Navigation (Gestern/Heute/Morgen)
- Kategorien-Manager
- Habit Tracker mit Checkboxen
- Neue Aufgabe Form
- Todo-Board als Spalten-Layout
- Erledigte Tasks heute
- Tagesrückblick (7 Felder, Auto-Save)
- Wochenrückblick (Stats + Insights)

### Todo-Board
- Spalten nach Kategorien
- Sortierung: Überfällig → Heute → Zukunft → Kein Datum
- Pro Task: Erledigen, Verschieben, Bearbeiten, Löschen
- Farb-Indikatoren für Datum-Status
- Verschoben-Zähler (orange/rot)

### Gewohnheiten
- Tägliche Checkboxes
- Visuelle Farben
- Wochenrückblick: 5/7 Progress Bar pro Habit

### Kategorien
- Automatische Defaults beim Start (Uni, Nachhilfe, Content, Privat)
- Neue Kategorien hinzufügen
- Kategorien löschen (Tasks bleiben, category_id wird null)

## Troubleshooting

### "PIN ist nicht korrekt"
```
→ Prüfe TRACKER_PIN in .env.local
→ Stelle sicher PIN ist String: "1234" (nicht 1234)
→ Restart: npm run dev
```

### "Missing Supabase environment variables"
```
→ Setze alle 3 Variablen in .env.local
→ Restart: npm run dev
```

### "Fehler beim Laden der Daten" / Keine Tabellen
```
→ Schema.sql wurde nicht ausgeführt?
→ Gehe zu Supabase SQL Editor
→ Kopiere /supabase/schema.sql
→ Execute
→ Refresh App
```

### CORS / API Error
```
→ Sollte nicht vorkommen (alles Server-side)
→ Schau Browser Console für echte Error-Message
→ Check Supabase Logs in Studio
```

### Server startet nicht
```
→ npm install --force
→ npm run dev
```

## Performance

- Alle Datenbank-Queries sind Server Actions
- Auto-Save im Tagesrückblick mit 1s Debounce
- Minimal Bundle Size (~150KB gzipped)
- Image Optimization ausgeschaltet (kein statischer Content)

## Design-System

**Farbpalette:**
- Background: Navy `#071525`
- Cards: `#10243d` (primary) / `#132b49` (secondary)
- Primary: Sky Blue `#38bdf8`
- Success: Grün `#10b981`
- Warning: Orange `#f59e0b`
- Danger: Rot `#ef4444`

**Komponenten:**
- Abgerundete Cards & Buttons (`rounded-lg`)
- Subtle Borders (`border-slate-700`)
- Leichte Shadows
- Mobile-First responsive Design

## Next Steps (Optional)

Diese Version ist ein stabiles MVP. Mögliche zukünftige Features:

- Backup & Export (JSON/CSV)
- Drag & Drop im Todo-Board (dnd-kit)
- Wiederkehrende Tasks
- Task Templates
- Alarm/Reminders
- Dark/Light Mode Toggle
- Mobile App (React Native)

## Support

Bei Problemen:
1. Schau in Troubleshooting oben
2. Prüfe Environment Variables
3. Check Browser DevTools (F12) → Console für Errors
4. Schau Supabase Studio → Logs

---

**Viel Erfolg mit deinem Daily Tracker! 🚀**
