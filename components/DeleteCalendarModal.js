'use client';
export default function DeleteCalendarModal({ calendarName, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 px-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl p-5 w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm font-medium mb-1">Eliminare &quot;{calendarName}&quot;?</p>
        <p className="text-xs text-gray-500 mb-4">
          Tutti gli eventi e i partecipanti verranno rimossi. Azione non reversibile.
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm">Annulla</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm">Elimina</button>
        </div>
      </div>
    </div>
  );
}
