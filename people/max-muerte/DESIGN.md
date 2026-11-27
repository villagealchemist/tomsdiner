# Max Muerte: design references

## Confirmed font families

MJ and Max selected these four families together. MJ supplied the reference screenshot on November 26, 2026.

| Family             | Foundry or collection shown | Fonts shown |
| ------------------ | --------------------------- | ----------- |
| Darka              | Sudtipos                    | 1           |
| Gothique MN        | Mecanorma Collection        | 1           |
| Fayte Pixel        | That That Type              | 2           |
| P22 Canterbury Pro | P22 Type Foundry            | 1           |

These are confirmed references for future design work. The screenshot does not specify a primary family, a final pairing, or assignments for the name, headings, navigation, and body copy. Do not treat one family as the winner or assume that all four must appear together.

## Next typography pass

Compare the selected families against Max's page and refine their roles with MJ and Max. Keep a legible body font alongside the more expressive display typography. The current implementation below is the first trial, not a final brand decision.

When a role is selected for implementation, use the approved webfont embed or supplied assets. The screenshot identifies the families but does not provide embed details, font files, or the specific styles within each family.

## Current personal-space direction

MJ rejected the flat PNG inserted into the editorial layout and explicitly asked for creative work from the layered Photoshop source on November 27, 2026. The current composition treats the logo, portrait, red light, and profile panels as one customized personal space.

The original letter contours come from Layer 2 of `RED_Max_Muerte_FONT.psd`, exported as a transparent SVG with new red gradient and bevel lighting. The name crosses the framed portrait instead of sitting inside an opaque black rectangle. Compact navigation, oxblood window panels, individually designed Top 8 tiles, and a functional light switch recall a heavily customized 2008 profile. MJ's vision-board attribution lives in the footer.

At phone widths, the name, face, profile description, and contact links are assembled into a compact opening. The real photograph and photo credits remain intact. Shared JavaScript handles the photo viewer and local guestbook hearts; Max's own `assets/atmosphere.js` controls the red illumination. Slow ambient movement respects `prefers-reduced-motion`. There is no invented player, online status, audience count, or public guestbook submission.

Fayte Pixel Hard supports the actual logo on profile headings, with Verdana and monospace details for reading. Darka, Gothique MN, and P22 Canterbury Pro remain in the shortlist. These are implementation choices for MJ and Max to react to, not a claim that they selected a final brand system.

Adobe Fonts web project: `maxmuerte.gay`, ID `wop5ols`. Embed: `https://use.typekit.net/wop5ols.css`. CSS family: `"fayte-pixel-hard"`, normal, 400. The project contains the Hard style only and was created in MJ's existing Adobe account on November 26, 2026.

## Interactive material study

The page now offers three authored finishes for Max's PSD-derived lettering: Blood red, Ultraviolet, and Silver. Each has its own reflection bands, edge color, specular light, and supporting room illumination. The portrait is never recolored by these controls. The default remains Blood red, and selections last for the current page visit.

The canonical SVG geometry is embedded inline so its lighting can respond to a fine pointer over the opening profile composition. It uses one queued animation frame at a time, rests when the pointer leaves, and disables pointer-following for touch and reduced-motion preferences. The existing light dimmer remains independent of the chosen finish.
