/* Service worker — Hussein Badr English
   Strategy: pages = network-first with cache + offline fallback; static assets = stale-while-revalidate. */
const VERSION = 'hbe-v7';
const PRECACHE = [
 "./",
 "about.html",
 "brand.html",
 "assets/css/brand.css?v=7",
 "accessibility.html",
 "certificate.html",
 "contact.html",
 "dashboard.html",
 "exercises.html",
 "faq.html",
 "flashcards.html",
 "glossary.html",
 "grammar.html",
 "grammar/articles.html",
 "grammar/comparatives-superlatives.html",
 "grammar/conditionals.html",
 "grammar/future-forms.html",
 "grammar/modal-verbs.html",
 "grammar/passive-voice.html",
 "grammar/past-simple.html",
 "grammar/prepositions.html",
 "grammar/present-continuous.html",
 "grammar/present-perfect.html",
 "grammar/present-simple.html",
 "grammar/question-forms.html",
 "index.html",
 "lesson-10.html",
 "lesson-11.html",
 "lesson-12.html",
 "lesson-13.html",
 "lesson-14.html",
 "lesson-15.html",
 "lesson-16.html",
 "lesson-17.html",
 "lesson-18.html",
 "lesson-2.html",
 "lesson-3.html",
 "lesson-4.html",
 "lesson-5.html",
 "lesson-6.html",
 "lesson-7.html",
 "lesson-8.html",
 "lesson-9.html",
 "lesson-greetings.html",
 "lessons.html",
 "levels.html",
 "levels/a1.html",
 "levels/a2.html",
 "levels/b1.html",
 "levels/b2.html",
 "levels/c1.html",
 "mistakes.html",
 "offline.html",
 "paths.html",
 "phrasebook.html",
 "placement-test.html",
 "practice.html",
 "privacy.html",
 "resources.html",
 "sitemap.html",
 "skills-test.html",
 "study-plan.html",
 "terms.html",
 "vocabulary.html",
 "vocabulary/family.html",
 "vocabulary/feelings.html",
 "vocabulary/food-drinks.html",
 "vocabulary/health.html",
 "vocabulary/home-house.html",
 "vocabulary/school-study.html",
 "vocabulary/shopping.html",
 "vocabulary/technology.html",
 "vocabulary/travel.html",
 "vocabulary/work-jobs.html",
 "assets/css/placement-assessment.css",
 "assets/css/style.css",
 "assets/img/apple-touch-icon.png",
 "assets/img/favicon-32.png",
 "assets/img/favicon.png",
 "assets/img/favicon.svg",
 "assets/img/hbe-logo-192.png",
 "assets/img/hbe-logo-512.png",
 "assets/img/hbe-logo-96.png",
 "assets/img/hbe-logo.png",
 "assets/img/hbe-portrait.jpg",
 "assets/img/og-image.jpg",
 "assets/js/app.js",
 "assets/js/data.js",
 "assets/js/exercises.js",
 "assets/js/placement-assessment.js",
 "manifest.webmanifest"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => Promise.all(PRECACHE.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isPage = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  if (isPage) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('offline.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((hit) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(() => hit);
      return hit || network;
    })
  );
});
