import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const message = formData.get('message');
    const sender = formData.get('sender');

    if (message) {
      await supabase.from('notes').insert([{ content: message, sender }]);
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    return new Response('Error', { status: 500 });
  }
}
