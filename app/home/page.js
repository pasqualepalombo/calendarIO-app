import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import HomeClient from './HomeClient';

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: memberships } = await supabase
    .from('calendar_members')
    .select('role, calendars ( id, name, owner_id )')
    .eq('user_id', user.id);

  const calendars = (memberships || [])
    .filter((m) => m.calendars)
    .map((m) => ({
      id: m.calendars.id,
      name: m.calendars.name,
      isOwner: m.calendars.owner_id === user.id,
    }));

  return <HomeClient initialCalendars={calendars} userId={user.id} />;
}
