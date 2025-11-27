export function setupCounter(element, options = {}) {
  let counter = options.start ?? 0;
  const title = options.title ?? "Contador";
  const color = options.color ?? "#1e40af";

  // ==== ESTILOS DE LA TARJETA ====
  element.style.padding = "20px";
  element.style.borderRadius = "12px";
  element.style.background = color;
  element.style.color = "white";
  element.style.width = "180px";
  element.style.cursor = "pointer";
  element.style.textAlign = "center";
  element.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  element.style.transition = "0.2s";

  element.onmouseenter = () => {
    element.style.transform = "scale(1.05)";
  };

  element.onmouseleave = () => {
    element.style.transform = "scale(1)";
  };

  // ==== HTML INTERNO ====
  element.innerHTML = `
    <h3 style="margin: 0; font-size: 18px;">${title}</h3>
    <p id="counter-number" style="font-size: 32px; font-weight: bold; margin-top: 8px;">
      ${counter}
    </p>
    <small>(Click para aumentar)</small>
  `;

  const numberEl = element.querySelector("#counter-number");

  // ==== FUNCIÓN DE ACTUALIZACIÓN ====
  const update = () => {
    numberEl.textContent = counter;
  };

  // ==== EVENTO DEL CONTADOR ====
  element.addEventListener("click", () => {
    counter++;
    update();
  });

  update();
}
