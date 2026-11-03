# Analyse de migration — latamib.com (accueil) vers AEM Edge Delivery Services (AEM authoring / UE)

- **Source** : https://latamib.com/ — WordPress 7.1.4, thème *Engitech*, Elementor 4.3.5, Slider Revolution 6.6.20, Yoast SEO
- **Cible** : page AEM `/content/latamib/index` (SDK local), éditée dans le Universal Editor, rendue par le code de ce dépôt
- **Méthode** : workflow Adobe `page-import` (scrape-webpage → identify-page-structure → authoring-analysis →
  generate-import-html → preview-import), puis `content-driven-development` / `building-blocks` / `ue-component-model`,
  *David's Model* (contenu par défaut d'abord, blocs minimaux), CSS mobile-first, réglage piloté par la mesure.

Preuves et outils (non versionnés) : `import-work/` — `shots/` (captures source + états), `styles-*.txt` / `styles.json`
(styles calculés), `sections/` (DOM rendu par section), `outline.json`, `measures/`, `compare/` (côte à côte), `tools/`.

## 1. Langues et arborescence

Le site est **monolingue anglais** (le `<html lang="es">` / `og:locale es_ES` de WordPress est un réglage par défaut :
aucun sélecteur de langue, aucune page traduite). Arborescence AEM, calquée sur les URL du site :

| latamib.com | AEM | Statut |
|---|---|---|
| `/` | `/content/latamib/index` | migrée |
| (en-tête) | `/content/latamib/nav` | migrée |
| (pied de page) | `/content/latamib/footer` | migrée |
| `/about/`, `/sale-acquisition/`, `/capital-raising/`, `/clients/`, `/contact/`, `/legal-information/` | — | non migrées : liens absolus `https://latamib.com/...` |

## 2. Système de design relevé

