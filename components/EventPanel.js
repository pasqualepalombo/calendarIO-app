'use client';
import { useState } from 'react';

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'long' });
}

export default function EventPanel({ event, onClose, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-5 w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-medium">{event.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatDate(event.event_date)}
              {event.start_time
                ? ` · ${event.start_time.slice(0, 5)}${event.end_time ? ' - ' + event.end_time.slice(0, 5) : ''}`
                : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={onEdit} className="text-accent text-sm" aria-label="Modifica">🔧</button>
            <button onClick={() => setConfirmDelete(true)} className="text-red-600 text-sm" aria-label="Elimina">✕</button>
          </div>
        </div>
        {event.description && (
          <>
            <p className="text-xs text-gray-400 mb-1">Note</p>
            <p className="text-sm mb-3">{event.description}</p>
          </>
        )}

        {confirmDelete ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
            <p className="text-xs text-red-700 mb-2">Eliminare questo evento? L&apos;azione non è reversibile.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 border border-gray-300 rounded-lg py-1.5 text-xs"
              >
                Annulla
              </button>
              <button
                onClick={onDelete}
                className="flex-1 bg-red-600 text-white rounded-lg py-1.5 text-xs"
              >
                Elimina
              </button>
            </div>
          </div>
        ) : (
          <button onClick={onClose} className="text-xs text-gray-400 mt-2">Chiudi</button>
        )}
      </div>
    </div>
  );
}