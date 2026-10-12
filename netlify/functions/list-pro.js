import { getStore } from '@netlify/blobs';

export const handler = async () => {
  try {
    const store = getStore('pro-users');
    const list = await store.get('list', { type: 'json' }) || [];
    return { statusCode: 200, body: JSON.stringify({ ok: true, list }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: e.message, list: [] }) };
  }
};
