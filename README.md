# Latam IB on AEM Edge Delivery Services (AEM authoring / Universal Editor)

Migration of [latamib.com](https://latamib.com/) (WordPress + Elementor + Slider Revolution) to
AEM Edge Delivery Services with **AEM authoring (xwalk)**: pages live in AEM Sites
(`/content/latamib`), are edited in the **Universal Editor**, and are rendered with the EDS code of this repository.

- Code: this repository (based on [adobe-rnd/aem-boilerplate-xwalk](https://github.com/adobe-rnd/aem-boilerplate-xwalk))
- Code bus: `https://main--eds-latamib--azouaoui-deloitte.aem.page/` (AEM Code Sync GitHub App)
- Local authoring: AEM SDK author `http://localhost:4602`, HTTPS proxy `https://localhost:8443`, local UE Service `https://localhost:8000`

## Documentation

- [docs/migration/latamib-home.md](docs/migration/latamib-home.md) – home page analysis, block mapping, assets, links, gaps, measurements
- [docs/aem-ue-local.md](docs/aem-ue-local.md) – local AEM setup, content package, services, opening the Universal Editor

## Blocks

| Block | Use | Content model |
|---|---|---|
| `hero` | Full-width image + heading + button (replaces the Revolution slider) | image, imageAlt, text (richtext) |
| `columns` | About: text column + overflowing collage + arrow link (section style `split`) | core Columns |
| `cards` (`services`, `team`) | Service cards (watermark initials, icon) / team cards (photo, name, role, contact tab) | container `cards` (classes) + item `card` (image, imageAlt, text) |
| `image-link` | Linked infographic (Experience → Clients) | image, imageAlt, link |
| `cta` | Call-to-action banner with background image | image, imageAlt, text (richtext) |
| `header`, `footer` | Built from the AEM pages `nav` and `footer` | sections of those pages |

## Development

```sh
npm i
npm run lint
npm run build:json   # merge models/_*.json + blocks/*/_*.json into component-*.json
aem up               # code + AEM content (needs the local AEM author)
```

Local preview without AEM (content snapshot in the git-ignored `import-work/`):

```sh
node import-work/tools/build-local.mjs
aem up --html-folder content --no-open --port 3001
# http://localhost:3001/content/latamib/index
```
