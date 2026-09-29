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

Update the website, printable poster, and downloadable call together when dates, eligibility, or submission details change. If the event is renamed, also update page titles, metadata, filenames, download links, and this documentation.

## Current content status

Event dates, the poster submission deadline, submission channel, final requirements, and poster dimensions are to be announced. No submission form is connected. The program is tentative, and potential speakers are omitted until confirmed. Hybrid workshop participation is planned; remote poster arrangements are unconfirmed.

The website is available locally. No hosted publication has been completed. The `dist` directory can be served by a static web host. Local Sites account metadata is excluded from Git; the original proposals, budgets, and CVs are not included in this repository.

## Image credit

Campus photograph: Daderot, *Rice University - Sally Port*, public domain. [Source and reuse information](https://commons.wikimedia.org/wiki/File:Rice_University_-_Sally_Port.JPG).
