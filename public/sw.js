/*

if(!self.define) {
    
    let e,i={};
    const s=(s,n)=>(
        s=new URL(s+".js",n).href, 
        i[s] || new Promise(
            (i=> {
                if("document"in self) {
                    const e=document.createElement("script");
                    e.src=s,e.onload=i,document.head.appendChild(e)
                }
                else e=s,importScripts(s),i()
            })
        )
        .then((()=>{let e=i[s];
        if(!e) throw new Error(`Module ${s} didn’t register its module`);return e})));
        self.define=(n,r)=> {
            const t=e 
                || ("document"in self?document.currentScript.src:"") 
                || location.href;
                
            if(i[t])return;let o={};const d=e=>s(e,t),l={module:{uri:t},exports:o,require:d};
            i[t]=Promise.all(n.map((e=>l[e]||d(e)))).then((e=>(r(...e),o)))
        }
    }
                
define(["./workbox-3e911b1d"], (                
    function(e) {
        "use strict";
        self.skipWaiting(),
        e.clientsClaim(),
        e.precacheAndRoute([
            {url:"assets/index-DiwrgTda.css",revision:null},
            {url:"assets/index-MJNRYYyu.js",revision:null},
            {url:"index.html",revision:"265ffd5178535626fb6f3c293baa0d39"},
            {url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},
            {url:"manifest.webmanifest", revision:"d51fda1c2b97193099caa315ea185736"}
        ], {}),
        e.cleanupOutdatedCaches(),
        e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))
    }
));

*/

const staticDevCoffee = "site-v1";
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/images/coffee1.jpg",
  "/images/coffee2.jpg",
  "/images/coffee3.jpg",
  "/images/coffee4.jpg",
  "/images/coffee5.jpg",
  "/images/coffee6.jpg",
  "/images/coffee7.jpg",
  "/images/coffee8.jpg",
  "/images/coffee9.jpg"
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});

