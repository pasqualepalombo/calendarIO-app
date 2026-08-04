'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const supabase = createClient();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <p className="text-base font-medium mb-2">Controlla la tua email</p>
          <p className="text-sm text-gray-600">
            Ti abbiamo inviato un link di conferma. Aprilo per attivare l&apos;account, poi torna qui ad accedere.
          </p>
          <Link href="/login" className="text-accent text-sm font-medium block mt-4">Vai al login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-6">
        <h1 className="text-lg font-medium text-center mb-6">Crea account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Nome</label>
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Mario Rossi" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="nome@email.com" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Password</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Almeno 6 caratteri" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-accent text-white rounded-lg py-2 text-sm font-medium mt-2 disabled:opacity-60">
            {loading ? 'Creazione...' : 'Registrati'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Hai già un account? <Link href="/login" className="text-accent font-medium">Accedi</Link>
        </p>
      </div>
    </main>
  );
}
