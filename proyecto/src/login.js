// src/login.js
import { supabase } from './supabase.js';
import { mostrarRegistro } from './register.js';

export function mostrarLogin() {
  const app = document.getElementById('app');

  app.innerHTML = `
  <section style="
    max-width: 400px;
    margin: 40px auto;
    padding: 25px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.15);
    font-family: Arial, sans-serif;
  ">

    <h2 style="text-align:center; margin-bottom: 20px;">Iniciar Sesión</h2>

    <form id="login-form" style="display:flex; flex-direction:column; gap:15px;">
      <input 
        type="email" 
        name="correo" 
        placeholder="Correo"
        required
        style="padding:12px;border-radius:8px;border:1px solid #ccc;"
      />

      <input 
        type="password" 
        name="password" 
        placeholder="Contraseña"
        required
        style="padding:12px;border-radius:8px;border:1px solid #ccc;"
      />

      <button 
        type="submit"
        style="
          padding: 12px;
          background:#007bff;
          color:white;
          border:none;
          border-radius:8px;
          cursor:pointer;
          font-size:16px;
          font-weight:bold;
        "
      >Ingresar</button>
    </form>

    <p id="error" style="color:red; margin-top:10px; text-align:center;"></p>

    <button id="ir-registro"
      style="
        width:100%;
        margin-top:20px;
        padding:10px;
        border:none;
        background:#28a745;
        color:white;
        border-radius:8px;
        font-size:15px;
        cursor:pointer;
      "
    >Crear cuenta</button>

  </section>
  `;

  const form = document.getElementById('login-form');
  const errorMsg = document.getElementById('error');
  const irRegistro = document.getElementById('ir-registro');

  // 🔹 Ir al registro
  irRegistro.addEventListener('click', () => {
    mostrarRegistro();
  });

  // 🔹 Login
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    const correo = form.correo.value.trim();
    const password = form.password.value.trim();

    if (!correo || !password) {
      errorMsg.textContent = 'Completa todos los campos.';
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: password
    });

    if (error) {
      errorMsg.textContent = '❌ ' + error.message;
      return;
    }

    // Login OK → Recargar página para refrescar estado global
    location.reload();
  });
}
