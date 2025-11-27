// src/login.js
import { supabase } from "./supabase.js";
import { mostrarRegistro } from "./register.js";

export function mostrarLogin() {
  const app = document.getElementById("app");

  // ========== UI MODERNA Y ELEGANTE ==========
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
        width: 380px;
        background:white;
        padding: 35px;
        border-radius: 14px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.25);
        animation: aparecer .3s ease-out;
      ">

        <h2 style="text-align:center; margin-bottom: 20px; color:#1e3a8a; font-size:26px;">
          Acceso al Campus
        </h2>
        
        <p style="text-align:center; color:#555; margin-bottom:20px;">
          Inicia sesión para continuar
        </p>

        <form id="login-form" style="display:flex; flex-direction:column; gap:18px;">
          
          <input 
            type="email" 
            name="correo" 
            placeholder="Correo institucional"
            required
            style="
              padding:14px;
              border-radius:8px;
              border:1px solid #cbd5e1;
              font-size:15px;
            "
          />

          <input 
            type="password" 
            name="password" 
            placeholder="Contraseña"
            required
            style="
              padding:14px;
              border-radius:8px;
              border:1px solid #cbd5e1;
              font-size:15px;
            "
          />

          <button 
            id="btn-login"
            type="submit"
            style="
              padding: 12px;
              background:#1e40af;
              color:white;
              border:none;
              border-radius:8px;
              cursor:pointer;
              font-size:16px;
              font-weight:600;
              transition:0.25s;
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
            background:#10b981;
            color:white;
            border-radius:8px;
            font-size:15px;
            cursor:pointer;
            font-weight:600;
            transition:0.25s;
          "
        >Crear cuenta</button>

      </div>
    </section>

    <style>
      @keyframes aparecer {
        from { opacity:0; transform: translateY(20px); }
        to { opacity:1; transform: translateY(0); }
      }

      #btn-login:hover {
        background:#1d2f80;
        transform: scale(1.03);
      }

      #ir-registro:hover {
        background:#059669;
        transform: scale(1.03);
      }
    </style>
  `;

  // ========== ELEMENTOS ==========
  const form = document.getElementById("login-form");
  const errorMsg = document.getElementById("error");
  const irRegistro = document.getElementById("ir-registro");
  const btnLogin = document.getElementById("btn-login");

  // ========== IR AL REGISTRO ==========
  irRegistro.addEventListener("click", () => {
    mostrarRegistro();
  });

  // ========== LOGIN ==========
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";
    
    const correo = form.correo.value.trim();
    const password = form.password.value.trim();

    if (!correo || !password) {
      errorMsg.textContent = "Completa todos los campos.";
      return;
    }

    // Mostrar loading
    btnLogin.disabled = true;
    btnLogin.textContent = "Ingresando...";

    // Validar con Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password,
    });

    btnLogin.disabled = false;
    btnLogin.textContent = "Ingresar";

    if (error) {
      errorMsg.textContent = "❌ " + error.message;
      return;
    }

    // Login OK
    window.location.reload();
  });
}
