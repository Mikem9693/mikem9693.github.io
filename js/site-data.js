/*
  site-data.js
  ------------------------------------------------------------
  The ONLY file you edit when you publish something new.

  Rules:
  - Every entry sits between { } and needs a comma after its closing }.
  - Dates are written YYYY-MM-DD (site.js turns them into "14 Nov 2026").
  - URLs start with / and must match the file name exactly.
    House rule: every folder and file name is lowercase-with-hyphens.
  - Order doesn't matter: site.js sorts posts newest first.
    Adding new entries at the top keeps the file easy to read.
*/

const POSTS = [
  {
    title: "The Luddites: A Tragedy of Misunderstanding",
    url: "/writing/the-luddites.html",
    date: "2026-11-14",
    category: "Thinkpiece",                      // Thinkpiece, Delivery or Learning log
    standfirst: "A protest that shook the world became the go-to name for those we consider behind the times."
  },
];

const PROJECTS = [
  {
    title: "Classic RTS - Red Alert 1 in browser",
    url: "/projects/classic-rts.html",
    tags: "WebAssembly · AI delivery",
    summary: "Making Red Alert 1 playable on browser"
  },
  {
    title: "Job Search Automation",
    url: "/projects/job-search-automation.html",
    tags: "n8n · AI workflows",
    summary: "TODO: one line on what it is and why it matters."
  },
  {
    title: "Records Automation",
    url: "/projects/records-automation.html",
    tags: "Apps Script · Google Sheets",
    summary: "TODO: one line on what it is and why it matters."
  },

  /* Pi-hole wasn't in your menu, so it's switched off here.
     When the page fixes are done, delete the slash-star line above
     this entry and the star-slash line below it.
  {
    title: "Pi-hole Network-Wide Ad Blocker",
    url: "/projects/pi-hole.html",
    tags: "Raspberry Pi · Networking",           // TODO: check these tags
    summary: "TODO: one line on what it is and why it matters."
  },
  */
];
