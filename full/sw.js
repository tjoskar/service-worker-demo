/* global self, importScripts, URL, caches, fetch, registration, clients, location */

importScripts('serviceworker-cache-polyfill.js');

var staticCacheName = 'cache-static-v1';
var imgCacheName = 'cache-img-v1';
var apiCacheName = 'cache-api-v1';
var staticFiles = [
  '/',
  '/app/index.css',
  '/app/boot.js',
  '/vendor.js',
  '/template_cache.js',
  '/assets/images/logo.png',
  '/font/material-design-icons/Material-Design-Icons.woff',
  '/font/roboto/Roboto-Regular.ttf',
  '/font/roboto/Roboto-Thin.ttf',
  '/font/roboto/Roboto-Light.ttf',
  '/offline.gif'
];

self.addEventListener('install', function(event) {
    console.log('Installing', event);
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll(staticFiles);
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('activate', event);
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return [staticCacheName, imgCacheName, apiCacheName].indexOf(cacheName) < 0;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    var requestURL = new URL(event.request.url);
    var response;

    if (requestURL.hostname === 'img.episodehunter.tv') {
        console.log('Trying to fetch images from EH eh?');
        response = cacheFallbackOnNetwork(event.request, apiCacheName);
    } else if(requestURL.pathname === '/user/upcoming') {
        console.log('Fetching API');
        response = networkFallbackOnCache(event.request, apiCacheName);
    } else if (location.hostname === requestURL.hostname) {
        console.log('Fetching from this host');
        response = caches.match(event.request)
            .then(function(cacheMatch) {
                if (cacheMatch) {
                    return cacheMatch;
                }
                return Promise.reject('Can not find requested item in cache :(');
            })
            .catch(function() {
                return fetch(event.request);
            })
            .catch(function() {
                if (/\.(png|jpg|jpeg|gif)$/.test(requestURL.pathname)) {
                    console.log('offline.gif', event.request.url);
                    return caches.match('/offline.gif');
                }
                console.error('Nothing we can do about it', event.request.url);
                return Promise.reject('Can not fetch requested item :(');
            });
    } else {
        console.log('Unknown data, go for the internet', event.request.url);
        response = fetch(event.request);
    }

    return event.respondWith(response);
});

self.addEventListener('push', function(event) {
    console.log('Push Event Received', event);

    registration.showNotification('Episodehunter', {
        body: 'Next episode of Braking Bad will be airing in 15 minutes',
        icon: '/assets/images/logo.png',
        tag: 'new-episode'
    });
});

self.addEventListener('notificationclick', function(event) {
    console.log('Clicking on notification', event);
    clients.openWindow('/mb.gif');
    // clients.matchAll().then(function(allClients) {
    //     return allClients.filter(function(c) {
    //         return (new URL(c.url).pathname === '/');
    //     })[0];
    // }).then(function(client) {
    //     if (client) {
    //         client.focus();
    //     } else {
    //       clients.openWindow('#/mb');
    //     }
    // });
});

/**
 * Send request -> save in cache -> reply with response
 * If network fail => reply with cache value
 * @param {Request} request   request from event
 * @param {String} cacheName cache name
 * @return {Promise}
 */
function networkFallbackOnCache(request, cacheName) {
    return caches.open(cacheName).then(function(cache) {
        return cache.match(request.clone()).then(function(response) {
            return fetch(request.clone())
                .then(function(networkResponse) {
                    cache.put(request, networkResponse.clone());
                    return networkResponse;
                })
                .catch(function() {
                    return response;
                });
        });
    });
}

/**
 * Check if we have the request in cache, if we do: response, else make a network request and update the cache.
 * @param  {Request} request
 * @param  {String} cacheName
 * @return {Promise}
 */
function cacheFallbackOnNetwork(request, cacheName) {
    return caches.open(cacheName).then(function(cache) {
        return cache.match(request.clone()).then(function(response) {
            var fetchPromise = fetch(request.clone()).then(function(networkResponse) {
                cache.put(request, networkResponse.clone());
                    return networkResponse;
                });
            return response || fetchPromise;
        });
    });
}
