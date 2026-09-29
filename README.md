# GeniSys workshop website

Website, printable event poster, and call for research posters for the GeniSys workshop at Rice University. The workshop explores AI, systems, and networking for a sustainable future.

**Version 0.1.0:** The first draft uses **GeniSys 2026** from the event proposal. This repository is named **Genisys-Workshop-Spring-2027**. Confirm the intended event year before distributing the materials; track this and other outstanding decisions in [PROGRESS.md](PROGRESS.md).

## Included

- Responsive workshop website with research topics, a tentative program, and organizers.
- Call for posters welcoming recent research and previously published work.
- A3 event poster with a browser print / Save PDF control.
- [Progress checklist](PROGRESS.md) and [change history](CHANGELOG.md).

## Preview locally

No package installation or build step is required. From the repository root, run:

```sh
python3 -m http.server 8765 --directory dist
```

Open [the website](http://localhost:8765/), [the printable poster](http://localhost:8765/poster.html), or [the poster call](http://localhost:8765/genisys-2026-call-for-posters.txt).

For the event poster, select **View / print event poster**, then **Print / Save PDF**. Choose A3 portrait, disable browser headers and footers, and enable background graphics. Printing behavior depends on the browser; use a browser with print support if the embedded preview does not open a print dialog.

## Edit the materials

| File | Purpose |
| --- | --- |
| `dist/index.html` | Workshop page, tentative program, and poster call |
| `dist/styles.css` | Website styling and responsive layout |
| `dist/poster.html` | Printable event poster |
| `dist/poster.css` | Poster styling and A3 print layout |
| `dist/script.js` | Poster print action |
| `dist/genisys-2026-call-for-posters.txt` | Downloadable call text |
| `dist/assets/` | Campus photograph and favicon |
| `workshop.json` | Organizer-provided Box upload link |
| `scripts/update-submission.mjs` | Synchronize the Box link across all three materials |

Update the website, printable poster, and downloadable call together when dates, eligibility, or submission details change. If the event is renamed, also update page titles, metadata, filenames, download links, and this documentation.

## Current content status

Research posters will be submitted through a Box upload link. The link has not yet been provided, so no upload button is active. Event dates, the poster submission deadline, file requirements, and poster dimensions are to be announced. The program is tentative, and potential speakers are omitted until confirmed. Hybrid workshop participation is planned; remote poster arrangements are unconfirmed.

The website is available locally. No hosted publication has been completed. The `dist` directory can be served by a static web host. Local Sites account metadata is excluded from Git; the original proposals, budgets, and CVs are not included in this repository.

## Configure the Box upload link

When the organizer supplies the Box upload URL:

1. Set `boxUploadUrl` in `workshop.json` to the complete HTTPS Box URL.
2. Run `node scripts/update-submission.mjs` from the repository root. Node.js 18 or newer is sufficient; no package installation is needed.
3. Verify that the Box page accepts uploads from the intended participants, then commit the configuration and updated materials together.

This adds an **Upload your poster to Box** button to the website, puts the full URL on the printable poster, and includes it in the downloadable call. The output remains plain static HTML and text, so visitors do not need JavaScript for the upload link.

Leave `boxUploadUrl` as an empty string and run the same command to keep or restore the forthcoming state. The script validates the URL and content markers before writing changes. Do not edit inside the `box:` comment markers directly; those sections are regenerated. Dates, deadlines, and file requirements remain to be announced until confirmed separately.

## Image credit

Campus photograph: Daderot, *Rice University - Sally Port*, public domain. [Source and reuse information](https://commons.wikimedia.org/wiki/File:Rice_University_-_Sally_Port.JPG).
