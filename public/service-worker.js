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

const cacheVersion = 'v1.5.0';

class ServiceWorkerOne {

    static run() {
        addEventListener('install', ServiceWorkerOne.onInstalled);
        addEventListener('fetch', ServiceWorkerOne.onFetched);
    }

    static onInstalled = (event) => {
      // Remove old caches
        event.waitUntil(
          (async () => {
            const keys = await caches.keys();
            return keys.map(async (cache) => {
                console.log('>>>>>>>>>>>>> Service Worker: Removing old cache: '+cache);
                return await caches.delete(cache);
            })
          })()
        )
      };

    // static onInstalled = (event) => {
    //     // event.waitUntil(
    //     //     caches.open('v1.0').then(cache => {
    //     //         return cache.addAll([
    //     //             '/',
    //     //             '/assets/blanche.jpg',
    //     //         ]);
    //     //     })
    //     // );
    //     //const cacheBypassRequests = assets.map(url => new Request(url, {cache: 'reload'}));

    //     self.caches.keys().then(keys => { keys.forEach(key => self.caches.delete(key)); })

    //     event.waitUntil(



    //       caches.keys().then(function(names) {
    //         for (let name of names) console.log('#################################################' + name);
    //         for (let name of names) caches.delete(name);



    //       })
    //     ); 
    // }

    //static onFetched = (event) => event.respondWith(ServiceWorker.handleFetch(event.request));

    // static onFetched = async (event) => {
    //   request = event.request;
    //   console.log('cache match >>>', request.method, request.url, request);
    //   switch(request.method) {
    //     case 'GET':
    //       const response = await caches.match(request);
    //       if (response) return response;
    //       const fetchResponse = await fetch(request);
    //       const cache = caches.open('v1.0');
    //       console.log('cache put', request.url);                    
    //       cache.put(request, fetchResponse.clone());
    //       return fetchResponse;          
    //     case 'POST':
    //       const data = await request.blob();
    //       cache.put(`/uploads/${filename}`, new Response(data, { headers: { 'Content-Type': mimetype } }));          
    //       break;
    //   }
    // }



    static onFetched = (event) => {
        event.respondWith(

            caches.match(event.request)
              .then(matchResponse => {
                  //console.log('cache match >>>', event.request.method, event.request.url, event.request, matchResponse);
                  
                  return matchResponse || fetch(event.request).then(fetchResponse => {
                      return caches.open(cacheVersion).then(cache => {
                          //console.log('cache put', event.request.url);                    
                          cache.put(event.request, fetchResponse.clone());
                          return fetchResponse;
                      });
                  });
              })
        );
    }

    // https://github.com/clytras/pwa-sandbox/tree/master

    // xxxxx = (event) => {
    //   // Clone request so we can consume data later
    //   const request = event.request.clone();
    
    //   const { method, url, headers } = event.request;
    
    //   console.log('SW:fetch', method, url, headers.get('X-Filename'), event);
    
    //   event.respondWith(
    //     fetch(event.request /*, {cache: "no-store"}*/).catch(async function(err) {
    //       const { headers, method, url } = event.request;
    
    //       // const xSyncing = headers.get('X-Syncing');
    
    //       // if(xSyncing && xSyncing.length) {
    //       //   return caches.match(event.request);
    //       // }
          
    //       // Get our custom headers
    //       const filename = headers.get('X-Filename');
    //       const mimetype = headers.get('X-Mimetype');


    //         // Get the uploads data from cache
    //         const uploadsRes = await caches.match('/uploads', { cacheName: cacheName });
    //         let { data: files = [] } = await uploadsRes.json();

    //         // Get the sync data from cache
    //         const syncRes = await caches.match(new Request(syncName), { cacheName: syncCacheName });
    //         const sync = await syncRes.json();

