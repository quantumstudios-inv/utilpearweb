exports.handler = async (event) => {
  if (event.httpMethod!== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { email, password } = JSON.parse(event.body || '{}');
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail ||!adminHash) {
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'Faltan variables en Netlify' }) };
    }

    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(password).digest('hex');

    if (email === adminEmail && hash === adminHash) {
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    } else {
      return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'Credenciales incorrectas' }) };
    }
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: e.message }) };
  }
};
