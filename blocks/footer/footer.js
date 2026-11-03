import { getMetadata } from '../../scripts/aem.js';
import { getContentRoot } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';

const AREAS = ['footer-logo', 'footer-menu', 'footer-contact', 'footer-legal'];

/**
 * Contact section: each item starts with an icon paragraph (`:globe:`, `:phone:`),
 * followed by its title and text.
 */
function decorateContact(section) {
  const wrapper = section.querySelector('.default-content-wrapper') || section;
  const items = [];
  [...wrapper.children].forEach((el) => {
    const isIcon = el.tagName === 'P' && el.querySelector('.icon') && !el.textContent.trim();
    if (isIcon || !items.length) {
      const item = document.createElement('div');
      item.className = 'footer-contact-item';
      items.push(item);
    }
    if (isIcon) el.classList.add('footer-contact-icon');
    items[items.length - 1].append(el);
  });
  const cols = items.map((item) => {
    const col = document.createElement('div');
    col.className = 'footer-contact-col';
    const text = document.createElement('div');
    text.className = 'footer-contact-text';
    [...item.children].filter((c) => !c.classList.contains('footer-contact-icon')).forEach((c) => text.append(c));
    item.append(text);
    col.append(item);
    return col;
  });
  wrapper.replaceChildren(...cols);
}

function buildBackToTop() {
  const button = document.createElement('a');
  button.href = '#';
  button.className = 'back-to-top';
  button.setAttribute('aria-label', 'Back to top');
  button.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  const onScroll = () => button.classList.toggle('show', window.scrollY > 300);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return button;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : `${getContentRoot()}/footer`;
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-inner';
  if (fragment) {
    [...fragment.querySelectorAll(':scope > .section')].forEach((section, i) => {
      if (AREAS[i]) section.classList.add(AREAS[i]);
      if (AREAS[i] === 'footer-contact') decorateContact(section);
      footer.append(section);
    });
  }
  block.append(footer, buildBackToTop());
}
