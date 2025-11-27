import { supabase } from "./supabase.js";

export async function mostrarPosts() {

  const app = document.getElementById("app");

  app.innerHTML = `
    <style>
      #posts-box {
        max-width: 800px;
        margin: auto;
        font-family: system-ui;
      }

      #post-form {
        background: #f1f5f9;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 15px;
      }

      textarea {
        width: 100%;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #ddd;
        resize: none;
      }

      button {
        margin-top: 8px;
        width: 100%;
        padding: 10px;
        background: #2563eb;
        color: white;
        border: none;
        font-weight: 600;
        cursor: pointer;
        border-radius: 6px;
      }

      button:hover { background: #1d4ed8 }

      .post {
        background: white;
        border-radius: 10px;
        padding: 12px;
        box-shadow: 0 1px 4px rgba(0,0,0,.1);
        margin-bottom: 10px;
      }

      .user { font-weight: bold; color:#1e3a8a }
      .date { font-size: 12px; color: gray }
    </style>

    <div id="posts-box">

      <h2>💬 Publicaciones</h2>

      <form id="post-form">
        <textarea id="contenido" placeholder="Escribe algo..." required></textarea>
        <button>Publicar</button>
        <p id="msg"></p>
      </form>

      <div id="lista-posts"></div>

    </div>
  `;

  const form = document.getElementById("post-form");
  const contenido = document.getElementById("contenido");
  const lista = document.getElementById("lista-posts");
  const msg = document.getElementById("msg");

  // ---------------------------------------
  // OBTENER USUARIO
  // ---------------------------------------
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    app.innerHTML = "<h3>Debes iniciar sesión</h3>";
    return;
  }

  // ---------------------------------------
  // CARGAR POSTS
  // ---------------------------------------
  async function cargarPosts() {

    const { data } = await supabase
      .from("posts")
      .select(`
        id, contenido, creado_en,
        usuarios(nombre, username)
      `)
      .order("creado_en", { ascending: false });

    lista.innerHTML = "";

    data.forEach(post => {

      lista.innerHTML += `
        <div class="post">
          <div class="user">${post.usuarios.nombre} (@${post.usuarios.username})</div>
          <div>${post.contenido}</div>
          <div class="date">${new Date(post.creado_en).toLocaleString()}</div>
        </div>
      `;
    });
  }

  // ---------------------------------------
  // PUBLICAR
  // ---------------------------------------
  form.onsubmit = async e => {

    e.preventDefault();

    const { error } = await supabase.from("posts").insert([{
      user_id: user.id,
      contenido: contenido.value.trim()
    }]);

    if (error) {
      msg.textContent = "Error al publicar";
      return;
    }

    contenido.value = "";
    msg.textContent = "✅ Publicado";
    cargarPosts();
  };

  cargarPosts();
}
