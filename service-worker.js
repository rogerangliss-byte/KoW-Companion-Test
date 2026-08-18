const CACHE='kow-english-v4.5.0-test2-optimiser-selector-r2';
const ASSETS=[
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './background-portrait.jpg',
  './background-landscape.jpg',
  './officers.csv',
  './officers.json',
  './USER-GUIDE.md',
  './v450-patch.js',
  './v450-optimiser-officer-fix.js'
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
function isAppHtml(request){const u=new URL(request.url);return request.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/KoW-Companion-Test/');}
async function transformHtml(response){
 const text=await response.text();
 let html=text
  .replaceAll('KoW Companion v4.4.0 TEST','KoW Companion v4.5.0 TEST')
  .replace("const APP_VERSION='4.3.59';","const APP_VERSION='4.5.0';")
  .replace(/ENGLISH TEST VERSION — v4\.4\.0 TEST 1 — PLANNING READINESS DASHBOARD — NOT LIVE/g,'ENGLISH TEST VERSION — v4.5.0 TEST 2 — ADVANCED PLANNING & OPTIMISER FIX — NOT LIVE')
  .replace(/ENGLISH TEST VERSION — v4\.5\.0 TEST 1 — ADVANCED PLANNING & CORRECT CHEST LOGIC — NOT LIVE/g,'ENGLISH TEST VERSION — v4.5.0 TEST 2 — ADVANCED PLANNING & OPTIMISER FIX — NOT LIVE')
  .replace('</body>','<script src="./v450-patch.js?v=450-test2-r2"></script>\n<script src="./v450-optimiser-officer-fix.js?v=450-test2-r2"></script>\n</body>');
 return new Response(html,{status:response.status,statusText:response.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
}
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 event.respondWith((async()=>{
  try{
   const response=await fetch(event.request,{cache:'no-store'});
   if(isAppHtml(event.request)&&response.ok)return await transformHtml(response);
   const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;
  }catch(_){
   const cached=await caches.match(event.request)||await caches.match('./index.html');
   if(cached&&isAppHtml(event.request))return transformHtml(cached.clone());
   return cached;
  }
 })());
});
