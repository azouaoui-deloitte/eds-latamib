import { getMetadata } from '../../scripts/aem.js';
import { getContentRoot } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';

// desktop layout (inline menu, sticky bar) from the Elementor desktop breakpoint
const isDesktop = window.matchMedia('(min-width: 1025px)');

const normalizePath = (href) => {
  const { pathname } = new URL(href, window.location);
  return pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/(.)\/$/, '$1');
};

/**
 * Nav document (AEM page `nav`), one section per area:
 *  1. brand: desktop logo image, mobile logo image
 *  2. sections: list of links (main menu)
 *  3. tools: icon links, e.g. `:linkedin:` (social) and `:search:` (search form action)
 */
function parseNav(fragment) {
  const [brand, sections, tools] = [...fragment.querySelectorAll(':scope > .section')];
  return {
    logos: brand ? [...brand.querySelectorAll('picture')] : [],
    brandLink: brand?.querySelector('a[href]'),
    menu: sections?.querySelector('ul'),
    tools: tools ? [...tools.querySelectorAll('a[href]')] : [],
    sections: [brand, sections, tools],
  };
}

function toggleDrawer(nav, open) {
  const expanded = open ?? nav.getAttribute('aria-expanded') !== 'true';
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  nav.querySelector('.nav-hamburger button').setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  document.body.classList.toggle('nav-open', expanded);
  if (expanded) nav.querySelector('.nav-close')?.focus();
}

function toggleSearch(nav, open) {
  const search = nav.querySelector('.nav-search');
  if (!search) return;
  const expanded = open ?? search.getAttribute('aria-expanded') !== 'true';
  search.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  search.querySelector('button').setAttribute('aria-label', expanded ? 'Close search' : 'Search');
  if (expanded) search.querySelector('input').focus();
}

function buildSearch(link) {
  const url = new URL(link.href);
  const param = [...url.searchParams.keys()][0] || 's';
  const search = document.createElement('div');
  search.className = 'nav-search';
  search.setAttribute('aria-expanded', 'false');
  search.innerHTML = `<button type="button" class="nav-search-toggle" aria-label="Search"></button>
    <div class="nav-search-panel">
      <form role="search" method="get" action="${url.origin}${url.pathname}">
        <label><span class="nav-sr-only">Search for:</span>
          <input type="search" name="${param}" placeholder="Search …" autocomplete="off"></label>
        <button type="submit" aria-label="Submit search"></button>
      </form>
    </div>`;
  return search;
}

/**
 * loads and decorates the header (logo, menu, social link, mobile drawer and search)
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : `${getContentRoot()}/nav`;
  const fragment = await loadFragment(navPath);
  if (!fragment) return;
  const parsed = parseNav(fragment);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');
  nav.setAttribute('aria-label', 'Main');

  // brand
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const home = document.createElement('a');
  const homeHref = parsed.brandLink?.href || parsed.menu?.querySelector('a[href]')?.href || `${getContentRoot()}/`;
  home.href = homeHref;
  home.setAttribute('aria-label', 'Home');
  parsed.logos.forEach((pic, i) => {
    pic.classList.add(i === 0 ? 'nav-logo-desktop' : 'nav-logo-mobile');
    pic.querySelector('img')?.setAttribute('loading', 'eager');
    home.append(pic);
  });
  if (parsed.logos.length === 1) parsed.logos[0].classList.add('nav-logo-mobile');
  brand.append(home);

  // main menu (inline on desktop, drawer on tablet / mobile)
  const sections = document.createElement('div');
  sections.className = 'nav-sections';
  sections.id = 'nav-sections';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'nav-close';
  close.setAttribute('aria-label', 'Close navigation');
  close.addEventListener('click', () => toggleDrawer(nav, false));
  sections.append(close);
  if (parsed.menu) {
    const current = normalizePath(window.location.href);
    parsed.menu.querySelectorAll(':scope > li').forEach((li) => {
      const a = li.querySelector('a[href]');
      const sameOrigin = a && new URL(a.href, window.location).origin === window.location.origin;
      if (sameOrigin && normalizePath(a.href) === current) {
        li.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }
    });
    sections.append(parsed.menu);
  }

  // tools: social links (desktop) and search (tablet / mobile)
  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  parsed.tools.forEach((a) => {
    const icon = a.querySelector('.icon');
    const name = icon ? [...icon.classList].find((c) => c.startsWith('icon-') && c !== 'icon')?.substring(5) : '';
    if (name === 'search') {
      tools.append(buildSearch(a));
      return;
    }
    a.className = `nav-social nav-social-${name || 'link'}`;
    if (!a.getAttribute('aria-label')) a.setAttribute('aria-label', a.title || name);
    tools.append(a);
  });

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = '<button type="button" aria-controls="nav-sections" aria-label="Open navigation"><span class="nav-hamburger-icon"></span></button>';
  hamburger.querySelector('button').addEventListener('click', () => toggleDrawer(nav));
  tools.append(hamburger);

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.addEventListener('click', () => toggleDrawer(nav, false));

  nav.append(brand, sections, tools, overlay);

  // keep the Universal Editor instrumentation of the nav sections on their rendered areas
  [brand, sections, tools].forEach((area, i) => {
    const src = parsed.sections[i];
    if (!src) return;
    [...src.attributes].filter(({ name }) => name.startsWith('data-aue-')).forEach(({ name, value }) => area.setAttribute(name, value));
  });

  nav.querySelector('.nav-search-toggle')?.addEventListener('click', () => toggleSearch(nav));
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    if (nav.getAttribute('aria-expanded') === 'true') toggleDrawer(nav, false);
    toggleSearch(nav, false);
  });
  isDesktop.addEventListener('change', () => { toggleDrawer(nav, false); toggleSearch(nav, false); });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // sticky bar once the header has scrolled out of view (desktop)
  const onScroll = () => {
    navWrapper.classList.toggle('is-stuck', isDesktop.matches && window.scrollY > block.offsetHeight);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
