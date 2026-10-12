import fs from 'fs/promises';
import path from 'path';

export const handler = async () => {
  try{
    const filePath = path.join(process.cwd(), 'data', 'pro-users.json');
    const data = await fs.readFile(filePath, 'utf8');
    const list = JSON.parse(data);
    return { statusCode: 200, body: JSON.stringify({ ok: true, list }) };
  }catch(e){
    return { statusCode: 200, body: JSON.stringify({ ok: true, list: [] }) };
  }
};
