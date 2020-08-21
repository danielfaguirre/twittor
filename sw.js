//imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'css/animate.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
    "css/animate.css",
    "js/libs/jquery.js"
];

self.addEventListener('install', e => {
    const cacheStatic = caches.open(STATIC_CACHE)
        .then(cache => cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE)
        .then(cache => cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});


self.addEventListener('activate', e => {
    const resp = caches.keys()
        .then(keys => {
            keys.map(key => {
                if (key !== STATIC_CACHE && key.includes('static'))
                    return caches.delete(key);

                if (key !==DYNAMIC_CACHE && key.includes('dynamic'))
                    return caches.delete(key);
            });
        });
    e.waitUntil(resp);
});

self.addEventListener('fetch', event => {
    const cacheResp = caches.match(event.request)
        .then(resp => {
            if (resp) return resp
            else {
                return fetch(event.request)
                    .then(newResp => {
                        return actualizarcacheDinamico(DYNAMIC_CACHE, event.request, newResp);
                    });
            }
        });
    event.respondWith(cacheResp);

});