    //         // If the file exists in the uploads or in the pendings, then return a 409 Conflict response
    //         if(files.indexOf(filename) >= 0 || sync.pending.indexOf(filename) >= 0) {
    //           return jsonResponse({ success: false }, 409);
    //         }

    //         caches.open(cacheName).then(async (cache) => {
    //           // Write the file to the cache using the response we cloned at the beggining
    //           const data = await request.blob();
    //           cache.put(`/uploads/${filename}`, new Response(data, { headers: { 'Content-Type': mimetype } }));
    //           // Write the updated files data to the uploads cache
    //           cache.put('/uploads', jsonResponse({ success: true, data: files }));
    //         });
            
    //         sync.pending.push(filename);
    //         caches.open(syncCacheName).then(cache => cache.put(new Request(syncName), jsonResponse(sync)));

    //         return jsonResponse({ success: true, fromSw: true });    
    //     })
    //   );
    // };


  
}

ServiceWorkerOne.run();

// self.importScripts('utils.js');

// const filesToCache = [
//   '/',
//   '/uploads',
//   '/styles.css',
//   '/main.js',
//   '/utils.js',
//   '/favicon.ico',
//   '/manifest.json',
// ];


// /* Start the service worker and cache all of the app's content */
// self.addEventListener('install', function(e) {
//   console.log('SW:install');

//   e.waitUntil(Promise.all([
//     caches.open(cacheName).then(async function(cache) {
//       let cacheAdds = [];

//       try {
//         // Get all the files from the uploads listing
//         const res = await fetch('/uploads');
//         const { data = [] } = await res.json();
//         const files = data.map(f => `/uploads/${f}`);

//         // Cache all uploads files urls
//         cacheAdds.push(cache.addAll(files));
//       } catch(err) {
//         console.warn('PWA:install:fetch(uploads):err', err);
//       }

//       // Also add our static files to the cache
//       cacheAdds.push(cache.addAll(filesToCache));
//       return Promise.all(cacheAdds);
//     }),
//     // Create the sync cache object
//     caches.open(syncCacheName).then(cache => cache.put(syncName, jsonResponse({
//       pending: [], // For storing the penging files that later will be synced
//       deleted: []  // For storing the files that later will be deleted on sync
//     }))),
//   ])
//   );
// });

// self.addEventListener('activate', function(event) {
//   console.log('SW:activate');
// });

// // self.addEventListener('sync', function(event) {
// //   console.log('SW:sync', event);

// //   if (event.tag == 'appFilesSync') {
// //     event.waitUntil(async () => {
// //       console.log('SW:sync:appFilesSync');
// //     });
// //   }
// // });

// /* Serve cached content when offline */

// self.addEventListener('fetch', function(event) {
//   // Clone request so we can consume data later
//   const request = event.request.clone();

//   const { method, url, headers } = event.request;

//   console.log('SW:fetch', method, url, headers.get('X-Filename'), event);

//   event.respondWith(
//     fetch(event.request /*, {cache: "no-store"}*/).catch(async function(err) {
//       const { headers, method, url } = event.request;

//       // A custom header that we set to indicate the requests come from our syncing method
//       // so we won't try to fetch anything from cache, we need syncing to be done on the server
//       const xSyncing = headers.get('X-Syncing');

//       console.log('SW:fetch:fail', method, url, err, xSyncing, event.request);
      
//       if(xSyncing && xSyncing.length) {
//         return caches.match(event.request);
//       }

//       switch(method) {
//         case 'GET':
//           if(url.match(/\/uploads\/?$/)) { // Failed to get the uploads listing
//             // Get the uploads data from cache
//             const uploadsRes = await caches.match(event.request);
//             let { data: files = [] } = await uploadsRes.json();

//             // Get the sync data from cache
//             const syncRes = await caches.match(new Request(syncName), { cacheName: syncCacheName });
//             const sync = await syncRes.json();

//             console.log('SW:fetch:fail:GET:uploads', method, url, files, sync);

