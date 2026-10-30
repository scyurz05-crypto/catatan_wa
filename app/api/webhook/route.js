import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    let message = '';
    let sender = '';

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      message = body.message || body.text;
      sender = body.sender || body.pushname;
    } else {
      const formData = await request.formData();
      message = formData.get('message') || formData.get('text');
      sender = formData.get('sender') || formData.get('pushname');
    }

    if (message) {
      const { error } = await supabase.from('notes').insert([
        { content: String(message), sender: String(sender || '') }
      ]);
      if (error) console.error('Supabase Insert Error:', error);
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return new Response('Error', { status: 500 });
  }
}
