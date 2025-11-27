import { supabase } from './supabase.js';

export function mostrarRegistro() {
  const app = document.getElementById('app');

  app.innerHTML = `
  <section style="
    max-width: 450px;
    margin: 40px auto;
    padding: 25px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.15);
    font-family: Arial, sans-serif;
  ">

    <h2 style="text-align:center; margin-bottom: 20px;">Crear cuenta</h2>

    <form id="registro-form" style="display:flex; flex-direction:column; gap:15px;">
      
      <input 
        type="text" 
        name="nombre" 
        placeholder="Nombre completo"
        required
        style="padding: 12px; border-radius: 8px; border:1px solid #ccc;"
      />

      <input 
        type="email" 
        name="correo" 
        placeholder="Correo"
        required
        style="padding: 12px; border-radius: 8px; border:1px solid #ccc;"
      />

      <input 
        type="password" 
        name="password" 
        placeholder="Contraseña"
        required
        style="padding: 12px; border-radius: 8px; border:1px solid #ccc;"
      />

      <input 
        type="text" 
        name="telefono" 
        placeholder="Teléfono"
        required
        style="padding: 12px; border-radius: 8px; border:1px solid #ccc;"
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
      >Registrarse</button>
    </form>

    <p id="error" style="color:red; margin-top:10px; text-align:center;"></p>

  </section>
  `;

  const form = document.getElementById('registro-form');
  const errorMsg = document.getElementById('error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    const nombre = form.nombre.value.trim();
    const correo = form.correo.value.trim();
    const password = form.password.value.trim();
    const telefono = form.telefono.value.trim();

    if (!nombre || !correo || !password || !telefono) {
      errorMsg.textContent = 'Completa todos los campos.';
      return;
    }

    // Crear usuario en auth
    const { data: dataAuth, error: errorAuth } = await supabase.auth.signUp({
      email: correo,
      password: password,
    });

    if (errorAuth) {
      errorMsg.textContent = `Error: ${errorAuth.message}`;
      return;
    }

    const uid = dataAuth.user?.id;
    if (!uid) {
      errorMsg.textContent = 'Error obteniendo el ID del usuario.';
      return;
    }

    // Guardar datos en la tabla usuarios
    const { error: errorInsert } = await supabase
      .from('usuarios')
      .insert([{ 
        id: uid, 
        nombre, 
        correo, 
        telefono 
      }]);

    if (errorInsert) {
      errorMsg.textContent = 'Error guardando datos: ' + errorInsert.message;
      return;
    }

    alert('Cuenta creada correctamente.');
  });
}
