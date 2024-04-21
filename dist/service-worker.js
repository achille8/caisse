/*
/// <reference lib="WebWorker" />

export type {};
declare const self: ServiceWorkerGlobalScope;

const cacheName = "buvete-1.0";

self.addEventListener('install', event => {
    const addToCache = async () => {
        const cache = await caches.open(cacheName);
        await cache.addAll(["/", "/offline"]);
    };
    event.waitUntil(addToCache());
});

self.addEventListener('fetch', async event => {
    const request = event.request;
    let response = await caches.match(request);
    if (!response) {
        response = await fetch(event.request);
        const cache = await caches.open(cacheName);
        const copy = response.clone();
        await cache.put(request, copy);
    }
    event.respondWith(response);
});
*/

class ServiceWorkerOne {

    static run() {
        addEventListener('install', ServiceWorkerOne.onInstalled);
        addEventListener('fetch', ServiceWorkerOne.onFetched);
    }

    static onInstalled = (event) => {
        event.waitUntil(
            caches.open('v1.0').then(cache => {
                return cache.addAll([
                    '/',
                    '/assets/blanche.jpg',
                ]);
            })
        );
    }

    static onFetched = (event) => {
        event.respondWith(
            caches.match(event.request).then(matchResponse => {
                console.log('cache match', event.request.url, matchResponse);
                
                return matchResponse || fetch(event.request).then(fetchResponse => {
                    return caches.open('v1.0').then(cache => {
                        console.log('cache put', event.request.url);                    
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
        );
    }
}

ServiceWorkerOne.run();