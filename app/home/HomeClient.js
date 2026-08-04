'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import DeleteCalendarModal from '@/components/DeleteCalendarModal';

export default function HomeClient({ initialCalendars, userId }) {
  const router = useRouter();
  const supabase = createClient();
  const [calendars, setCalendars] = useState(initialCalendars);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const pressTimer = useRef(null);
  const [createError, setCreateError] = useState('');

  function startPress(cal) {
    if (!cal.isOwner) return;
    pressTimer.current = setTimeout(() => setToDelete(cal), 550);
  }
  function cancelPress() {
    clearTimeout(pressTimer.current);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreateError('');
    const { data, error } = await supabase
      .from('calendars')
      .insert({ name: newName.trim(), owner_id: userId })
      .select()
      .single();
    if (error) {
      console.error('Errore creazione calendario:', error);
      setCreateError(error.message);
      return;
    }
    setCalendars((prev) => [...prev, { id: data.id, name: data.name, isOwner: true }]);
    setNewName('');
    setShowNew(false);
  }

  async function handleDeleteConfirmed() {
    if (!toDelete) return;
    await supabase.from('calendars').delete().eq('id', toDelete.id);
    setCalendars((prev) => prev.filter((c) => c.id !== toDelete.id));
    setToDelete(null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <main className="min-h-screen px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-medium">I tuoi calendari</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500">Esci</button>
      </div>

      <div className="flex flex-col gap-2">
        {calendars.map((cal) => (
          <div
            key={cal.id}
            onMouseDown={() => startPress(cal)}
            onMouseUp={cancelPress}
            onMouseLeave={cancelPress}
            onTouchStart={() => startPress(cal)}
            onTouchEnd={cancelPress}
            onClick={() => router.push(`/calendar/${cal.id}`)}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 cursor-pointer select-none"
          >
            <span className="text-accent">📅</span>
            <span className="flex-1 text-sm font-medium">{cal.name}</span>
            {cal.isOwner && (
              <span className="text-xs bg-emerald-50 text-accentDark px-2 py-0.5 rounded-full">owner</span>
            )}
          </div>
        ))}
        {calendars.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            Non fai ancora parte di nessun calendario. Creane uno per iniziare.
          </p>
        )}
      </div>

      {calendars.some((c) => c.isOwner) && (
        <p className="text-xs text-gray-400 text-center mt-4">
          Tieni premuto un calendario tuo per eliminarlo
        </p>
      )}

      {!showNew ? (
        <button
          onClick={() => setShowNew(true)}
          className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center text-xl mt-6 mx-auto"
          aria-label="Nuovo calendario"
        >
          +
        </button>
      ) : (
        <form onSubmit={handleCreate} className="mt-6 flex gap-2">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome del calendario"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <button type="submit" className="bg-accent text-white rounded-lg px-4 text-sm font-medium">Crea</button>
          {createError && <p className="text-xs text-red-600 mt-1">{createError}</p>}
        </form>
      )}

      {toDelete && (
        <DeleteCalendarModal
          calendarName={toDelete.name}
          onCancel={() => setToDelete(null)}
          onConfirm={handleDeleteConfirmed}
        />
      )}
    </main>
  );
}
