const lightsSwitch = document.querySelector("[data-lights]");
if (lightsSwitch) {
  lightsSwitch.addEventListener("click", () => {
    const dimmed = document.body.dataset.lights !== "dim";
    if (dimmed) document.body.dataset.lights = "dim";
    else delete document.body.dataset.lights;
    lightsSwitch.setAttribute("aria-pressed", String(dimmed));
    lightsSwitch.innerHTML = `<span aria-hidden="true">◐</span> ${dimmed ? "Bring back the red" : "Dim the lights"}`;
  });
}
