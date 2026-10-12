exports.handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body);
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO; // quantumstudios-inv/utilpearweb
    const branch = process.env.GITHUB_BRANCH || 'main';
    
    console.log("Repo:", repo, "Branch:", branch, "Email:", email, "Token exists:", !!token);
    
    if (!token) throw new Error("No GITHUB_TOKEN");
    
    // 1. Obtener archivo actual
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/data/pro-users.json?ref=${branch}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" }
    });
    
    const fileData = await getRes.json();
    console.log("GitHub get:", getRes.status, fileData.message);
    
    if (!fileData.content) throw new Error("No se pudo leer pro-users.json: " + JSON.stringify(fileData));
    
    const content = Buffer.from(fileData.content, 'base64').toString();
    let users = JSON.parse(content);
    
    if (!users.includes(email)) users.push(email);
    
    // 2. Guardar
    const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/data/pro-users.json`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
      body: JSON.stringify({
        message: `Add PRO ${email}`,
        content: Buffer.from(JSON.stringify(users, null, 2)).toString('base64'),
        sha: fileData.sha,
        branch: branch
      })
    });
    
    const putResult = await putRes.json();
    console.log("GitHub put:", putRes.status, putResult.message);
    
    if (!putRes.ok) throw new Error(JSON.stringify(putResult));
    
    return { statusCode: 200, body: JSON.stringify({ ok: true, users }) };
    
  } catch (e) {
    console.error("ERROR give-pro:", e.message);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
