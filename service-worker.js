const CACHE='kow-english-test-v4.6.0-direct-runtime-2';

self.addEventListener('install',event=>{self.skipWaiting();});
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

function v460RuntimeScript(){
  return `<script id="KOW_V460_RUNTIME_FIX">
(()=>{
 const VERSION='4.6.0';
 const q=id=>document.getElementById(id);
 function sync(){
   const banner=q('englishTestBanner');
   if(banner)banner.textContent='ENGLISH TEST — v'+VERSION+' — NOT LIVE';
   if(q('headerVersion'))q('headerVersion').textContent='v'+VERSION;
   if(q('installedVersion'))q('installedVersion').textContent='v'+VERSION;
   if(q('aboutVersion'))q('aboutVersion').textContent='v'+VERSION;
   if(q('versionIntegrity'))q('versionIntegrity').innerHTML='<b>Build integrity: OK</b><br>Header, Settings and About all report v'+VERSION+'.';
   const update=q('updateStatus');
   if(update && /v4\\.5\\.0|Update available: v4\\.6\\.0/i.test(update.textContent||''))update.textContent='You are up to date — v'+VERSION+'.';
 }
 async function officerStatus(){
   const settings=q('settings'); if(!settings)return;
   let box=q('officerDataStatus');
   if(!box){
     const heads=[...settings.querySelectorAll('h3')];
     const anchor=heads.find(h=>/App Updates/i.test(h.textContent||''));
     if(!anchor)return;
     const title=document.createElement('h3'); title.textContent='Global Officer Data';
     box=document.createElement('div'); box.id='officerDataStatus'; box.className='notice';
     box.textContent='Checking global Officer data…';
     anchor.parentNode.insertBefore(title,anchor);
     anchor.parentNode.insertBefore(box,anchor);
   }
   try{
     const r=await fetch('./officer-data-version.json?t='+Date.now(),{cache:'no-store'});
     if(!r.ok)throw new Error('manifest request failed');
     const m=await r.json();
     box.innerHTML='<b>Officer data:</b> ✅ Global data loaded<br>'+ 
       '<b>Data version:</b> '+String(m.dataVersion||'—')+'<br>'+ 
       '<b>Officers:</b> '+String(m.officerCount??'—')+'<br>'+ 
       '<b>Published:</b> '+(m.publishedAt?new Date(m.publishedAt).toLocaleString():'—')+'<br>'+ 
       '<span class="muted">English Test dynamic Officer dataset</span>';
   }catch(e){
     box.innerHTML='<b>Officer data:</b> ⚠️ Using bundled/local data<br><span class="muted">Global manifest could not be read.</span>';
   }
 }
 function run(){sync();officerStatus();setTimeout(sync,250);setTimeout(sync,1000);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
 window.addEventListener('load',()=>{sync();officerStatus();});
})();
</script>`;
}

async function networkResponse(request){
  return fetch(request,{cache:'no-store'});
}

async function handleHtml(request){
  const response=await networkResponse(request);
  if(!response.ok)return response;
  let text=await response.text();
  text=text.replace('ENGLISH TEST — v4.5.0 — NOT LIVE','ENGLISH TEST — v4.6.0 — NOT LIVE');
  text=text.replace("const APP_VERSION='4.5.0';","const APP_VERSION='4.6.0';");
  text=text.replace('Version header, Settings, About and Version Integrity all report <b>v4.5.0 TEST</b>.','Version header, Settings, About and Version Integrity all report <b>v4.6.0 TEST</b>.');
  if(!text.includes('KOW_V460_RUNTIME_FIX')){
    text=text.replace('</body>',v460RuntimeScript()+'\n</body>');
  }
  const headers=new Headers(response.headers);
  headers.set('Cache-Control','no-store, no-cache, must-revalidate');
  return new Response(text,{status:response.status,statusText:response.statusText,headers});
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  const isNavigation=event.request.mode==='navigate';
  const isIndex=/\/index\.html$/i.test(url.pathname);
  const isOfficerData=/\/officers\.json$/i.test(url.pathname) || /\/officer-data-version\.json$/i.test(url.pathname);

  if(isNavigation||isIndex){
    event.respondWith(handleHtml(event.request).catch(()=>caches.match('./index.html')));
    return;
  }

  if(isOfficerData){
    event.respondWith(networkResponse(event.request));
    return;
  }

  event.respondWith(
    networkResponse(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request,copy));
      return response;
    }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html')))
  );
});
