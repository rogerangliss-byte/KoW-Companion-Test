/* KoW Companion v4.5.0 TEST — stability layer only.
   Advanced v4.5 planner/chest changes remain disabled while the stable baseline
   is verified. This module provides backup reliability and non-destructive UI
   session persistence without MutationObservers or render loops. */
(function(){
  'use strict';
  window.KOW_V450_RUNTIME_DISABLED = true;

  const UI_KEY='kow_ui_state_v450';
  const SUCCESS='Backup restored successfully. Officer profiles, Officer Badges Held and shared resources have been imported. The app will reload now.';
  const FIELD_IDS=['officerSearch','officerSeasonFilter','officerRoleFilter','officerRarityFilter','compareOfficer','multiSavedPlans'];
  let startupRestoring=true;

  function readUI(){try{return JSON.parse(localStorage.getItem(UI_KEY)||'{}')||{}}catch{return {}}}
  function writeUI(patch){try{localStorage.setItem(UI_KEY,JSON.stringify(Object.assign(readUI(),patch)))}catch{}}

  /* This script is a classic script placed after the deferred module script in the HTML.
     Therefore it executes before the module's init() function. Seed the empty Officer
     selector with the previously saved Officer name so native renderOfficerOptions()
     uses that Officer as its own 'prev' value instead of falling through to S7 Liora. */
  (function seedOfficerBeforeNativeInit(){
    const state=readUI();
    const name=String(state.officerText||'').trim();
    const s=document.getElementById('officerSelect');
    if(!name||!s||s.options.length)return;
    const option=document.createElement('option');
    option.value=String(state.officerValue??'');
    option.textContent=name;
    option.selected=true;
    s.appendChild(option);
  })();

  function saveOfficerSelection(){
    if(startupRestoring)return;
    const s=document.getElementById('officerSelect');
    if(!s||!s.options.length||s.selectedIndex<0)return;
    const opt=s.options[s.selectedIndex];
    writeUI({officerValue:String(s.value),officerText:String(opt.textContent||'').trim()});
  }
  function findSavedOfficer(s,state){
    if(state.officerText){
      const wanted=String(state.officerText).trim();
      for(let i=0;i<s.options.length;i++)if(String(s.options[i].textContent||'').trim()===wanted)return i;
    }
    if(state.officerValue!==undefined){
      for(let i=0;i<s.options.length;i++)if(String(s.options[i].value)===String(state.officerValue))return i;
    }
    return -1;
  }
  function restoreOfficerSelection(){
    const state=readUI(),s=document.getElementById('officerSelect');
    if(!s||!s.options.length)return false;
    const idx=findSavedOfficer(s,state);
    if(idx<0)return false;
    if(s.selectedIndex!==idx){
      s.selectedIndex=idx;
      s.dispatchEvent(new Event('change',{bubbles:true}));
    }
    return true;
  }
  function saveView(view){if(view&&!startupRestoring)writeUI({view:view})}
  function restoreView(){
    const view=readUI().view;if(!view)return;
    const b=document.querySelector('.bottom-nav button[data-view="'+CSS.escape(view)+'"]');
    if(b&&!b.classList.contains('active'))b.click();
  }
  function saveField(el){if(el&&el.id&&!startupRestoring)writeUI({['field_'+el.id]:el.value})}
  function restoreFields(){
    const state=readUI();
    FIELD_IDS.forEach(id=>{
      const el=document.getElementById(id),key='field_'+id;
      if(!el||state[key]===undefined)return;
      const wanted=String(state[key]);
      if(el.tagName==='SELECT'&&![...el.options].some(o=>o.value===wanted))return;
      if(el.value===wanted)return;
      el.value=wanted;
      el.dispatchEvent(new Event(el.tagName==='INPUT'?'input':'change',{bubbles:true}));
    });
  }

  async function restoreBackupFile(file){
    const payload=JSON.parse(await file.text());
    if(!payload||!payload.localStorage||typeof payload.localStorage!=='object')throw new Error('Invalid KoW Companion backup file.');
    if(payload.app&&payload.app!=='KoW Companion')throw new Error('This is not a KoW Companion backup file.');
    localStorage.clear();
    Object.entries(payload.localStorage).forEach(([key,value])=>{if(value!==null&&value!==undefined)localStorage.setItem(key,String(value));});
    const status=document.getElementById('backupStatus');if(status)status.textContent=SUCCESS;
    alert(SUCCESS);location.reload();
  }

  document.addEventListener('click',function(e){
    const nav=e.target.closest?.('.bottom-nav button[data-view]');if(nav)saveView(nav.dataset.view);
    const label=e.target.closest?.('#restoreAppDataLabel');if(label){const input=document.getElementById('restoreAppData');if(input)input.value='';}
  },true);

  document.addEventListener('change',async function(e){
    const input=e.target;if(!input)return;
    if(input.id==='restoreAppData'){
      e.stopImmediatePropagation();const file=input.files&&input.files[0];if(!file)return;
      try{await restoreBackupFile(file)}catch(err){
        const msg='Backup restore failed: '+(err&&err.message?err.message:String(err));
        const status=document.getElementById('backupStatus');if(status)status.textContent=msg;
        alert(msg);input.value='';
      }
      return;
    }
    if(input.id==='officerSelect')saveOfficerSelection();
    if(FIELD_IDS.includes(input.id))saveField(input);
  },false);
  document.addEventListener('input',function(e){if(e.target&&FIELD_IDS.includes(e.target.id))saveField(e.target)},false);

  window.addEventListener('pagehide',()=>{if(!startupRestoring)saveOfficerSelection()});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&!startupRestoring)saveOfficerSelection()});

  window.addEventListener('load',function(){
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      restoreFields();
      restoreOfficerSelection();
      restoreView();
      setTimeout(()=>{
        restoreOfficerSelection();
        restoreView();
        startupRestoring=false;
        document.documentElement.dataset.kowUiRestored='1';
      },250);
    }));
  },{once:true});
})();
