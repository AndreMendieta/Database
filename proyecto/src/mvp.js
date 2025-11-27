// src/mvp.js
import { supabase } from "./supabase.js";

export async function mostrarMVP() {

  const app = document.getElementById("app");

  app.innerHTML = `
  <style>
    #mvp {
      max-width: 1000px;
      margin: 40px auto;
      background: #f8fafc;
      padding: 25px;
      border-radius: 14px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.12);
      font-family: 'Segoe UI', sans-serif;
    }

    #mvp h2, #mvp h3 {
      text-align: center;
      color: #1e3a8a;
    }

    .seccion {
      margin-top: 25px;
    }

    #actividad-form input,
    #actividad-form textarea,
    #actividad-form select {
      width: 100%;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ddd;
      margin-bottom: 10px;
    }

    #actividad-form button {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      background: #2563eb;
      color: white;
      border: none;
      cursor: pointer;
      font-weight: bold;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 14px;
    }

    .actividad {
      background: white;
      padding: 14px;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    .propia { border-left: 5px solid #2563eb; }
    .externa { border-left: 5px solid #10b981; }

    .actividad img {
      max-width: 100%;
      border-radius: 8px;
      margin-top: 8px;
    }

    #mensaje {
      margin-top: 8px;
      text-align: center;
      font-weight: bold;
    }

    .badge {
      font-size: 12px;
      padding: 4px 8px;
      background: #e5e7eb;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 6px;
    }

  </style>

  <section id="mvp">
    <h2>Actividades Académicas</h2>

    <div class="seccion">
      <form id="actividad-form">
        <h3>Subir actividad propia</h3>

        <input type="text" name="titulo" placeholder="Título" required>

        <textarea name="descripcion" placeholder="Descripción"></textarea>

        <select name="tipo">
          <option value="tarea">Tarea</option>
          <option value="examen">Examen</option>
          <option value="proyecto">Proyecto</option>
          <option value="participacion">Participación</option>
          <option value="otro">Otro</option>
        </select>

        <select name="curso" id="select-curso" required>
          <option value="">Cargando cursos...</option>
        </select>

        <input type="text" name="imagen" placeholder="URL de imagen (opcional)">

        <button type="submit">Publicar actividad</button>
        <p id="mensaje"></p>
      </form>
    </div>


    <div class="seccion">
      <h3>Mis Actividades</h3>
      <div id="lista-mias" class="grid"></div>
    </div>

    <div class="seccion">
      <h3>Actividades de otros profesores</h3>
      <div id="lista-externas" class="grid"></div>
    </div>

  </section>
  `;

  const form = document.getElementById("actividad-form");
  const mensaje = document.getElementById("mensaje");
  const selectCurso = document.getElementById("select-curso");

  const listaMias = document.getElementById("lista-mias");
  const listaExternas = document.getElementById("lista-externas");


  // ========= USUARIO =========
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    mensaje.textContent = "Debes iniciar sesión";
    return;
  }


  // ========= CARGAR CURSOS =========
  async function cargarCursos() {

    const { data, error } = await supabase
      .from("cursos")
      .select("id, nombre")
      .order("nombre");

    if (error) {
      selectCurso.innerHTML = `<option>Error cargando cursos</option>`;
      return;
    }

    selectCurso.innerHTML = `<option value="">Selecciona un curso</option>`;
    data.forEach(curso => {
      const opt = document.createElement("option");
      opt.value = curso.id;
      opt.textContent = curso.nombre;
      selectCurso.appendChild(opt);
    });
  }


  // ========= CARGAR ACTIVIDADES =========
  async function cargarActividades() {

    const { data, error } = await supabase
      .from("actividades")
      .select(`
        id, titulo, descripcion, tipo, imagen, estudiante_id,
        cursos(nombre)
      `)
      .order("id", { ascending: false });

    if (error) {
      listaMias.innerHTML = "Error cargando actividades";
      listaExternas.innerHTML = "";
      return;
    }

    listaMias.innerHTML = "";
    listaExternas.innerHTML = "";

    data.forEach(act => {

      const box = document.createElement("div");
      box.className = "actividad";

      const esMia = act.estudiante_id === user.id;
      box.classList.add(esMia ? "propia" : "externa");

      box.innerHTML = `
        <span class="badge">${esMia ? "Mía" : "Profesor"}</span>
        <strong>${act.titulo}</strong><br>
        <small>${act.tipo}</small><br>
        <p>${act.descripcion || ""}</p>
        <small>Curso: ${act.cursos?.nombre || "N/A"}</small><br>
        ${act.imagen ? `<img src="${act.imagen}">` : ""}
      `;

      (esMia ? listaMias : listaExternas).appendChild(box);
    });

    if (!listaMias.children.length)
      listaMias.innerHTML = "<p>No tienes actividades propias.</p>";

    if (!listaExternas.children.length)
      listaExternas.innerHTML = "<p>No hay actividades externas.</p>";
  }


  // ========= REGISTRAR ACTIVIDAD =========
  form.onsubmit = async e => {

    e.preventDefault();
    mensaje.textContent = "Publicando...";

    const datos = new FormData(form);

    const nuevaActividad = {
      titulo: datos.get("titulo"),
      descripcion: datos.get("descripcion"),
      tipo: datos.get("tipo"),
      imagen: datos.get("imagen"),
      curso_id: datos.get("curso"),
      estudiante_id: user.id
    };

    const { error } = await supabase
      .from("actividades")
      .insert([nuevaActividad]);

    if (error) {
      mensaje.style.color = "red";
      mensaje.textContent = "Error publicando actividad";
      return;
    }

    mensaje.style.color = "green";
    mensaje.textContent = "Actividad publicada ✅";
    form.reset();
    cargarActividades();
  };


  // ========= INICIAR =========
  cargarCursos();
  cargarActividades();

}
