import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'pro-users.json');

async function getList(){
  try{
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  }catch{ return []; }
}

export const handler = async (event) => {
  if (event.httpMethod!== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try{
    const { email, action } = JSON.parse(event.body || '{}');
    if(!email) return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Falta email' }) };

    let list = await getList();
    const clean = email.toLowerCase().trim();

    if(action === 'remove'){
      list = list.filter(e => e!== clean);
    }else{
      if(!list.includes(clean)) list.push(clean);
    }

    // En Netlify el archivo se guarda temporalmente, pero te muestro el contenido
    // Para hacerlo permanente necesitamos guardarlo en GitHub, por eso te doy el paso 3
    try{ await fs.writeFile(filePath, JSON.stringify(list, null, 2)); }catch{}

    return { statusCode: 200, body: JSON.stringify({ ok: true, list, note: 'Agregado en memoria. Para hacerlo permanente copia el JSON de abajo a data/pro-users.json' }) };
  }catch(e){
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: e.message }) };
  }
};
