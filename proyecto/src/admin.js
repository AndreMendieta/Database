// src/admin.js
import { supabase } from "./supabase.js";

export async function mostrarAdmin() {

  // ====== ESTILOS ======
  const style = document.createElement("style");
  style.textContent = `
    #admin-panel {
      max-width: 1100px;
      margin: 20px auto;
      padding: 20px;
      background: #fafafa;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      font-family: Arial;
    }

    .flex {
      display: flex;
      gap: 30px;
      margin-top: 20px;
    }

    .box {
      background: white;
      padding: 20px;
      border-radius: 10px;
      flex: 1;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      max-height: 600px;
      overflow-y: auto;
    }

    .box h3 {
      margin-bottom: 10px;
      font-size: 18px;
      font-weight: bold;
    }

    ul li {
      padding: 12px 0;
      border-bottom: 1px solid #ddd;
    }

    button {
      background: #d9534f;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 5px;
    }

    #msg {
      margin-top: 20px;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);

  // ====== HTML ======
  const app = document.getElementById("app");
  app.innerHTML = `
    <div id="admin-panel">
      <h2>Panel Administrativo</h2>
      <div class="flex">
        <div id="usuarios-box" class="box"></div>
        <div id="posts-box" class="box"></div>
      </div>
      <p id="msg"></p>
    </div>
  `;

  const msg = document.getElementById("msg");

  // ===============================
  // VALIDAR ADMIN
  // ===============================
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    app.innerHTML = "<p>Debes iniciar sesión.</p>";
    return;
  }

  // tu admin está registrado como:
  // admin@correo.com
  if (user.email !== "admin@correo.com") {
    app.innerHTML = "<p>No tienes permisos de administrador.</p>";
    return;
  }

  // ===============================
  // CARGAR USUARIOS
  // ===============================
  const { data: usuarios, error: uErr } = await supabase
    .from("usuarios")
    .select("*")
    .order("creado_en", { ascending: false });

  if (uErr) {
    document.getElementById("usuarios-box").innerHTML = "Error cargando usuarios.";
    return;
  }

  document.getElementById("usuarios-box").innerHTML = `
    <h3>Usuarios Registrados</h3>
    <ul>
      ${usuarios
        .map(
          u => `
        <li>
          <strong>${u.nombre}</strong> (@${u.username})<br>
          ${u.correo}<br>
          <button data-uid="${u.id}" class="borrar-usuario">Eliminar usuario</button>
        </li>
      `
        )
        .join("")}
    </ul>
  `;

  // ===============================
  // CARGAR POSTS
  // ===============================
  const { data: posts, error: pErr } = await supabase
    .from("posts")
    .select(`id, contenido, creado_en, usuarios(id, nombre, username)`)
    .order("creado_en", { ascending: false });

  if (pErr) {
    document.getElementById("posts-box").innerHTML = "Error cargando posts.";
    return;
  }

  document.getElementById("posts-box").innerHTML = `
    <h3>Posts</h3>
    <ul>
      ${posts
        .map(
          p => `
        <li>
          <strong>${p.usuarios?.nombre || "Usuario eliminado"}</strong>
          (@${p.usuarios?.username || "-"})<br>
          ${p.contenido}<br>
          <button data-pid="${p.id}" class="borrar-post">Eliminar post</button>
        </li>
      `
        )
        .join("")}
    </ul>
  `;

  // ===============================
  // ELIMINAR USUARIO
  // ===============================
  document.querySelectorAll(".borrar-usuario").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.uid;

      await supabase.from("usuarios").delete().eq("id", id);
      msg.textContent = "Usuario eliminado.";
      mostrarAdmin();
    };
  });

  // ===============================
  // ELIMINAR POST
  // ===============================
  document.querySelectorAll(".borrar-post").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.pid;

      await supabase.from("posts").delete().eq("id", id);
      msg.textContent = "Post eliminado.";
      mostrarAdmin();
    };
  });
}
