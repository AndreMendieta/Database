// src/register.js
import { supabase } from './supabase.js';

export function mostrarRegistro() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <section style="
      height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      background: linear-gradient(135deg, #1e3a8a, #3b82f6);
      font-family:'Segoe UI', sans-serif;
    ">

      <div style="
        width: 400px;
        background:white;
        padding: 35px;
        border-radius: 14px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.25);
        animation: aparecer .3s ease-out;
      ">

        <h2 style="text-align:center; margin-bottom: 20px; color:#1e3a8a; font-size:26px;">
          Crear Cuenta
        </h2>
        <p style="text-align:center; color:#555; margin-bottom:20px;">
          Regístrate para acceder al campus
        </p>

        <form id="registro-form" style="display:flex; flex-direction:column; gap:18px;">
          <input type="text" name="nombre" placeholder="Nombre completo" required style="padding:14px;border-radius:8px;border:1px solid #cbd5e1;font-size:15px;" />
          <input type="email" name="correo" placeholder="Correo institucional" required style="padding:14px;border-radius:8px;border:1px solid #cbd5e1;font-size:15px;" />
          <input type="password" name="password" placeholder="Contraseña" required style="padding:14px;border-radius:8px;border:1px solid #cbd5e1;font-size:15px;" />
          <input type="text" name="telefono" placeholder="Teléfono" required style="padding:14px;border-radius:8px;border:1px solid #cbd5e1;font-size:15px;" />

          <button id="btn-registrar" type="submit" style="
            padding: 12px;
            background:#1e40af;
            color:white;
            border:none;
            border-radius:8px;
            cursor:pointer;
            font-size:16px;
            font-weight:600;
            transition:0.25s;
          ">Registrarse</button>
        </form>

        <p id="error" style="color:red; margin-top:10px; text-align:center;"></p>

      </div>

      <style>
        @keyframes aparecer {
          from { opacity:0; transform: translateY(20px); }
          to { opacity:1; transform: translateY(0); }
        }

        #btn-registrar:hover {
          background:#162f8c;
          transform: scale(1.03);
        }
      </style>
    </section>
  `;

  const form = document.getElementById('registro-form');
  const errorMsg = document.getElementById('error');
  const btn = document.getElementById('btn-registrar');

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

    // Mostrar loading
    btn.disabled = true;
    btn.textContent = 'Registrando...';

    // Crear usuario en auth
    const { data: dataAuth, error: errorAuth } = await supabase.auth.signUp({
      email: correo,
      password
    });

    if (errorAuth) {
      btn.disabled = false;
      btn.textContent = 'Registrarse';
      errorMsg.textContent = `❌ ${errorAuth.message}`;
      return;
    }

    const uid = dataAuth.user?.id;
    if (!uid) {
      btn.disabled = false;
      btn.textContent = 'Registrarse';
      errorMsg.textContent = '❌ Error obteniendo el ID del usuario.';
      return;
    }

    // Guardar datos en la tabla usuarios
    const { error: errorInsert } = await supabase
      .from('usuarios')
      .insert([{ id: uid, nombre, correo, telefono }]);

    btn.disabled = false;
    btn.textContent = 'Registrarse';

    if (errorInsert) {
      errorMsg.textContent = '❌ Error guardando datos: ' + errorInsert.message;
      return;
    }

    alert('✅ Cuenta creada correctamente. Ahora puedes iniciar sesión.');
    form.reset();
  });
}
