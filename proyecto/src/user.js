import { supabase } from "./supabase.js";

export async function mostrarUser() {
  const app = document.getElementById("app");

  app.innerHTML = `
  <section style="
    max-width: 480px;
    margin: 40px auto;
    padding: 25px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.15);
    font-family: Arial, sans-serif;
  ">

    <h2 style="text-align:center; margin-bottom:20px;">Perfil de Usuario</h2>

    <form id="user-form" style="display:flex; flex-direction:column; gap:15px;">

      <label style="font-weight:bold;">Nombre</label>
      <input 
        type="text" id="nombre" required
        style="padding:12px; border-radius:8px; border:1px solid #ccc;"
      />

      <label style="font-weight:bold;">Correo (solo lectura)</label>
      <input 
        type="email" id="correo" disabled
        style="padding:12px; border-radius:8px; border:1px solid #ccc; background:#f2f2f2;"
      />

      <label style="font-weight:bold;">Teléfono</label>
      <input 
        type="text" id="telefono"
        style="padding:12px; border-radius:8px; border:1px solid #ccc;"
      />

      <button type="submit"
        style="
          padding: 12px;
          background:#007bff;
          color:white;
          border:none;
          border-radius:8px;
          font-size:16px;
          cursor:pointer;
          font-weight:bold;
        "
      >
        Actualizar datos
      </button>
    </form>

    <p id="mensaje" style="margin-top:15px; text-align:center;"></p>
  </section>
  `;

  const form = document.getElementById("user-form");
  const mensaje = document.getElementById("mensaje");

  // Obtener usuario autenticado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    mensaje.textContent = "❌ Debes iniciar sesión.";
    return;
  }

  const uid = user.id;

  // Cargar datos desde tabla usuarios
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", uid)
    .single();

  if (error) {
    mensaje.style.color = "red";
    mensaje.textContent = "❌ Error cargando datos: " + error.message;
    return;
  }

  // Mostrar datos
  document.getElementById("nombre").value = data.nombre || "";
  document.getElementById("correo").value = data.correo || "";
  document.getElementById("telefono").value = data.telefono || "";

  // Guardar actualización
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    const { error: updateError } = await supabase
      .from("usuarios")
      .update({ nombre, telefono })
      .eq("id", uid);

    if (updateError) {
      mensaje.style.color = "red";
      mensaje.textContent = "❌ Error al actualizar: " + updateError.message;
    } else {
      mensaje.style.color = "green";
      mensaje.textContent = "✅ Datos actualizados correctamente";
    }
  });
}
