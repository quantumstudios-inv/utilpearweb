import { getStore } from '@netlify/blobs';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { email, action } = JSON.parse(event.body || '{}');
    if (!email) return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Falta email' }) };

    const store = getStore('pro-users');
    let list = [];
    const existing = await store.get('list', { type: 'json' });
    if (existing) list = existing;

    const cleanEmail = email.toLowerCase().trim();
    
    if (action === 'remove') {
      list = list.filter(e => e !== cleanEmail);
    } else {
      if (!list.includes(cleanEmail)) list.push(cleanEmail);
    }

    await store.setJSON('list', list);

    return { statusCode: 200, body: JSON.stringify({ ok: true, list }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: e.message }) };
  }
};
