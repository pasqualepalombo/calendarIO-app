'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function EventFormModal({ calendarId, userId, existingEvent, presetDate, onClose, onSaved }) {
  const supabase = createClient();
  const [title, setTitle] = useState(existingEvent?.title || '');
  const [description, setDescription] = useState(existingEvent?.description || '');
  const [eventDate, setEventDate] = useState(
    existingEvent?.event_date || presetDate || new Date().toISOString().slice(0, 10)
  );
  const [startTime, setStartTime] = useState(existingEvent?.start_time?.slice(0, 5) || '');
  const [endTime, setEndTime] = useState(existingEvent?.end_time?.slice(0, 5) || '');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    const payload = {
      calendar_id: calendarId,
      title: title.trim(),
      description: description.trim() || null,
      event_date: eventDate,
      start_time: startTime || null,
      end_time: endTime || null,
      created_by: userId,
    };
    if (existingEvent) {
      await supabase.from('events').update(payload).eq('id', existingEvent.id);
    } else {
      await supabase.from('events').insert(payload);
    }
    setSaving(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-5 w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm font-medium mb-3">{existingEvent ? 'Modifica evento' : 'Nuovo evento'}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titolo"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input type="date" required value={eventDate} onChange={(e) => setEventDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Note (opzionale)"
            rows={2} className="border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" />
          <div className="flex gap-2 mt-1">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm">Annulla</button>
            <button type="submit" disabled={saving} className="flex-1 bg-accent text-white rounded-lg py-2 text-sm disabled:opacity-60">
              {saving ? 'Salvo...' : 'Salva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}