| Élément | Valeur |
|---|---|
| Points de rupture | tablette ≥ 768 px, desktop ≥ 1025 px (Elementor) |
| Conteneur | 1170 px desktop / 720 px tablette / 100 % − 30 px mobile ; gouttière 15 px (10 px pour les cartes et le CTA) |
| Texte | Nunito Sans 16/30 `#6d6d6d` ; paragraphes « About » et « Team » en Roboto 18/33.75 (justifiés pour About) |
| Titres | Montserrat 800 ; H2 36/48 (27/38 en mobile ; 27/48 pour About) ; `<br>` des titres masqué en mobile |
| Sur-titres (« // About ») | Nunito Sans 800 14/26.25 (15 px About, 12 px mobile) majuscules `#7cadd3` (`#8e88b8` sur fond marine) |
| Couleurs | marine `#052d57`, indigo `#262051` / `#332d5f` / `#211e3b`, sarcelle `#003d51`, bleu `#7cadd3` / `#43baff`, orange `#d87800`, gris `#f8f8f8` |
| Boutons | orange plein Nunito 500 (hero, survol `#007aff`) ; lien flèche Nunito Sans 700 14 `#003d51` ; contour blanc 14/800 majuscules (survol `#43baff`) |
| Icônes | Flaticon (recherche, flèches, globe, téléphone) et Font Awesome (LinkedIn, utilisateur, 2 icônes de services) → SVG dans `/icons` (masques CSS) |
| Polices | Montserrat, Nunito Sans, Roboto, Nunito : fichiers *latin* servis par la source, auto-hébergés dans `/fonts` (OFL / Apache 2.0) |

## 3. Structure de la page et décisions d'authoring

| # | Section source (Elementor) | Décision | AEM / EDS |
|---|---|---|---|
| 1 | Slider Revolution « Home 1 » (1 diapositive : image, titre animé lettre par lettre, bouton) | bloc | `hero` : image + richtext (H1 + **lien** = bouton). Grille 1200 px desktop, valeurs tablette fixes, mobile à l'échelle `100vw/480` comme le slider |
| 2 | « // About » + H2 + 3 paragraphes ; colonne droite (masquée < 1025 px) : collage d'images + « LEARN MORE ABOUT US » | contenu par défaut dans `columns` | section style `split` ; image 937 px qui déborde (marges −20/−22 px), lien *em* = bouton flèche |
| 3 | Bande marine : « // services » + H2 ; 2 boîtes de service | contenu par défaut + bloc | styles `dark, centered, services` + `cards (services)` : initiales en filigrane calculées depuis le titre (« Sale & Acquisitions » → SA), icône dans un quart de cercle, survol blanc/ombre |
| 4 | « // OUR TEAM » + « Senior Bankers » + texte ; 2 fiches associés | contenu par défaut + bloc | styles `centered, fluid, team` + `cards (team)` : photo, nom (lien), rôle ; onglet « contact » qui glisse au survol (même lien que le nom) |
| 5 | Bande sarcelle : « Experience » + infographie liée à `/clients/` | contenu par défaut + bloc | styles `teal, centered, fluid, experience` + `image-link` (image + lien) |
| 6 | Bande grise : bannière carte du monde « Let us help you grow your business » + « contact us » | bloc | style `grey, cta-band` + `cta` : image de fond + richtext (H2 + ***lien*** = bouton contour) |

Sur-titre : un paragraphe court placé juste avant un H2 devient le sur-titre (`p:has(+ h2)`), sans bloc ni champ dédié.
Métadonnées (Yoast) : titre « Latam IB - Mergers & Acquisitions and Capital Raising - Home - », description, image
sociale `fotos-personas-home.png` (propriété de page `image`), `nav` et `footer`.

## 4. En-tête et pied de page (pages AEM `nav` et `footer`)

**Page `nav`** — 3 sections : (1) logo desktop + logo mobile (composants Image), (2) liste des 7 liens,
(3) liens icônes `:linkedin:` (réseau social) et `:search:` (action du formulaire de recherche).

| Viewport | Comportement reproduit |
|---|---|
| ≥ 1025 px | barre 83 px : logo 259×82, menu Nunito Sans 700 16/35 (survol `#003d51`), soulignement animé 3 px `#43baff` (page courante et survol), rond LinkedIn 65 px `#2867b2` (survol blanc). **Barre collante** au défilement (fixe, ombre, glissement). |
| < 1025 px | barre 71 px : logo 140×44, loupe → panneau de recherche (champ + bouton, GET `https://latamib.com/?s=`), icône ✕ ; hamburger → **tiroir droit** 310 px (flèche de fermeture, 7 liens 14/600 séparés), voile noir 70 %, Échap / clic voile pour fermer. |

**Page `footer`** — 4 sections : logo blanc ; menu (masqué < 768 px) ; coordonnées (paragraphe icône `:globe:` /
`:phone:` + H6 + texte, regroupés automatiquement) ; mentions (lien « Legal Information » + copyright).
Fond `#211e3b` + motif `images/bg-footer.png` (décor, servi par le code). Bouton **retour en haut** (apparaît après 300 px).

## 5. Assets (DAM `/content/dam/latamib`)

| DAM | Source | Usage |
|---|---|---|
| `home/miami-tarde.png` (1904×614) | `2026/02/MIAMI-TARDE-1.png` | fond du hero |
| `home/fotos-personas-home.png` (952×571) | `2026/03/FOTOS-PERSONAS-HOME.png` | collage About, og:image |
| `home/icon-acquisitions.svg`, `home/icon-money-bill.svg` | SVG Font Awesome en ligne (blanc) | icônes des services |
| `home/alessio-mazzanti.png`, `home/roberto-sanchez.png` (1536 px) | rendus `-1536x…` des photos 2750 px | fiches équipe |
| `home/datos-experience.png` (1600×800) | `2024/04/DATOS-EXPERIENCE-WEB-3.png` | infographie Experience |
| `home/bg-map-dark.jpg` (1920×755) | `2020/03/bg-map-dark.jpg` | fond du CTA (devenu image éditable) |
| `global/logo-latam-ib.png`, `global/logo-latam-ib-mobile.png`, `global/logo-latam-ib-white.png` | logos de l'en-tête et du pied | nav / footer |

Images de fond CSS (hero, CTA) converties en vraies images authorables ; textes alternatifs repris tels quels (vides
quand la source est vide). Code : `images/bg-footer.png` (décor du pied), 10 SVG dans `/icons`.

## 6. Liens

Tous les `href` sont conservés : `https://latamib.com/about/`, `/sale-acquisition/`, `/capital-raising/`, `/clients/`,
`/contact/`, `/legal-information/`, `/about/#alessio1`, `/about/#roberto1`, `https://www.linkedin.com/company/latamib/`
(LinkedIn et menu « Posts »), `tel:+1 305-424-8894`, recherche `https://latamib.com/?s=`. « Home » et le logo pointent
vers la page migrée (`/content/latamib/index`).

## 7. Écarts fonctionnels assumés

| Source | Raison | EDS |
|---|---|---|
| Recherche WordPress (`?s=`) | moteur WordPress | le formulaire envoie vers `https://latamib.com/?s=…` (résultats sur le site source) |
| `target="_blank"` (menu « Posts », liens des services) | les champs lien AEM/UE n'ont pas de cible | ouverture dans le même onglet |
| Animation lettre par lettre du slider | découper le titre casserait l'édition en ligne du richtext | entrée en fondu/glissement du titre puis du bouton, désactivée dans l'éditeur et avec `prefers-reduced-motion` |
| Titre du hero tronqué à 768 px (largeur de calque 1009 px du slider) | défaut de la source, reproduit pour la fidélité | correction possible : `.hero .hero-content > div { width: calc(100% - 30px) }` dans le media query tablette |
| Panneau latéral « engitech » (contenu de démo du thème, hors écran) | jamais visible | non migré |
| JSON-LD Yoast, Google Fonts distants, scripts du thème | hors périmètre | métadonnées essentielles en propriétés de page ; polices auto-hébergées |
| `lang="es"` | contenu anglais | `lang="en"` |

## 8. Mesures (rendu EDS local vs latamib.com)

`import-work/tools/measure-page.mjs` compare la position (x, y du premier fragment de ligne) de chaque texte visible
(titres, paragraphes, liens, éléments de liste, boutons) de l'en-tête, du contenu et du pied, après défilement lent
(images paresseuses) et fin des animations. `sections-diff.mjs` compare les limites de sections.

| Viewport | Repères à ±3 px (x et y) | En-tête | Contenu | Pied | Hauteur page source / EDS |
|---|---|---|---|---|---|
| Desktop 1440 | **47 / 47 (100 %)** | 7/7 | 27/27 | 13/13 | 4845 / 4845 |
| Tablette 768 | **39 / 39 (100 %)** | — (logo + icônes) | 26/26 | 13/13 | 4682 / 4683 |
| Mobile 375 | **32 / 32 (100 %)** | — (logo + icônes) | 26/26 | 6/6 | 5891 / 5891 |

Limites de sections : ≤ 1 px d'écart sur les 3 viewports. États interactifs comparés (`states.mjs`) : survols (menu,
LinkedIn, bouton hero, lien flèche, cartes services et équipe, bouton contour, menu du pied), barre collante, bouton
retour en haut, tiroir mobile (liens aux mêmes coordonnées), panneau de recherche. Aucune erreur console, aucune 404.
Captures côte à côte : `import-work/compare/eds-{desktop,tablet,mobile}-side.png`, `mobile-states-side.png`.

Point de méthode : `aem up --html-folder` sert les fichiers `.plain.html` **sans doctype** (mode *quirks*, lignes
d'en-tête plus basses de 3 à 5 px). `tools/build-local.mjs` génère donc des documents complets (doctype + `head.html`
+ métadonnées), comme aem.page et le rendu AEM.

À refaire quand l'AEM local sera disponible : la même mesure sur `https://localhost:8443/content/latamib/index.html`
(`node import-work/tools/measure-page.mjs https://latamib.com/ https://localhost:8443/content/latamib/index.html desktop --auth=admin:admin`).
