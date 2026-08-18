/* KoW Companion v4.5.0 TEST — stability persistence r6.
   Versioned asset to avoid stale browser/script cache. No MutationObservers or polling. */
(function(){
  'use strict';
  window.KOW_V450_RUNTIME_DISABLED=true;
  window.KOW_STABILITY_BUILD='r6';

  const UI_KEY='kow_ui_state_v450';
  const SUCCESS='Backup restored successfully. Officer profiles, Officer Badges Held and shared resources have been imported. The app will reload now.';
  const FIELD_IDS=[
    'officerSearch','officerSeasonFilter','officerRoleFilter','officerRarityFilter','compareOfficer','multiSavedPlans',
    'kowPlannerSession','kowPlannerSeasonFilter','kowFutureOfficerType'
  ];
  const CHECK_IDS=['kowPlannerIncludeNotStarted','kowPlannerIncludeOriginals'];
  let startupRestoring=true;

  function readUI(){try{return JSON.parse(localStorage.getItem(UI_KEY)||'{}')||{}}catch{return {}}}
  function writeUI(patch){try{localStorage.setItem(UI_KEY,JSON.stringify(Object.assign(readUI(),patch)))}catch{}}

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
    const idx=findSavedOfficer(s,state);if(idx<0)return false;
    if(s.selectedIndex!==idx){s.selectedIndex=idx;s.dispatchEvent(new Event('change',{bubbles:true}));}
    return true;
  }

  function saveView(view){if(view&&!startupRestoring)writeUI({view})}
  function restoreView(){
    const view=readUI().view;if(!view)return;
    const b=document.querySelector('.bottom-nav button[data-view="'+CSS.escape(view)+'"]');
    if(b&&!b.classList.contains('active'))b.click();
  }

  function saveField(el){if(el&&el.id&&!startupRestoring)writeUI({['field_'+el.id]:el.value})}
  function saveCheck(el){if(el&&el.id&&!startupRestoring)writeUI({['check_'+el.id]:!!el.checked})}
  function restoreFieldsAndChecks(){
    const state=readUI();
    FIELD_IDS.forEach(id=>{
      const el=document.getElementById(id),key='field_'+id;if(!el||state[key]===undefined)return;
      const wanted=String(state[key]);
      if(el.tagName==='SELECT'&&![...el.options].some(o=>o.value===wanted))return;
      el.value=wanted;
    });
    CHECK_IDS.forEach(id=>{
      const el=document.getElementById(id),key='check_'+id;if(el&&state[key]!==undefined)el.checked=!!state[key];
    });
  }

  function saveProgressStatusFilters(){
    if(startupRestoring)return;
    const boxes=[...document.querySelectorAll('.progressStatusFilter')];if(!boxes.length)return;
    const status={};boxes.forEach(box=>status[box.value]=!!box.checked);
    writeUI({progressStatusFilters:status});
  }
  function restoreProgressStatusFilters(){
    const saved=readUI().progressStatusFilters;if(!saved||typeof saved!=='object')return false;
    const boxes=[...document.querySelectorAll('.progressStatusFilter')];if(!boxes.length)return false;
    boxes.forEach(box=>{if(Object.prototype.hasOwnProperty.call(saved,box.value))box.checked=!!saved[box.value];});
    return true;
  }

  /* Apply persisted defaults immediately, before native async init settles. */
  (function seedBeforeNativeInit(){
    const state=readUI();
    const s=document.getElementById('officerSelect');
    const name=String(state.officerText||'').trim();
    if(name&&s&&!s.options.length){
      const option=document.createElement('option');option.value=String(state.officerValue??'');option.textContent=name;option.selected=true;s.appendChild(option);
    }
    restoreProgressStatusFilters();
    restoreFieldsAndChecks();
  })();

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
    const el=e.target;if(!el)return;
    if(el.id==='restoreAppData'){
      e.stopImmediatePropagation();const file=el.files&&el.files[0];if(!file)return;
      try{await restoreBackupFile(file)}catch(err){
        const msg='Backup restore failed: '+(err&&err.message?err.message:String(err));
        const status=document.getElementById('backupStatus');if(status)status.textContent=msg;
        alert(msg);el.value='';
      }
      return;
    }
    if(el.id==='officerSelect')saveOfficerSelection();
    if(el.classList&&el.classList.contains('progressStatusFilter'))saveProgressStatusFilters();
    if(FIELD_IDS.includes(el.id))saveField(el);
    if(CHECK_IDS.includes(el.id))saveCheck(el);
  },true);
  document.addEventListener('input',function(e){const el=e.target;if(el&&FIELD_IDS.includes(el.id))saveField(el)},true);

  function saveAllUi(){
    if(startupRestoring)return;
    saveOfficerSelection();saveProgressStatusFilters();
    FIELD_IDS.forEach(id=>saveField(document.getElementById(id)));
    CHECK_IDS.forEach(id=>saveCheck(document.getElementById(id)));
  }
  window.addEventListener('pagehide',saveAllUi);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')saveAllUi()});

  window.addEventListener('load',function(){
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      restoreFieldsAndChecks();restoreProgressStatusFilters();restoreOfficerSelection();restoreView();
      setTimeout(()=>{
        restoreFieldsAndChecks();restoreProgressStatusFilters();restoreOfficerSelection();restoreView();
        startupRestoring=false;
        document.querySelectorAll('.progressStatusFilter').forEach(box=>box.dispatchEvent(new Event('change',{bubbles:true})));
        document.documentElement.dataset.kowUiRestored='r6';
      },400);
    }));
  },{once:true});
})();
