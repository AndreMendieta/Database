import { supabase } from "./supabase.js";

export async function mostrarUser() {
  const app = document.getElementById("app");

  if (!app) {
    console.error("No existe #app");
    return;
  }

  app.innerHTML = `
  <style>
    #perfil {
      max-width: 520px;
      margin: 40px auto;
      background: #fff;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      font-family: 'Segoe UI', sans-serif;
    }

    #perfil h2 {
      text-align: center;
      color: #1e3a8a;
      margin-bottom: 20px;
    }

    #perfil input, #perfil textarea {
      width: 100%;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ddd;
      margin-bottom: 10px;
    }

    #perfil button {
      margin-top: 15px;
      padding: 12px;
      width: 100%;
      background: #2563eb;
      border: none;
      border-radius: 8px;
      color: #fff;
      font-weight: bold;
      cursor: pointer;
    }

    #perfil button:hover {
      background: #1d4ed8;
    }

    #msg {
      margin-top: 12px;
      text-align: center;
      font-weight: bold;
    }
  </style>

  <div id="perfil">
    <h2>Mi Perfil</h2>

    <form id="formPerfil">
      <label>Nombre</label>
      <input type="text" id="nombre" required>

      <label>Correo</label>
      <input type="email" id="correo" disabled>

      <label>Sobre mí</label>
      <textarea id="sobre_mi" maxlength="300"></textarea>

      <label>
        <input type="checkbox" id="notificaciones"> Recibir notificaciones
      </label><br>

      <label>
        <input type="checkbox" id="boletin"> Suscribirse al boletín
      </label><br>

      <label>
        <input type="checkbox" id="perfil_publico"> Perfil público
      </label>

      <button type="submit">Guardar Cambios</button>
    </form>

    <p id="msg"></p>
  </div>
  `;

  const form = document.getElementById("formPerfil");
  const msg = document.getElementById("msg");

  // inputs
  const nombreInput = document.getElementById("nombre");
  const correoInput = document.getElementById("correo");
  const sobreMiInput = document.getElementById("sobre_mi");
  const notificacionesInput = document.getElementById("notificaciones");
  const boletinInput = document.getElementById("boletin");
  const perfilPublicoInput = document.getElementById("perfil_publico");

  // Usuario actual
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    app.innerHTML = "<p>Debes iniciar sesión.</p>";
    return;
  }

  // Buscar perfil
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    msg.innerHTML = "No se pudo cargar el perfil";
    console.error(error);
    return;
  }

  // cargar datos
  nombreInput.value = data.nombre || "";
  correoInput.value = user.email;
  sobreMiInput.value = data.sobre_mi || "";
  notificacionesInput.checked = data.notificaciones ?? false;
  boletinInput.checked = data.boletin ?? false;
  perfilPublicoInput.checked = data.perfil_publico ?? false;

  // guardar
  form.addEventListener("submit", async e => {
    e.preventDefault();
    msg.textContent = "Guardando...";

    const actualizacion = {
      nombre: nombreInput.value.trim(),
      sobre_mi: sobreMiInput.value.trim(),
      notificaciones: notificacionesInput.checked,
      boletin: boletinInput.checked,
      perfil_publico: perfilPublicoInput.checked
    };

    const { error } = await supabase
      .from("usuarios")
      .upsert([{ id: user.id, ...actualizacion }]);

    if (error) {
      msg.style.color = "red";
      msg.textContent = "❌ Error guardando";
      console.error(error);
    } else {
      msg.style.color = "green";
      msg.textContent = "✅ Perfil actualizado";
    }
  });
}
