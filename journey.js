// journey.js: turns the stacked CV on journey.html into a book you page through.
// If JavaScript is switched off or fails, nothing breaks: every role is still
// shown, one after another, like a normal CV.

// ----- 1. Find the parts of the page we need -----
const viewport = document.querySelector('.journey-viewport');
const track = document.querySelector('.journey-track');
const pages = Array.from(document.querySelectorAll('.journey-page-item'));
const nav = document.querySelector('.journey-nav');
const prevButton = document.querySelector('.journey-prev');
const nextButton = document.querySelector('.journey-next');
const spine = document.querySelector('.journey-spine');
const counter = document.querySelector('#journey-counter');

// ----- 2. State: the one thing this page has to remember -----
let current = 0; // which page we're on, counting from 0

// ----- 3. Switch on book mode -----
document.body.classList.add('is-book'); // turns on the "Book mode" rules in journey.css
nav.hidden = false;                     // shows the navigation bar

// ----- 4. Build the year strip from each page's data-label -----
const spineButtons = pages.map((page, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'spine-button';
  button.setAttribute('aria-label', 'Go to ' + page.dataset.label);

  const dot = document.createElement('span');
  dot.className = 'spine-dot';
  dot.setAttribute('aria-hidden', 'true');

  const text = document.createElement('span');
  text.textContent = page.dataset.label;

  button.append(dot, text);
  button.addEventListener('click', () => goTo(index));

  const item = document.createElement('li');
  item.append(button);
  spine.append(item);
  return button;
});

// ----- 5. The functions that turn the page -----

// Make the viewport exactly as tall as the page on show, so short pages
// don't leave a gap above the navigation bar.
function fitHeight() {
  viewport.style.height = pages[current].offsetHeight + 'px';
}

// updateAddress = true is a "default parameter": if a call doesn't say otherwise, it's true.
function goTo(index, updateAddress = true) {
  // Keep the number between the first and last page.
  current = Math.max(0, Math.min(pages.length - 1, index));

  // Slide the track. Page 2 means moving left by 200% of one page's width.
  track.style.transform = `translateX(-${current * 100}%)`;
  fitHeight();

  // Pages you can't see shouldn't be reachable with the Tab key either.
  pages.forEach((page, i) => {
    page.inert = i !== current;
  });

  // Update the year strip.
  spineButtons.forEach((button, i) => {
    button.classList.toggle('is-passed', i < current);
    if (i === current) {
      button.setAttribute('aria-current', 'step');
    } else {
      button.removeAttribute('aria-current');
    }
  });

  // On a phone the year strip scrolls sideways: keep the current page's button in the middle.
  const activeButton = spineButtons[current];
  spine.scrollLeft = activeButton.offsetLeft - (spine.clientWidth - activeButton.offsetWidth) / 2;

  // Grey out Previous on the first page and Next on the last.
  prevButton.disabled = current === 0;
  nextButton.disabled = current === pages.length - 1;

  // "Page 2 of 6 · 2016"
  counter.textContent = `Page ${current + 1} of ${pages.length} · ${pages[current].dataset.label}`;

  // Put the page's id in the address bar, so a link like journey.html#role-2016
  // can send someone straight to that role.
  if (updateAddress) {
    history.replaceState(null, '', '#' + pages[current].id);
  }

  // If you'd scrolled down a long page, go back to the top of the next one.
  if (window.scrollY > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ----- 6. Wire up the controls -----

// A page's height can change after it's measured: when the window is resized,
// when the web fonts finish loading, or when text wraps differently on a phone.
// A ResizeObserver runs fitHeight whenever any page changes size.
const resizeWatcher = new ResizeObserver(fitHeight);
pages.forEach((page) => resizeWatcher.observe(page));

prevButton.addEventListener('click', () => goTo(current - 1));
nextButton.addEventListener('click', () => goTo(current + 1));

// The left and right arrow keys turn pages too.
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') goTo(current + 1);
  if (event.key === 'ArrowLeft') goTo(current - 1);
});

// Links such as "Back to 2016" point at a page's id (#role-2016).
// Instead of jumping, turn to that page.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = pages.findIndex((page) => '#' + page.id === link.getAttribute('href'));
    if (target !== -1) {
      event.preventDefault();
      goTo(target);
    }
  });
});

// ----- 7. Start on the right page -----
// If the address already ends in, say, #role-2020, open that page. Otherwise the first role.
const startPage = pages.findIndex((page) => '#' + page.id === location.hash);
goTo(startPage === -1 ? 0 : startPage, false); // false: leave the address alone for now

// When a page finishes loading with an address ending in, say, #role-2020, the
// browser scrolls down to that element. In book mode we want to stay at the top,
// so we take the #... off while the page loads, then put it back afterwards.
if (location.hash) {
  history.replaceState(null, '', location.pathname);
  window.addEventListener('load', () => {
    history.replaceState(null, '', '#' + pages[current].id);
  });
}

// ----- 8. The drop-down menus -----
// <details> opens and closes on its own. These lines also close a menu when you
// click anywhere outside it or press Escape. querySelectorAll finds every menu,
// so any drop-down with class="nav-menu" works without extra code.
const navMenus = document.querySelectorAll('.nav-menu');

document.addEventListener('click', (event) => {
  navMenus.forEach((menu) => {
    if (!menu.contains(event.target)) menu.open = false;
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  navMenus.forEach((menu) => {
    if (menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
});