# CalendarIO

App di calendario condiviso: crea calendari, invita altre persone, e gestite insieme gli impegni. Ogni calendario ha una vista mensile con i giorni che hanno eventi segnati da un pallino, e una lista dei prossimi eventi sotto.

**Stack**: Next.js 14 (App Router) · Supabase (Auth + Postgres) · Tailwind CSS · Deploy su Vercel.

---

## 1. Requisiti

- [Node.js](https://nodejs.org) 18 o superiore
- Un account gratuito su [supabase.com](https://supabase.com)
- (per il deploy online) un account gratuito su [vercel.com](https://vercel.com) e uno su [github.com](https://github.com)

---

## 2. Crea il progetto Supabase

1. Vai su [supabase.com](https://supabase.com) → **New project**
2. Scegli nome e password del database (la password ti serve solo se ti serve accedere al database direttamente, l'app non la usa)
3. Aspetta che il progetto sia pronto (circa un minuto)

### Crea le tabelle

1. Nel progetto Supabase apri **SQL Editor** (menu laterale) → **New query**
2. Apri il file [`supabase/schema.sql`](./supabase/schema.sql) di questo repository, copia tutto il contenuto e incollalo nell'editor
3. Premi **Run**

Questo crea tutte le tabelle (`profiles`, `calendars`, `calendar_members`, `events`), gli automatismi (profilo creato alla registrazione, owner aggiunto come membro alla creazione di un calendario) e le regole di sicurezza (RLS) che impediscono a un utente di vedere o modificare calendari a cui non appartiene.

### Recupera le chiavi API

1. Nel progetto Supabase vai su **Project Settings** (icona ⚙️) → **API**
2. Copia il **Project URL** (es. `https://xxxxxxxxxxxx.supabase.co` — attenzione, senza nulla dopo `.co`, non il "REST URL")
3. Copia la **anon public key** (o la nuova "publishable key", a seconda della versione dell'interfaccia Supabase)

---

## 3. Configurazione locale

```bash
git clone <url-di-questo-repository>
cd calendarIO-app
npm install
```

Crea un file `.env.local` nella cartella principale del progetto (allo stesso livello di `package.json`) con questo contenuto, sostituendo con i tuoi valori:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=la-tua-chiave-anon-o-publishable
```

Avvia il progetto:

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000). Registrati con un'email vera: Supabase per default richiede la conferma via email prima di poter accedere.

> Se vuoi saltare la conferma email durante lo sviluppo: Supabase → **Authentication** → **Providers** → **Email** → disattiva "Confirm email".

---

## 4. Pubblicazione online (Vercel)

1. Carica il progetto su un repository GitHub (se non l'hai già fatto)
2. Vai su [vercel.com](https://vercel.com) → accedi con GitHub → **Add New Project** → seleziona il repository
3. Nella sezione **Environment Variables** aggiungi le stesse due variabili di `.env.local`
4. **Deploy** — in pochi minuti l'app sarà online su un indirizzo tipo `calendario-app.vercel.app`
5. Torna su Supabase → **Authentication** → **URL Configuration** → aggiorna il **Site URL** con l'indirizzo Vercel definitivo (altrimenti i link di conferma email continuano a puntare a `localhost`)

---

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
supabase/schema.sql   script SQL completo dello schema del database
```

## Funzionalità

- Accesso e iscrizione con email e password
- Lista dei calendari a cui si partecipa
- Creazione di un nuovo calendario (`+` nella Home)
- Eliminazione di un calendario tenendolo premuto (solo per il proprietario)
- Vista mensile del calendario con navigazione tra i mesi (`‹` `›`) e pallino sui giorni con eventi
- Aggiunta, modifica ed eliminazione (con conferma) di un evento
- Invito di altri partecipanti a un calendario tramite la loro email (icona 👥, solo il proprietario può invitare — la persona invitata deve già essersi registrata su CalendarIO)

## Note

- Il file `supabase/schema.sql` è pensato per essere eseguito **una sola volta** su un progetto Supabase nuovo e vuoto. Non va rieseguito su un progetto già configurato.
- Per invitare qualcuno a un calendario, quella persona deve già avere un account CalendarIO (essersi registrata almeno una volta).