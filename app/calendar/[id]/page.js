import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CalendarView from '@/components/CalendarView';

export default async function CalendarPage({ params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: calendar } = await supabase
    .from('calendars')
    .select('id, name, owner_id')
    .eq('id', params.id)
    .single();

  if (!calendar) notFound();

  return <CalendarView calendar={calendar} userId={user.id} />;
}
