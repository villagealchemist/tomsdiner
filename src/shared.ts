interface Release {
  readonly title: string;
  readonly url: string;
}
const releases: readonly Release[] = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-track]"),
  (button) => ({
    title: button.dataset.title ?? "",
    url: button.dataset.url ?? "",
  }),
);
let selectedRelease = 0;
const trackButtons =
  document.querySelectorAll<HTMLButtonElement>("[data-track]");
function selectRelease(index: number): void {
  const nextIndex = (index + releases.length) % releases.length;
  const release = releases[nextIndex];
  if (!release) return;
  selectedRelease = nextIndex;
  const title = document.querySelector<HTMLElement>("[data-track-title]");
  const link = document.querySelector<HTMLAnchorElement>("[data-listen]");
  if (title) title.textContent = release.title;
  if (link) link.href = release.url;
  for (const button of trackButtons)
    button.setAttribute(
      "aria-pressed",
      String(Number(button.dataset.track) === nextIndex),
    );
}
for (const button of trackButtons)
  button.addEventListener("click", () =>
    selectRelease(Number(button.dataset.track)),
  );
document
  .querySelector("[data-next]")
  ?.addEventListener("click", () => selectRelease(selectedRelease + 1));
document
  .querySelector("[data-previous]")
  ?.addEventListener("click", () => selectRelease(selectedRelease - 1));
const themeButtons =
  document.querySelectorAll<HTMLButtonElement>("[data-theme]");
for (const button of themeButtons)
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;
    if (!theme || !/^[a-z][a-z0-9-]*$/.test(theme)) return;
    document.documentElement.dataset.layout = theme;
    for (const item of themeButtons)
      item.setAttribute("aria-pressed", String(item === button));
  });
const motion = document.querySelector<HTMLButtonElement>("[data-motion]");
motion?.addEventListener("click", () => {
  const paused = document.documentElement.dataset.motion !== "paused";
  document.documentElement.dataset.motion = paused ? "paused" : "enabled";
  motion.setAttribute("aria-pressed", String(paused));
  motion.textContent = paused ? "Let the glitter twinkle" : "Pause the glitter";
});
const dialog = document.querySelector<HTMLDialogElement>(".photo-dialog");
const image = document.querySelector<HTMLImageElement>("[data-viewer-image]");
const caption = document.querySelector<HTMLElement>("[data-viewer-caption]");
let previousFocus: HTMLElement | null = null;
for (const link of document.querySelectorAll<HTMLAnchorElement>("[data-photo]"))
  link.addEventListener("click", (event) => {
    if (!dialog || !image || !caption) return;
    event.preventDefault();
    previousFocus = link;
    image.src = link.href;
    image.alt = link.querySelector("img")?.alt ?? "Profile photograph";
    caption.textContent = link.dataset.caption ?? "";
    dialog.showModal();
  });
document
  .querySelector("[data-close-photo]")
  ?.addEventListener("click", () => dialog?.close());
dialog?.addEventListener("close", () => previousFocus?.focus());
dialog?.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom
  )
    dialog.close();
});
let heartCount = 0;
const heartStorageKey = `tomsdiner:${document.body.dataset.profile ?? location.pathname}:hearts`;
try {
  const saved = Number(localStorage.getItem(heartStorageKey));
  if (Number.isSafeInteger(saved) && saved > 0)
    heartCount = Math.min(saved, 9999);
} catch {
  /* Local storage is optional. */
}
const loveStatus = document.querySelector<HTMLElement>("[data-love-status]");
function updateHearts(): void {
  if (loveStatus && heartCount > 0)
    loveStatus.textContent = `${heartCount} little ${heartCount === 1 ? "heart" : "hearts"} left in this browser. ♡`;
}
updateHearts();
let toastTimer: ReturnType<typeof setTimeout> | undefined;
for (const button of document.querySelectorAll<HTMLButtonElement>(
  "[data-love]",
))
  button.addEventListener("click", () => {
    heartCount = Math.min(heartCount + 1, 9999);
    try {
      localStorage.setItem(heartStorageKey, String(heartCount));
    } catch {
      /* Hearts still work for the current visit. */
    }
    updateHearts();
    const toast = document.querySelector<HTMLElement>(".heart-toast");
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.hidden = false;
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 3000);
  });
