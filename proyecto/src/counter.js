export function setupCounter(element) {
  let counter = 0;

  const update = () => {
    element.textContent = `count is ${counter}`;
  };

  element.addEventListener("click", () => {
    counter++;
    update();
  });

  update();
}
