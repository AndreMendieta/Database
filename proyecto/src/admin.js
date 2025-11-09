// src/admin.js
import { supabase } from "./supabase.js";

/**
 * Panel Administrativo
 * - Muestra estudiantes y actividades con JOIN
 * - Permite eliminar estudiantes
 * - Permite modificar notas
 */
export async function mostrarAdmin() {
  const app = document.getElementById("app");
  app.innerHTML = `
  <h2>Panel Administrativo</h2>

  <section id="panel" style="display:flex; gap:40px;">
    <div id="estudiantes" style="flex:1;"></div>
    <div id="actividades" style="flex:2;"></div>
  </section>

  <p id="mensaje"></p>
  `;

  const mensaje = document.getElementById("mensaje");
  const estudiantesDiv = document.getElementById("estudiantes");
  const actividadesDiv = document.getElementById("actividades");

  // ✅ Verificar sesión
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    app.innerHTML = "<p>⚠️ Debes iniciar sesión como administrador.</p>";
    return;
  }

  // ✅ Cargar estudiantes
  const { data: estudiantes, error: errorEst } = await supabase
    .from("estudiantes")
    .select("id, nombre, correo, telefono")
    .order("nombre", { ascending: true });

  if (errorEst) {
    estudiantesDiv.innerHTML = `<p>Error cargando estudiantes: ${errorEst.message}</p>`;
    return;
  }
if (user.email !== "daniel.diazd@uniagustiniana.edu.co") {
app.innerHTML = "<p>⛔ No tienes permisos para acceder a este panel.</p>";
return;
}
  estudiantesDiv.innerHTML = `
  <h3>👥 Lista de Estudiantes</h3>
  ${
    estudiantes.length === 0
      ? "<p>No hay estudiantes registrados.</p>"
      : `<ul>
        ${estudiantes.map(est => `
          <li>
            <strong>${escapeHtml(est.nombre)}</strong>
            (${escapeHtml(est.correo)}) - ${escapeHtml(est.telefono || "Sin teléfono")}
            <button class="borrar-estudiante" data-id="${est.id}">🗑 Eliminar</button>
          </li>
        `).join("")}
      </ul>`
  }
  `;

  // ✅ Cargar actividades + JOIN dinámico
  const { data: actividades, error: errorAct } = await supabase
    .from("actividades")
    .select(`
      id, titulo, descripcion, tipo, nota, imagen, creado_en,
      estudiantes(id, nombre, correo),
      cursos(id, nombre)
    `)
    .order("creado_en", { ascending: false });

  if (errorAct) {
    actividadesDiv.innerHTML = `<p>Error cargando actividades: ${errorAct.message}</p>`;
    return;
  }

  // helper join
  function getRelated(obj, names) {
    for (const name of names) {
      const v = obj[name];
      if (!v) continue;
      if (Array.isArray(v)) return v[0] || null;
      if (typeof v === "object") return v;
    }
    return null;
  }

  actividadesDiv.innerHTML = `
  <h3>📚 Actividades Registradas</h3>
  ${
    actividades.length === 0
      ? "<p>No hay actividades registradas.</p>"
      : `<ul>
        ${actividades.map(act => {
          const est = getRelated(act, ["estudiante", "estudiantes"]);
          const cur = getRelated(act, ["curso", "cursos"]);
          
          return `
          <li style="border-bottom: 1px solid #ccc; padding: 8px 0;">
            <strong>${escapeHtml(act.titulo)}</strong> (${escapeHtml(act.tipo)})
            <br>
            Estudiante: ${est ? escapeHtml(est.nombre) : "No disponible"} —
            Curso: ${cur ? escapeHtml(cur.nombre) : "No disponible"}
            <br>
            ${escapeHtml(act.descripcion || "")}
            <br>
            ${act.imagen ? `<img src="${escapeAttr(act.imagen)}" width="150">` : ""}
            <br>
            Nota: <input type="number" min="0" max="5" step="0.1" data-id="${act.id}" class="nota-input" value="${act.nota ?? ""}">
          </li>`;
        }).join("")}
      </ul>
      <button id="guardar-notas">💾 Guardar cambios</button>`
  }
  `;

  // ✅ Eliminar estudiante
  document.querySelectorAll(".borrar-estudiante").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      if (!confirm("¿Eliminar estudiante y sus actividades?")) return;
      const { error } = await supabase.from("estudiantes").delete().eq("id", id);
      if (error) return mensaje.textContent = "❌ Error: " + error.message;
      mensaje.textContent = "✅ Estudiante eliminado.";
      mostrarAdmin();
    };
  });

  // ✅ Guardar notas
  const guardarBtn = document.getElementById("guardar-notas");
  if (guardarBtn) {
    guardarBtn.onclick = async () => {
      const inputs = document.querySelectorAll(".nota-input");
      for (const i of inputs) {
        await supabase.from("actividades").update({ nota: i.value }).eq("id", i.dataset.id);
      }
      mensaje.textContent = "✅ Notas actualizadas.";
      mostrarAdmin();
    };
  }
}

// Helpers
function escapeHtml(str) {
  return String(str || "").replace(/[&<>"]/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[s]));
}
function escapeAttr(str) {
  return String(str || "").replace(/"/g, "&quot;");
}
