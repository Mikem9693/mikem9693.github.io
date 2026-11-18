// menus.js: the drop-down menus in the header, used on every page.
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