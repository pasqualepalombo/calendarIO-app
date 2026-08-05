'use client';

export default function DayEventsModal({ events, dateLabel, onSelect, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 px-4" onClick={onClose}>
            <div className="bg-white rounded-2xl p-5 w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
                <p className="text-sm font-medium mb-3 capitalize">{dateLabel}</p>
                <div className="flex flex-col gap-2">
                    {events.map((e) => (
                        <div
                            key={e.id}
                            onClick={() => onSelect(e)}
                            className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 cursor-pointer"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">{e.title}</p>
                                {e.start_time && <p className="text-xs text-gray-400">{e.start_time.slice(0, 5)}</p>}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="text-xs text-gray-400 mt-3">Chiudi</button>
            </div>
        </div>
    );
}