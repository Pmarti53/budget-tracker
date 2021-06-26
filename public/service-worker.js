const FILE_TO_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/index.js"
]

const APP_PREFIX = "BudgetTracker-"
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILE_TO_CACHE)
        })
    )
})

console.log('Service worker registered!')

self.addEventListener('install', function (e) {

})