# Latam IB — carte des blocs (home https://latamib.com/)

Même code de blocs dans `eds-latamib` (AEM + Universal Editor) et `eds-latamib-da` (da.live).
Blocs génériques : les variantes passent par les classes du bloc ou le style de la section.

| Zone prod (WordPress / Elementor / Slider Revolution) | AEM (xwalk) | DA | Modèle UE / champs |
| --- | --- | --- | --- |
| En-tête `#site-header` (logo, menu 7 liens, LinkedIn, recherche mobile, menu tiroir) | Composant AEM `latamib/components/header` dans l'XF header (éditeur classique) | Document `/nav` (3 sections : marque, menu, outils `:linkedin:` `:search:`) | Dialog : logos desktop/mobile, lien accueil, liens (multifield), réseau social, recherche |
| Slider Revolution `rs-module` (1 slide, titre + bouton) | bloc `hero` | bloc `hero` | `hero` : image, texte riche (h1 + lien **gras** = bouton) |
| About `aa4b47d` (2 colonnes, collage, lien flèche) | bloc `columns` dans une section `split` | idem | `columns` : cellules texte / image / bouton |
| Services `9a4c200` + `e3c4425` (titre, 2 cartes SA / CR) | texte + bloc `cards (services)` dans une section `dark, centered, services` | idem | `cards` → `card` : image (icône), texte riche |
| Équipe `9033ac5` + `5934387` (intro, 2 membres) | titre + texte + bloc `cards (team)` dans `centered, fluid, team` | idem | `card` : photo, texte riche (h3 lien + fonction) |
| Experience `6bf5692` (titre + image chiffres) | titre + bloc `image-link` dans `teal, centered, fluid, experience` | idem | `image-link` : image, alt, lien |
| Bandeau CTA `6bcc921` (fond carte, bouton contour) | bloc `cta` dans `grey, cta-band` | idem | `cta` : image de fond, alt, texte riche (lien ***gras italique*** = bouton contour) |
| Pied de page `.site-footer` (logo, menu, adresse, téléphone, mentions, retour en haut) | Composant AEM `latamib/components/footer` dans l'XF footer | Document `/footer` (logo, menu, contacts `:globe:` `:phone:`, mentions) | Dialog : logo, liens, contacts (multifield), mentions, copyright |

Boutons (décoration commune) : lien **gras** = `primary` (orange), *italique* = `secondary` (flèche),
***gras italique*** = `accent` (contour). Styles de section : `split`, `dark`, `teal`, `grey`, `centered`,
`fluid`, `services`, `team`, `experience`, `cta-band`.

## Règles de mise en page reprises de la source

- Conteneur Engitech : 720 / 940 / 1170 px de contenu à partir de 768 / 992 / 1230 px.
- Points de rupture Elementor : tablette 768–1024, desktop ≥ 1025 (en-tête burger jusqu'à 1024).
- Slider Revolution : niveau = plus petit niveau (1240 / 1024 / 778 / 480) strictement plus large que la
  fenêtre, grille 1200 / 1024 / 768 / 480 réduite (jamais agrandie), tailles de texte arrondies au pixel.
- Petit desktop (1025–1229) : colonne logo 209 px (logo 179 px), menu de 609 px débordant à gauche,
  en-tête 82 px.
- États : soulignement menu 0,3 s linéaire, couleur 0,2 s ease-out ; bouton slider `#007aff` +
  `brightness(120%)` 100 ms power1.inOut ; entrée du bouton 2,8 s power2.inOut après 0,62 s ; pas d'anneau
  de focus sur les liens (comme la source).
