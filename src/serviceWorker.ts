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

    public static run(): void {
        addEventListener('install', ServiceWorkerOne.onInstalled);
        addEventListener('fetch', ServiceWorkerOne.onFetched);
    }

    public static onInstalled = (event: any): void => {
        event.waitUntil(
            caches.open('v1.0').then(cache => {
                return cache.addAll([
                    '/',
                    '/assets/blanche.jpg',
                ]);
            })
        );
    }

    public static onFetched = (event: any): void => {
        event.respondWith(
            caches.match(event.request).then(matchResponse => {
                return matchResponse || fetch(event.request).then(fetchResponse => {
                    return caches.open('v1.0').then(cache => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
        );
    }
}

ServiceWorkerOne.run();