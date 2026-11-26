# Tom's Diner

Canonical repository: [villagealchemist/tomsdiner](https://github.com/villagealchemist/tomsdiner).

A shared home for personal, MySpace-inspired `.gay` pages. Kelsey's original page is already live at **koeventing.gay** and remains maintained in its existing repository. This pass does not migrate or republish it. Max Muerte is the first new page in this shared repository.

Each person's page has its own handcrafted markup, content, images, and theme. Common CSS components and browser behavior are shared where useful, while the layouts and creative direction can differ.

Max's page is MJ's creative vision board, presented through the internet of circa 2008. `maxmuerte.gay` is the intended home for this playful concept. `maxmuerte.com` remains a separate future official artist site whose direction will be developed with Max.

This preview uses HTML, CSS, and TypeScript with small Node scripts. Node 26 runs the TypeScript tools natively; the build uses Node's built-in `stripTypeScriptTypes` to produce the browser's `shared.js`. There are no runtime dependencies. Development type checks use pinned TypeScript 6.0.3 and Node type definitions 26.1.2.

## Preview locally

```sh
npm run build
npm run dev
```

Open http://127.0.0.1:4178/max-muerte/ in a browser. Rebuild after changing a template, theme, or profile value, then reload the page. The preview server disables browser caching.

`npm run check` checks only this project's two build/preview scripts and browser source with strict TypeScript settings. On a fresh checkout, run `npm install` to obtain the pinned development tools; building and previewing still work with Node alone.

## Source layout

| Path                             | Purpose                                                              |
| -------------------------------- | -------------------------------------------------------------------- |
| `src/shared.css`                 | Shared layout and reusable components                                |
| `src/shared.ts`                  | Shared browser interactions, stripped to JavaScript during the build |
| `people/max-muerte/index.html`   | Max's handcrafted page markup with `{{KEY}}` placeholders            |
| `people/max-muerte/profile.json` | Plain-text string values substituted into Max's page                 |
| `people/max-muerte/theme.css`    | Max's individual visual theme                                        |
| `people/max-muerte/assets/`      | Max's photographs and other page assets                              |
| `dist/max-muerte/`               | Complete generated static site for Max                               |

Profile strings are plain text. The build escapes `&`, `<`, `>`, double quotes, and single quotes when inserting values into the page. Put markup in the person's `index.html`, and use placeholders for text or quoted HTML attribute values. Keep public-facing claims and credits grounded in the artist's source material. The build rejects missing placeholders, unsupported unresolved markers, non-string profile values, and unsafe person slugs.

## Add another person

Add their own folder under `people/` with `index.html`, `profile.json`, `theme.css`, and `assets/`. Handcraft that person's markup, reuse the shared components and interactions where appropriate, and supply every placeholder used by their template. Then build that slug:

```sh
npm run build -- person-slug
```

Their preview will be available at `http://127.0.0.1:4178/person-slug/`. Building one person replaces only their generated output. Other people's builds remain intact.

## Independent domains

Each `dist/<person-slug>/` folder is a complete static website with its own `index.html` and `assets/`. Configure a separate static deployment for each person's domain, using the corresponding build command and output folder. For Max, the command is `npm run build -- max-muerte` and the output folder is `dist/max-muerte`.

Sharing a repository makes improvements to common components and behavior reusable. Separate markup, theme files, and deployments let each person's page develop its own style and release schedule. No hosting, domain routing, repository publication, or artist-account changes are performed by these scripts.
