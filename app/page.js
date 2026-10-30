'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await supabase
        .from('notes')
        .select('*')
        .order('id', { ascending: false });
      if (data) setNotes(data);
    };
    fetchNotes();

    const channel = supabase
      .channel('realtime-notes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notes' }, (payload) => {
        setNotes((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">📌 Catatan WhatsApp</h1>
      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="text-slate-400">Belum ada catatan. Kirim WA untuk mencoba!</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-4 border rounded-xl shadow-sm bg-white border-slate-200">
              <p className="text-slate-800 text-base whitespace-pre-wrap">{note.content}</p>
              <span className="text-xs text-slate-400 mt-2 block">
                {new Date(note.created_at).toLocaleString('id-ID')}
              </span>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
