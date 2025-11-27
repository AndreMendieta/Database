import { supabase } from "./supabase.js";
import { mostrarRegistro } from "./register.js";
import { mostrarLogin } from "./login.js";
import { mostrarMVP } from "./mvp.js";
import { mostrarUser } from "./user.js";
import { mostrarAdmin } from "./admin.js";

/* -------------------- RUTAS DISPONIBLES -------------------- */
const routes = {
  register: mostrarRegistro,
  login: mostrarLogin,
  actividades: mostrarMVP,
  usuarios: mostrarUser,
  admin: mostrarAdmin
};

/* -------------------- CERRAR SESIÓN -------------------- */
async function CerrarSesion() {
  await supabase.auth.signOut();
  await cargarMenu();
  mostrarRegistro();
}

/* -------------------- MENÚ DINÁMICO -------------------- */
export async function cargarMenu() {
  const menu = document.getElementById("menu");
  if (!menu) return;

  const { data: { user } } = await supabase.auth.getUser();

  /* ESTILOS INCRUSTADOS */
  menu.innerHTML = `
    <style>
      #menu {
        width: 100%;
        background: #f8f9fa;
        border-bottom: 1px solid #ddd;
      }

      #menu div {
        display: flex;
        gap: 10px;
        padding: 12px;
      }

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

      #menu button:hover {
        background: #357ABD;
      }

      #menu button:active {
        transform: scale(0.95);
      }
    </style>
  `;

  /* MENÚ PARA VISITANTE */
  if (!user) {
    menu.innerHTML += `
      <div>
        <button data-action="register">Registrarse</button>
        <button data-action="login">Iniciar sesión</button>
      </div>
    `;
  }
  /* MENÚ PARA USUARIO LOGUEADO */
  else {
    menu.innerHTML += `
      <div>
        <button data-action="actividades">Actividades</button>
        <button data-action="usuarios">Perfil</button>
        <button data-action="logout">Cerrar sesión</button>

        ${user.email === "admin@mail.com" ? '<button data-action="admin">Admin</button>' : ""}
      </div>
    `;
  }

  /* EVENTOS */
  menu.querySelectorAll("button").forEach((btn) => {
    const action = btn.getAttribute("data-action");

    if (action === "logout") {
      btn.addEventListener("click", CerrarSesion);
    } else if (routes[action]) {
      btn.addEventListener("click", routes[action]);
    }
  });
}

/* -------------------- INICIO -------------------- */
document.addEventListener("DOMContentLoaded", cargarMenu);
