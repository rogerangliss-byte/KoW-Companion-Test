const CACHE='kow-english-v4.5.0-test-stability-r11';
const STABILITY='./v450-stability-r10.js?v=20260818-r11';
const ASSETS=[
  './','./index.html','./manifest.json','./icon.svg','./background-portrait.jpg','./background-landscape.jpg','./officers.csv','./officers.json','./USER-GUIDE.md',STABILITY
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(/\/v450-(patch|stability-r6|stability-r7|stability-r8|stability-r9|stability-r10)\.js$/.test(url.pathname)){
   event.respondWith(fetch(STABILITY,{cache:'no-store'}).catch(()=>caches.match(STABILITY)));
   return;
 }
 event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;}).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));
});
