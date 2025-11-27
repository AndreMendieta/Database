import { supabase } from "./supabase.js";
import { mostrarRegistro } from "./register.js";
import { mostrarLogin } from "./login.js";
import { mostrarMVP } from "./mvp.js";
import { mostrarUser } from "./user.js";
import { mostrarAdmin } from "./admin.js";
import { mostrarPosts } from "./posts.js";   // ✅ NUEVO IMPORT

/* -------------------- RUTAS DISPONIBLES -------------------- */
const routes = {
  register: mostrarRegistro,
  login: mostrarLogin,
  actividades: mostrarMVP,
  usuarios: mostrarUser,
  posts: mostrarPosts,    // ✅ NUEVO COMPONENTE
  admin: mostrarAdmin
};

/* -------------------- CERRAR SESIÓN -------------------- */
async function cerrarSesion() {
  await supabase.auth.signOut();
  await cargarMenu();
  mostrarRegistro();
}

/* -------------------- MENÚ DINÁMICO -------------------- */
export async function cargarMenu() {
  const menu = document.getElementById("menu");
  if (!menu) return;

  const { data: { user } } = await supabase.auth.getUser();

  /* ESTILOS DEL MENÚ */
  menu.innerHTML = `
    <style>
      #menu { width: 100%; background: #f8f9fa; border-bottom: 1px solid #ddd; }
      #menu div { display: flex; gap: 10px; padding: 12px; flex-wrap: wrap; }
      #menu button {
        padding: 10px 18px; 
        border: none; 
        background: #4a90e2; 
        color: white;
        border-radius: 6px; 
        cursor: pointer; 
        font-size: 15px; 
        font-weight: 600; 
        transition: 0.25s ease;
      }
      #menu button:hover { background: #357ABD; }
      #menu button:active { transform: scale(0.95); }
    </style>
  `;

  let menuHTML = '<div>';

  if (!user) {
    /* VISITANTE */
    menuHTML += `
      <button data-action="register">Registrarse</button>
      <button data-action="login">Iniciar sesión</button>
    `;
  } else {
    /* USUARIO LOGUEADO */
    menuHTML += `
      <button data-action="actividades">Actividades</button>
      <button data-action="posts">Posts</button>      <!-- ✅ BOTÓN NUEVO -->
      <button data-action="usuarios">Perfil</button>
      <button data-action="logout">Cerrar sesión</button>
    `;

    /* OPCIONAL: ADMIN */
    if (user.email === "admin@mail.com") {
      menuHTML += `<button data-action="admin">Admin</button>`;
    }
  }

  menuHTML += '</div>';
  menu.innerHTML += menuHTML;

  /* -------------------- EVENTOS -------------------- */
  menu.querySelectorAll("button").forEach(btn => {
    const action = btn.getAttribute("data-action");

    if (action === "logout") {
      btn.addEventListener("click", cerrarSesion);
    } 
    else if (routes[action]) {
      btn.addEventListener("click", () => {
        routes[action]();
      });
    }
  });
}

/* -------------------- INICIO -------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  await cargarMenu();

  // Abrir página inicial según usuario
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) mostrarRegistro();
  else mostrarMVP();
});
