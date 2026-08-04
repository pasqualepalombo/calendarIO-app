'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function MembersModal({ calendarId, isOwner, onClose }) {
  const supabase = createClient();
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadMembers() {
    setLoading(true);
    const { data } = await supabase
      .from('calendar_members')
      .select('role, profiles ( id, email, full_name )')
      .eq('calendar_id', calendarId);
    setMembers(data || []);
    setLoading(false);
  }

  useEffect(() => { loadMembers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.trim())
      .maybeSingle();
    if (!profile) {
      setError('Nessun utente registrato con questa email.');
      return;
    }
    const { error } = await supabase
      .from('calendar_members')
      .insert({ calendar_id: calendarId, user_id: profile.id, role: 'member' });
    if (error) {
      setError('Utente già presente o errore imprevisto.');
      return;
    }
    setEmail('');
    loadMembers();
  }

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-5 w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm font-medium mb-3">Partecipanti</p>
        {loading ? (
          <p className="text-xs text-gray-400">Caricamento...</p>
        ) : (
          <div className="flex flex-col gap-1.5 mb-3">
            {members.map((m) => (
              <div key={m.profiles.id} className="flex items-center justify-between text-sm">
                <span>{m.profiles.full_name || m.profiles.email}</span>
                {m.role === 'owner' && <span className="text-xs text-gray-400">owner</span>}
              </div>
            ))}
          </div>
        )}
        {isOwner && (
          <form onSubmit={handleAdd} className="flex flex-col gap-2 border-t border-gray-200 pt-3">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email della persona da invitare" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button type="submit" className="bg-accent text-white rounded-lg py-2 text-sm">Aggiungi</button>
          </form>
        )}
        <button onClick={onClose} className="text-xs text-gray-400 mt-3">Chiudi</button>
      </div>
    </div>
  );
}
