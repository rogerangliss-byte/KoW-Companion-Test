(()=>{
  async function renderOfficerDataStatus(){
    const box=document.getElementById('officerDataStatus');
    if(!box)return;
    try{
      const response=await fetch('./officer-data-version.json?t='+Date.now(),{cache:'no-store'});
      if(!response.ok)throw new Error('manifest request failed');
      const m=await response.json();
      box.innerHTML='<b>Officer data:</b> ✅ Global data loaded<br>'+
        '<b>Data version:</b> '+String(m.dataVersion||'—')+'<br>'+
        '<b>Officers:</b> '+String(m.officerCount??'—')+'<br>'+
        '<b>Published:</b> '+(m.publishedAt?new Date(m.publishedAt).toLocaleString():'—')+'<br>'+
        '<span class="muted">English Test dynamic Officer dataset</span>';
    }catch(error){
      box.innerHTML='<b>Officer data:</b> ⚠️ Bundled/local fallback in use<br><span class="muted">The global Officer manifest could not be read.</span>';
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderOfficerDataStatus);
  else renderOfficerDataStatus();
  window.addEventListener('load',renderOfficerDataStatus);
})();
