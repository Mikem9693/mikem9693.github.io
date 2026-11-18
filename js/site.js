/*
  site.js
  ------------------------------------------------------------
  Builds the shared header and the lists on the index pages,
  using the data in site-data.js. You rarely need to edit this.

  Load order on every page:
    1. /js/site-data.js  (the data)
    2. /js/site.js       (this file: uses the data)
    3. /js/menu.js       (drop-down behaviour: needs the header to exist)
*/


/* ---------- Settings ---------- */

// How many of the newest posts appear in the "My Thoughts" drop-down.
const MENU_POST_COUNT = 3;


/* ---------- Helpers ---------- */

// Sort newest first. YYYY-MM-DD dates sort correctly as plain text,
// so a text comparison is all we need.
function newestFirst(items) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

// "2026-11-14" -> "14 Nov 2026"
// timeZone "UTC" stops the date slipping back a day for visitors west of London.
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
}


/* ---------- Header ---------- */

// Replaces <div id="site-header"> with the full header.
function buildHeader() {
  const placeholder = document.getElementById("site-header");
  if (!placeholder) return;

  const postLinks = newestFirst(POSTS)
    .slice(0, MENU_POST_COUNT)
    .map(post => `
          <li><a href="${post.url}"><span>${post.title}</span><span class="label">${post.category} · ${formatDate(post.date)}</span></a></li>`)
    .join("");

  const projectLinks = PROJECTS
    .map(project => `
          <li><a href="${project.url}"><span>${project.title}</span><span class="label">${project.tags}</span></a></li>`)
    .join("");

  placeholder.outerHTML = `
  <header class="site-header">
    <a class="journey-name" href="/">Mike Morris</a>
    <nav class="site-nav" aria-label="Site">
      <details class="nav-menu">
        <summary>My Thoughts</summary>
        <ul>${postLinks}
          <li><a class="nav-menu-all" href="/writing/">All posts →</a></li>
        </ul>
      </details>
      <details class="nav-menu">
        <summary>Projects</summary>
        <ul>${projectLinks}
          <li><a class="nav-menu-all" href="/projects/">All projects →</a></li>
        </ul>
      </details>
      <a href="https://github.com/Mikem9693">GitHub ↗</a>
      <a href="https://www.linkedin.com/in/mike-morris-5a3879b5/">LinkedIn ↗</a>
    </nav>
  </header>`;
}


/* ---------- Index page lists ---------- */

// Fills <ul data-list="posts"> on writing/index.html
function buildPostList() {
  const list = document.querySelector('[data-list="posts"]');
  if (!list) return;

  list.innerHTML = newestFirst(POSTS)
    .map(post => `
      <li class="listing-item">
        <p class="label">${post.category} · <time datetime="${post.date}">${formatDate(post.date)}</time></p>
        <h2><a href="${post.url}">${post.title}</a></h2>
        <p class="listing-summary">${post.standfirst}</p>
      </li>`)
    .join("");
}

// Fills <ul data-list="projects"> on projects/index.html
function buildProjectList() {
  const list = document.querySelector('[data-list="projects"]');
  if (!list) return;

  list.innerHTML = PROJECTS
    .map(project => `
      <li class="listing-item">
        <p class="label">${project.tags}</p>
        <h2><a href="${project.url}">${project.title}</a></h2>
        <p class="listing-summary">${project.summary}</p>
      </li>`)
    .join("");
}


/* ---------- Run ---------- */

// The header placeholder sits just above this script, so it already
// exists: build it straight away so the page never appears without it.
buildHeader();

// The lists sit further down the page and haven't been read by the
// browser yet, so wait until the whole page has loaded.
document.addEventListener("DOMContentLoaded", () => {
  buildPostList();
  buildProjectList();
});
