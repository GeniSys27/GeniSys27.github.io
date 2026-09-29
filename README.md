# GeniSys 2027 workshop website

Website, printable event poster, and call for research posters for GeniSys 2027 at Rice University in Spring 2027. The workshop explores AI, systems, and networking for a sustainable future.

**Confirmed event:** GeniSys 2027, Spring 2027. The exact date remains to be announced. Track remaining decisions in [PROGRESS.md](PROGRESS.md).

## Included

- Responsive workshop website with phone, tablet, and desktop layouts, touch-friendly section navigation, research topics, a tentative program, and organizers.
- A dedicated [schedule page](https://yukewang96.github.io/GeniSys27/schedule.html) with the rough day overview.
- Venue information and a responsive Google Map for the Ralph S. O’Connor Building for Engineering and Science, fifth-floor conference room.
- A three-step poster submission flow with requirements, FAQs, and the Box form in one section.
- Call for posters welcoming recent research and previously published work.
- A3 event poster with a browser print / Save PDF control.
- A coordinated logo, browser tab icons, and touch icon; see [BRANDING.md](BRANDING.md).
- [Progress checklist](PROGRESS.md) and [change history](CHANGELOG.md).

## Preview locally

No package installation or build step is required. From the repository root, run:

```sh
python3 -m http.server 8765 --directory dist
```

Open [the website](http://localhost:8765/), [the printable poster](http://localhost:8765/poster.html), or [the poster call](http://localhost:8765/genisys-2027-call-for-posters.txt).

For the event poster, select **Print event poster**, then **Print / Save PDF**. Choose A3 portrait, disable browser headers and footers, and enable background graphics. Printing behavior depends on the browser; use a browser with print support if the embedded preview does not open a print dialog.

## Edit the materials

| File | Purpose |
| --- | --- |
| `dist/index.html` | Workshop page, tentative program, and poster call |
| `dist/schedule.html` | Detailed tentative schedule; homepage summarizes morning, lunch, and afternoon |
| `dist/styles.css` | Website styling and responsive layout |
| `dist/poster.html` | Printable event poster |
| `dist/poster.css` | Poster styling and A3 print layout |
| `dist/script.js` | Section navigation, sticky-header offsets, and poster print action |
| `dist/genisys-2027-call-for-posters.txt` | Downloadable call text |
| `dist/assets/` | Campus photograph, logo, browser tab icons, and touch icon |
| `.github/workflows/pages.yml` | Automatic GitHub Pages deployment of `dist` |
| `workshop.json` | Organizer-provided Box upload link |
| `scripts/update-submission.mjs` | Synchronize the Box link across all three materials |

Update the website, schedule, printable poster, and downloadable call together when dates, eligibility, or submission details change. If the event is renamed, also update page titles, metadata, filenames, download links, and this documentation.

## Current content status

The venue is the fifth-floor conference room in Rice University’s Ralph S. O’Connor Building for Engineering and Science. The embedded Google Map marks the building; a direct Google Maps link is available as a fallback.

The organizer-provided Box upload form is embedded in the poster submission section, with a direct Box link as a fallback. The same URL appears on the printable poster and in the downloadable call. The exact event date, the poster submission deadline, file requirements, and poster dimensions are to be announced. The program is tentative, and potential speakers are omitted until confirmed. Hybrid workshop participation is planned; remote poster arrangements are unconfirmed.

The public website repository is [YukeWang96/GeniSys27](https://github.com/YukeWang96/GeniSys27). The site is live at [yukewang96.github.io/GeniSys27/](https://yukewang96.github.io/GeniSys27/), verified September 29, 2026. The previous [planning repository](https://github.com/YukeWang96/Genisys-Workshop-Spring-2027) remains available separately.

Only the contents of `dist` are published. Local Sites account metadata is excluded from Git; the original proposals, budgets, and CVs are not included in this repository.

## Publish updates with GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes `dist` whenever `main` is pushed. No package installation, build service, custom domain, or paid hosting is required for this public repository. It follows [GitHub's custom Pages workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

For the initial repository setup, select **Settings → Pages → Build and deployment → Source → GitHub Actions**. Then push to `main` or run **Publish GeniSys 2027 website** from the Actions tab. Wait for a successful deployment before checking the public URL.

For later content changes, preview locally and commit the updated files, then run:

```sh
git push origin main
```

In this checkout, `origin` points to `GeniSys27`; `planning` preserves the previous repository remote. Relative URLs keep the site, assets, printable poster, and downloads working under the `/GeniSys27/` project path. Box continues to handle research poster uploads.

## Responsive layout

The homepage and schedule use fluid spacing and typography, with tablet layouts below 960px and phone adjustments below 600px. Key navigation and primary controls have touch targets of at least 44px. The header becomes non-sticky in short landscape viewports so it does not cover the content. The poster adapts for screen reading while retaining its A3 print rules.

The campus photo has 600px, 1000px, and 1800px sources; browsers choose a suitable image for the viewport and display density. Native links, keyboard focus, pinch zoom, reduced-motion preferences, and direct Box/Google Maps links remain available.

Checked in browser viewport simulations at 320, 360, 390, 540, 600, 601, 768, 820, 844, 960, 961, 1024, 1280, 1440, and 1920 pixels wide. These checks cover layout and interaction; they do not replace testing on every physical device or browser.

## Configure the Box upload link

To change the configured Box upload URL:

1. Set `boxUploadUrl` in `workshop.json` to the complete HTTPS Box URL.
2. Run `node scripts/update-submission.mjs` from the repository root. Node.js 18 or newer is sufficient; no package installation is needed.
3. Verify that the Box page accepts uploads from the intended participants, then commit the configuration and updated materials together.

This adds an **Upload your poster** button leading to the embedded form, provides a direct Box link as a fallback, puts the full URL on the printable poster, and includes it in the downloadable call. The embed uses the supplied 800 by 550 dimensions and scales to the available width. The website remains static; Box handles file uploads. Navigation and direct links work without the website's JavaScript, while the embedded Box form may require scripts and cookies from Box.

Leave `boxUploadUrl` as an empty string and run the same command to keep or restore the forthcoming state. The script validates the URL and content markers before writing changes. Do not edit inside the `box:` comment markers directly; those sections are regenerated. The exact event date, submission deadline, and file requirements remain to be announced until confirmed separately.

## Image credit

Campus photograph: Daderot, *Rice University - Sally Port*, public domain. [Source and reuse information](https://commons.wikimedia.org/wiki/File:Rice_University_-_Sally_Port.JPG).
