// src/mvp.js
import { supabase } from './supabase.js';

export function mostrarMVP() {
  const app = document.getElementById('app');
  app.innerHTML = `
<section style="max-width:600px;margin:40px auto;padding:20px;
background:#fff;border-radius:12px;box-shadow:0 3px 10px rgba(0,0,0,0.15);
font-family:Arial">

<h2 style="text-align:center;margin-bottom:20px;">Crear Post</h2>

<form id="post-form" style="display:flex;flex-direction:column;gap:15px">

  <textarea 
    name="contenido" 
    placeholder="¿Qué estás pensando?" 
    required
    style="padding:12px;border:1px solid #ccc;border-radius:8px;min-height:90px"
  ></textarea>

  <button type="submit" style="
    padding:12px;background:#007bff;color:white;font-weight:bold;
    border:none;border-radius:8px;cursor:pointer;">
    Publicar
  </button>

</form>

<p id="mensaje" style="text-align:center;margin-top:10px;"></p>

<h3 style="margin-top:40px">Mis Posts</h3>
<div id="lista-posts"></div>

</section>
  `;

  const form = document.getElementById('post-form');
  const mensaje = document.getElementById('mensaje');
  const lista = document.getElementById('lista-posts');

  // ============================
  // 🔹 Cargar posts del usuario
  // ============================
  async function cargarPosts() {
    lista.innerHTML = 'Cargando posts…';

    const { data: sessionData } = await supabase.auth.getUser();
    const user = sessionData?.user;

    if (!user) {
      lista.innerHTML = '<p>⚠️ Debes iniciar sesión.</p>';
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .select('id, contenido, creado_en')
      .eq('user_id', user.id)
      .order('creado_en', { ascending: false });

    if (error) {
      lista.innerHTML = '<p>❌ Error al cargar posts.</p>';
      return;
    }

    if (data.length === 0) {
      lista.innerHTML = '<p>No tienes posts aún.</p>';
      return;
    }

    lista.innerHTML = '';

    data.forEach(post => {
      const div = document.createElement('div');
      div.style = "padding:15px;border-bottom:1px solid #ddd";

      div.innerHTML = `
        <p>${post.contenido}</p>
        <small style="color:#777">${new Date(post.creado_en).toLocaleString()}</small>
      `;

      lista.appendChild(div);
    });
  }

  // ==============================
  // 🔹 Crear nuevo post
  // ==============================
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    mensaje.textContent = '';

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      mensaje.textContent = '⚠️ Debes iniciar sesión.';
      return;
    }

    const contenido = form.contenido.value.trim();

    if (!contenido) {
      mensaje.textContent = 'El post no puede estar vacío.';
      return;
    }

    const { error } = await supabase
      .from('posts')
      .insert([{ contenido, user_id: user.id }]);

    if (error) {
      mensaje.style.color = "red";
      mensaje.textContent = '❌ Error al publicar: ' + error.message;
      return;
    }

    mensaje.style.color = "green";
    mensaje.textContent = '✅ Post publicado';
    form.reset();
    cargarPosts();
  });

  // Inicializar
  cargarPosts();
}