//             // Return the files from uploads + pending files from sync - deleted files from sync
//             const data = files.concat(sync.pending).filter(f => sync.deleted.indexOf(f) < 0);

//             console.log('SW:fetch:fail:GET:uploads:data', data);

//             // Return a JSON response with the updated data
//             return jsonResponse({
//               success: true,
//               data
//             });
//           }

//           break;
//         case 'PUT':
//           try {
//             // Get our custom headers
//             const filename = headers.get('X-Filename');
//             const mimetype = headers.get('X-Mimetype');

//             if(filename && mimetype) {
//               // Get the uploads data from cache
//               const uploadsRes = await caches.match('/uploads', { cacheName });
//               let { data: files = [] } = await uploadsRes.json();

//               // Get the sync data from cache
//               const syncRes = await caches.match(new Request(syncName), { cacheName: syncCacheName });
//               const sync = await syncRes.json();

//               // If the file exists in the uploads or in the pendings, then return a 409 Conflict response
//               if(files.indexOf(filename) >= 0 || sync.pending.indexOf(filename) >= 0) {
//                 return jsonResponse({ success: false }, 409);
//               }

//               caches.open(cacheName).then(async (cache) => {
//                 // Write the file to the cache using the response we cloned at the beggining
//                 const data = await request.blob();
//                 cache.put(`/uploads/${filename}`, new Response(data, {
//                   headers: { 'Content-Type': mimetype }
//                 }));

//                 // Write the updated files data to the uploads cache
//                 cache.put('/uploads', jsonResponse({ success: true, data: files }));
//               });
              
//               // Add the file to the sync pending data and update the sync cache object
//               sync.pending.push(filename);
//               caches.open(syncCacheName).then(cache => cache.put(new Request(syncName), jsonResponse(sync)));

//               // Return a success response with fromSw set to tru so we know this response came from service worker
//               return jsonResponse({ success: true, fromSw: true });
//             }
//           } catch(err) {
//             console.log('SW:fetch:fail:PUT:no-sync:err', method, url, err);
//           }

//           break;
//         case 'DELETE':
//           // Get our custom headers
//           const filename = headers.get('X-Filename');

//           if(filename) {
//             // Get the uploads data from cache
//             const uploadsRes = await caches.match('/uploads', { cacheName });
//             let { data: files = [] } = await uploadsRes.json();

//             // Get the sync data from cache
//             const syncRes = await caches.match(new Request(syncName), { cacheName: syncCacheName });
//             const sync = await syncRes.json();

//             // Check if the file is already pending or deleted
//             const pendingIndex = sync.pending.indexOf(filename);
//             const uploadsIndex = files.indexOf(filename);

//             console.log('SW:fetch:fail:DELETE', files, sync, pendingIndex, uploadsIndex);

//             if(pendingIndex >= 0) {
//               // If it's pending, then remove it from pending sync data
//               sync.pending.splice(pendingIndex, 1);
//             } else if(sync.deleted.indexOf(filename) < 0) {
//               // If it's not in pending and not already in sync for deleting,
//               // then add it for delete when we'll sync with the server
//               sync.deleted.push(filename);
//             }

//             // Update the sync cache
//             caches.open(syncCacheName).then(cache => cache.put(new Request(syncName), jsonResponse(sync)));

//             // If the file is in the uplods data
//             if(uploadsIndex >= 0) {
//               // Updates the uploads data
//               files.splice(uploadsIndex, 1);
//               caches.open(cacheName).then(async (cache) => {
//                 // Remove the file from the cache
//                 cache.delete(`/uploads/${filename}`);
//                 // Update the uploads data cache
//                 cache.put('/uploads', jsonResponse({ success: true, data: files }));
//               });
//             }
            
//             // Return a JSON success response
//             return jsonResponse({ success: true });
//           }

//           break;
//       }

//       // If we meet no specific criteria, then lookup to the cache
//       return caches.match(event.request);
//     })
//   );
// });
