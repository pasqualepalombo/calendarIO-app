# CalendarIO

App di calendario condiviso. Next.js (App Router) + Supabase (Auth + Postgres) + Tailwind CSS.

## 1. Configurazione locale

1. Copia `.env.local.example` in `.env.local`
2. Apri il tuo progetto Supabase → Project Settings → API
3. Incolla `Project URL` in `NEXT_PUBLIC_SUPABASE_URL` e `anon public key` in `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Installa le dipendenze e avvia in locale:

```
npm install
npm run dev
```

L'app sarà su http://localhost:3000

## 2. Database

Se non l'hai già fatto, esegui lo script `calendarIO_schema.sql` (fornito a parte) nell'SQL Editor di Supabase. Crea tabelle, sicurezza (RLS) e automatismi.

Su Supabase, in **Authentication → URL Configuration**, verifica che il "Site URL" corrisponda al dominio dove pubblicherai l'app (in locale va bene http://localhost:3000, poi lo aggiornerai con l'URL di Vercel).

## 3. Pubblicazione online (Vercel)

1. Crea un repository su GitHub e carica questa cartella
2. Vai su vercel.com → accedi con GitHub → "Add New Project" → seleziona il repository
3. Nella sezione "Environment Variables" aggiungi le stesse due variabili di `.env.local`
4. Deploy. In pochi minuti l'app sarà online su un dominio tipo `calendario-app.vercel.app`
5. Torna su Supabase → Authentication → URL Configuration → aggiorna il "Site URL" con l'URL di Vercel (serve per far funzionare correttamente la conferma email)

## Struttura del progetto

```
app/
  login/          pagina di accesso
  signup/         pagina di iscrizione
  home/           lista dei calendari a cui si partecipa
  calendar/[id]/  vista mensile di un calendario, eventi, partecipanti
components/       modali ed elementi di interfaccia riutilizzabili
lib/supabase/     client Supabase (browser e server)
middleware.js     protegge le pagine private e gestisce la sessione
```
