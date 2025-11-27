// src/admin.js
import { supabase } from "./supabase.js";

export async function mostrarAdmin() {
  // ====== ESTILOS MEJORADOS ======
  const style = document.createElement("style");
  style.textContent = `
    #admin-panel {
      max-width: 1200px;
      margin: 30px auto;
      padding: 20px;
      background: #f3f6fb;
      border-radius: 14px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.12);
      font-family: 'Segoe UI', sans-serif;
    }

    h2 {
      font-size: 28px;
      margin-bottom: 20px;
      font-weight: 700;
      color: #1e3a8a;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 25px;
      margin-top: 25px;
    }

    .box {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      max-height: 550px;
      overflow-y: auto;
      border-left: 5px solid #1e40af;
    }

    .box h3 {
      margin-bottom: 15px;
      font-size: 20px;
      font-weight: bold;
      color: #1e3a8a;
    }

    ul li {
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .small-info {
      font-size: 14px;
      color: #555;
    }

    .delete-btn {
      background: #dc2626;
      color: white;
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 5px;
      font-size: 14px;
    }

    #msg {
      margin-top: 20px;
      font-weight: bold;
      color: #065f46;
    }
  `;
  document.head.appendChild(style);

  // ====== HTML ======
  const app = document.getElementById("app");
  app.innerHTML = `
    <div id="admin-panel">
      <h2>Panel Administrativo Universitario</h2>

      <div class="grid">
        <div id="estudiantes-box" class="box"></div>
        <div id="cursos-box" class="box"></div>
        <div id="actividades-box" class="box"></div>
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

  // Cambia el correo admin aquí
  if (user.email !== "admin@uni.edu") {
    app.innerHTML = "<p>No tienes permisos de administrador.</p>";
    return;
  }

  // ===============================
  // MOSTRAR ESTUDIANTES
  // ===============================
  const { data: estudiantes, error: eErr } = await supabase
    .from("estudiantes")
    .select("*")
    .order("creado_en", { ascending: false });

  document.getElementById("estudiantes-box").innerHTML = `
    <h3>Estudiantes</h3>
    <ul>
      ${
        estudiantes?.map(
          e => `
        <li>
          <strong>${e.nombre}</strong><br>
          <span class="small-info">${e.correo}</span><br>
          <span class="small-info">${e.telefono ?? "-"}</span><br>
          <button class="delete-btn borrar-estudiante" data-id="${e.id}">
            Eliminar estudiante
          </button>
        </li>
      `
        ).join("") || "<p>No hay estudiantes</p>"
      }
    </ul>
  `;

  // ===============================
  // MOSTRAR CURSOS
  // ===============================
  const { data: cursos, error: cErr } = await supabase
    .from("cursos")
    .select("*")
    .order("fecha_inicio", { ascending: true });

  document.getElementById("cursos-box").innerHTML = `
    <h3>Cursos</h3>
    <ul>
      ${
        cursos?.map(
          c => `
        <li>
          <strong>${c.nombre}</strong><br>
          <span class="small-info">${c.descripcion ?? ""}</span><br>
          🗓 ${c.fecha_inicio} → ${c.fecha_fin}<br>
          <button class="delete-btn borrar-curso" data-id="${c.id}">
            Eliminar curso
          </button>
        </li>
      `
        ).join("") || "<p>No hay cursos</p>"
      }
    </ul>
  `;

  // ===============================
  // MOSTRAR ACTIVIDADES
  // ===============================
  const { data: actividades, error: aErr } = await supabase
    .from("actividades")
    .select("*, estudiantes(nombre), cursos(nombre)")
    .order("creado_en", { ascending: false });

  document.getElementById("actividades-box").innerHTML = `
    <h3>Actividades</h3>
    <ul>
      ${
        actividades?.map(
          a => `
        <li>
          <strong>${a.titulo}</strong><br>
          <span class="small-info">
            ${a.estudiantes?.nombre ?? "Estudiante eliminado"} — 
            ${a.cursos?.nombre ?? "Curso eliminado"}
          </span><br>
          📝 Tipo: ${a.tipo}<br>
          ⭐ Nota: ${a.nota ?? "N/A"}<br>
          <button class="delete-btn borrar-actividad" data-id="${a.id}">
            Eliminar actividad
          </button>
        </li>
      `
        ).join("") || "<p>No hay actividades</p>"
      }
    </ul>
  `;

  // ===============================
  // ELIMINAR ESTUDIANTE
  // ===============================
  document.querySelectorAll(".borrar-estudiante").forEach(btn => {
    btn.onclick = async () => {
      await supabase.from("estudiantes").delete().eq("id", btn.dataset.id);
      msg.textContent = "Estudiante eliminado.";
      mostrarAdmin();
    };
  });

  // ===============================
  // ELIMINAR CURSO
  // ===============================
  document.querySelectorAll(".borrar-curso").forEach(btn => {
    btn.onclick = async () => {
      await supabase.from("cursos").delete().eq("id", btn.dataset.id);
      msg.textContent = "Curso eliminado.";
      mostrarAdmin();
    };
  });

  // ===============================
  // ELIMINAR ACTIVIDAD
  // ===============================
  document.querySelectorAll(".borrar-actividad").forEach(btn => {
    btn.onclick = async () => {
      await supabase.from("actividades").delete().eq("id", btn.dataset.id);
      msg.textContent = "Actividad eliminada.";
      mostrarAdmin();
    };
  });
}
