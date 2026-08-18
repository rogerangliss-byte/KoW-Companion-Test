/* KoW Companion v4.5.0 TEST — Planner persistence r10.
   Keeps the Planner working state, including dynamic Multi-Officer rows, across refresh.
   No MutationObserver and no continuous polling. */
(function(){
'use strict';
window.KOW_STABILITY_BUILD='r10';
const KEY='kow_planner_working_state_r10';
let restoring=true;

function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return {}}}
function write(state){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}

function planner(){return document.getElementById('planner')}
function plannerFields(){const p=planner();return p?[...p.querySelectorAll('input[id],select[id],textarea[id]')]:[]}
function rowState(){
 return [...document.querySelectorAll('#multiPlannerRows tr')].map(tr=>({
   officer:String(tr.querySelector('[data-multi-officer]')?.value??''),
   needed:String(tr.querySelector('[data-multi-needed]')?.value??'0')
 }));
}
function save(){
 if(restoring)return;
 const controls={};
 plannerFields().forEach(el=>{controls[el.id]=el.type==='checkbox'?!!el.checked:String(el.value??'')});
 write({controls,rows:rowState(),savedAt:new Date().toISOString()});
}

function setControl(el,value){
 if(!el)return;
 if(el.type==='checkbox'){
   el.checked=!!value;
   return;
 }
 const wanted=String(value??'');
 if(el.tagName==='SELECT'&&![...el.options].some(o=>String(o.value)===wanted))return;
 el.value=wanted;
}

function normaliseRowCount(target){
 target=Math.max(0,Number(target)||0);
 let count=document.querySelectorAll('#multiPlannerRows tr').length;
 const add=document.getElementById('multiAddOfficer');
 while(count<target&&add){add.click();count=document.querySelectorAll('#multiPlannerRows tr').length;}
 while(count>target){
   const rows=[...document.querySelectorAll('#multiPlannerRows tr')];
   const remove=rows.at(-1)?.querySelector('[data-remove]');
   if(!remove)break;
   remove.click();
   count=document.querySelectorAll('#multiPlannerRows tr').length;
 }
}

function restoreRows(rows){
 if(!Array.isArray(rows))return;
 normaliseRowCount(rows.length);
 rows.forEach((r,i)=>{
   let tr=document.querySelectorAll('#multiPlannerRows tr')[i];
   let sel=tr?.querySelector('[data-multi-officer]');
   if(sel&&[...sel.options].some(o=>String(o.value)===String(r.officer))){
     sel.value=String(r.officer);
     sel.dispatchEvent(new Event('change',{bubbles:true}));
   }
   tr=document.querySelectorAll('#multiPlannerRows tr')[i];
   const needed=tr?.querySelector('[data-multi-needed]');
   if(needed){needed.value=String(r.needed??0);needed.dispatchEvent(new Event('input',{bubbles:true}));}
 });
}

function restore(runEvents=true){
 const state=read();
 if(!state||(!state.controls&&!state.rows))return false;
 const controls=state.controls||{};
 Object.entries(controls).forEach(([id,value])=>setControl(document.getElementById(id),value));
 restoreRows(state.rows);
 if(runEvents){
   Object.keys(controls).forEach(id=>{
     const el=document.getElementById(id);if(!el)return;
     const eventName=(el.type==='checkbox'||el.tagName==='SELECT')?'change':'input';
     el.dispatchEvent(new Event(eventName,{bubbles:true}));
   });
 }
 return true;
}

/* Save any genuine user changes within Planner. */
document.addEventListener('input',e=>{if(!restoring&&e.target?.closest?.('#planner'))queueMicrotask(save)},true);
document.addEventListener('change',e=>{if(!restoring&&e.target?.closest?.('#planner'))queueMicrotask(save)},true);
document.addEventListener('click',e=>{
 if(e.target?.closest?.('#planner')&&(e.target.closest('[data-up],[data-down],[data-remove]')||e.target.id==='multiAddOfficer'||e.target.id==='multiUseCurrent'))setTimeout(save,0);
 const nav=e.target?.closest?.('.bottom-nav button[data-view="planner"]');
 if(nav)setTimeout(()=>restore(true),0);
},true);
window.addEventListener('pagehide',save);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save()});

/* Native init resets Multi-Officer Planner to one default row, so restore only after
   native startup has completed. Do a finite verification pass, then stop. */
window.addEventListener('load',()=>{
 setTimeout(()=>{
   restore(true);
   setTimeout(()=>{
     restore(true);
     restoring=false;
     document.documentElement.dataset.kowPlannerRestored='r10';
   },350);
 },500);
},{once:true});
})();
