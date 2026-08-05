'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import EventFormModal from './EventFormModal';
import EventPanel from './EventPanel';
import MembersModal from './MembersModal';
import DayEventsModal from './DayEventsModal';

const WEEKDAYS = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
const MONTHS = [
    'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
    'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
];

function toISODate(date) {
    return date.toISOString().slice(0, 10);
}

function buildMonthGrid(year, month) {
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7; // lunedì = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
}

function formatDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'long' });
}

function formatDayLabel(year, month, day) {
    const date = new Date(year, month, day);
    return date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function CalendarView({ calendar, userId }) {
    const router = useRouter();
    const supabase = createClient();
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [dayEventsList, setDayEventsList] = useState(null); // { day, events }

    const isOwner = calendar.owner_id === userId;

    const loadEvents = useCallback(async () => {
        setLoading(true);
        const from = toISODate(new Date(year, month, 1));
        const to = toISODate(new Date(year, month + 1, 0));
        const { data } = await supabase
            .from('events')
            .select('*')
            .eq('calendar_id', calendar.id)
            .gte('event_date', from)
            .lte('event_date', to)
            .order('event_date', { ascending: true })
            .order('start_time', { ascending: true });
        setEvents(data || []);
        setLoading(false);
    }, [year, month, calendar.id, supabase]);

    useEffect(() => { loadEvents(); }, [loadEvents]);

    function changeMonth(delta) {
        let m = month + delta;
        let y = year;
        if (m < 0) { m = 11; y -= 1; }
        if (m > 11) { m = 0; y += 1; }
        setMonth(m);
        setYear(y);
    }

    const eventDays = new Set(events.map((e) => Number(e.event_date.slice(8, 10))));
    const todayISO = toISODate(today);
    const upcoming = events.filter((e) => e.event_date >= todayISO);
    const cells = buildMonthGrid(year, month);

    async function handleDeleteEvent(event) {
        await supabase.from('events').delete().eq('id', event.id);
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
        setSelectedEvent(null);
    }

    function openDay(day) {
        const dayEvents = events.filter((e) => Number(e.event_date.slice(8, 10)) === day);
        if (dayEvents.length === 1) {
            setSelectedEvent(dayEvents[0]);
        } else if (dayEvents.length > 1) {
            setDayEventsList({ day, events: dayEvents });
        }
    }

    return (
        <main className="min-h-screen px-4 py-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-1">
                <button onClick={() => router.push('/home')} className="text-gray-500 text-lg" aria-label="Indietro">←</button>
                <h1 className="text-sm font-medium">{calendar.name}</h1>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowMembers(true)} className="text-gray-500 text-base" aria-label="Partecipanti">👥</button>
                    <button
                        onClick={() => { setEditingEvent(null); setShowForm(true); }}
                        className="text-accent text-xl leading-none"
                        aria-label="Nuovo evento"
                    >
                        ＋
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 mb-2">
                <button onClick={() => changeMonth(-1)} className="text-gray-400 px-2" aria-label="Mese precedente">‹</button>
                <p className="text-sm font-medium">{MONTHS[month]} {year}</p>
                <button onClick={() => changeMonth(1)} className="text-gray-400 px-2" aria-label="Mese successivo">›</button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((w, i) => (
                    <span key={i} className="text-[11px] text-gray-400 text-center">{w}</span>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {cells.map((day, i) => {
                    if (!day) return <div key={i} className="h-9" />;
                    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                    return (
                        <button
                            key={i}
                            onClick={() => openDay(day)}
                            className={`h-9 flex flex-col items-center justify-center rounded-lg text-[13px] ${isToday ? 'border border-accent' : ''}`}
                        >
                            <span>{day}</span>
                            {eventDays.has(day) && <span className="w-1.5 h-1.5 rounded-full bg-accent mt-0.5" />}
                        </button>
                    );
                })}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-3">
                <p className="text-sm font-medium mb-2">Prossimi eventi</p>
                {loading && <p className="text-xs text-gray-400">Caricamento...</p>}
                {!loading && upcoming.length === 0 && (
                    <p className="text-xs text-gray-400">Nessun evento in programma questo mese.</p>
                )}
                <div className="flex flex-col gap-2">
                    {upcoming.map((e) => (
                        <div
                            key={e.id}
                            onClick={() => setSelectedEvent(e)}
                            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-2.5 cursor-pointer"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">{e.title}</p>
                                <p className="text-xs text-gray-400">
                                    {formatDate(e.event_date)}{e.start_time ? ` · ${e.start_time.slice(0, 5)}` : ''}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {dayEventsList && (
                <DayEventsModal
                    events={dayEventsList.events}
                    dateLabel={formatDayLabel(year, month, dayEventsList.day)}
                    onSelect={(e) => { setSelectedEvent(e); setDayEventsList(null); }}
                    onClose={() => setDayEventsList(null)}
                />
            )}

            {selectedEvent && (
                <EventPanel
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onEdit={() => { setEditingEvent(selectedEvent); setShowForm(true); setSelectedEvent(null); }}
                    onDelete={() => handleDeleteEvent(selectedEvent)}
                />
            )}

            {showForm && (
                <EventFormModal
                    calendarId={calendar.id}
                    userId={userId}
                    existingEvent={editingEvent}
                    onClose={() => setShowForm(false)}
                    onSaved={() => { setShowForm(false); loadEvents(); }}
                />
            )}

            {showMembers && (
                <MembersModal
                    calendarId={calendar.id}
                    isOwner={isOwner}
                    onClose={() => setShowMembers(false)}
                />
            )}
        </main>
    );
}