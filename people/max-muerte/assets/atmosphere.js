const lightsSwitch = document.querySelector("[data-lights]");
if (lightsSwitch) {
  lightsSwitch.addEventListener("click", () => {
    const dimmed = document.body.dataset.lights !== "dim";
    if (dimmed) document.body.dataset.lights = "dim";
    else delete document.body.dataset.lights;
    lightsSwitch.setAttribute("aria-pressed", String(dimmed));
    lightsSwitch.innerHTML = `<span aria-hidden="true">◐</span> ${dimmed ? "Raise the lights" : "Dim the lights"}`;
  });
}

const finishes = document.querySelectorAll("button[data-material]");
const validFinishes = new Set(["blood", "ultraviolet", "silver"]);
function setFinish(finish) {
  if (!validFinishes.has(finish)) return;
  document.body.dataset.material = finish;
  for (const button of finishes) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.material === finish),
    );
  }
}
for (const button of finishes) {
  button.addEventListener("click", () => setFinish(button.dataset.material));
}

const stage = document.querySelector(".profile-stage");
const metalLight = document.querySelector("[data-metal-light]");
const sheen = document.querySelector("#max-logo-sheen");
const allowPointerLight = matchMedia(
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
);
if (stage && metalLight && sheen) {
  let frame = 0;
  let point = null;
  function restLight() {
    cancelAnimationFrame(frame);
    frame = 0;
    point = null;
    metalLight.setAttribute("azimuth", "230");
    metalLight.setAttribute("elevation", "42");
    sheen.setAttribute("gradientTransform", "translate(-.35 0)");
  }
  stage.addEventListener("pointermove", (event) => {
    if (!allowPointerLight.matches || event.pointerType === "touch") return;
    point = { x: event.clientX, y: event.clientY };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!point) return;
      const rect = stage.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (point.x - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (point.y - rect.top) / rect.height));
      metalLight.setAttribute("azimuth", String(Math.round(180 + x * 100)));
      metalLight.setAttribute(
        "elevation",
        String(Math.round(30 + (1 - y) * 30)),
      );
      sheen.setAttribute(
        "gradientTransform",
        `translate(${(x - 0.5).toFixed(3)} 0)`,
      );
    });
  });
  stage.addEventListener("pointerleave", restLight);
  allowPointerLight.addEventListener("change", restLight);
}
