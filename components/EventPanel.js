'use client';

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'long' });
}

export default function EventPanel({ event, onClose, onEdit, onDelete }) {
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
            <button onClick={onDelete} className="text-red-600 text-sm" aria-label="Elimina">✕</button>
          </div>
        </div>
        {event.description && (
          <>
            <p className="text-xs text-gray-400 mb-1">Note</p>
            <p className="text-sm mb-3">{event.description}</p>
          </>
        )}
        <button onClick={onClose} className="text-xs text-gray-400 mt-2">Chiudi</button>
      </div>
    </div>
  );
}
