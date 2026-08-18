/* KoW Companion v4.5.0 TEST — stability persistence r9.
   Generic Planner persistence. No MutationObserver and no continuous polling. */
(function(){
'use strict';
window.KOW_STABILITY_BUILD='r9';
const KEY='kow_ui_state_v450_r9';
const LEGACY_KEYS=['kow_ui_state_v450_r8','kow_ui_state_v450'];
const read=()=>{try{let v=localStorage.getItem(KEY);if(v)return JSON.parse(v)||{};for(const k of LEGACY_KEYS){v=localStorage.getItem(k);if(v)return JSON.parse(v)||{}}}catch{}return {}};
const write=patch=>{try{localStorage.setItem(KEY,JSON.stringify(Object.assign(read(),patch)))}catch{}};

function plannerControls(){return [...document.querySelectorAll('#planner input[id],#planner select[id],#planner textarea[id]')].filter(el=>el.type!=='file');}
function savePlanner(){
 const state={};
 plannerControls().forEach(el=>{
   state[el.id]=(el.type==='checkbox'||el.type==='radio')?!!el.checked:String(el.value??'');
 });
 write({planner:state});
}
function applyPlannerValue(el,value){
 if(el.type==='checkbox'||el.type==='radio'){el.checked=!!value;return;}
 const v=String(value??'');
 if(el.tagName==='SELECT'&&![...el.options].some(o=>String(o.value)===v))return;
 el.value=v;
}
function restorePlanner(dispatch=false){
 const state=read().planner;if(!state||typeof state!=='object')return false;
 const touched=[];
 plannerControls().forEach(el=>{
   if(!Object.prototype.hasOwnProperty.call(state,el.id))return;
   applyPlannerValue(el,state[el.id]);touched.push(el);
 });
 if(dispatch){
   touched.forEach(el=>{
     const type=(el.type==='checkbox'||el.type==='radio'||el.tagName==='SELECT')?'change':'input';
     el.dispatchEvent(new Event(type,{bubbles:true}));
   });
 }
 return touched.length>0;
}

function compareKey(selector){const out={};document.querySelectorAll(selector).forEach(x=>out[x.value]=!!x.checked);return out;}
function saveCompare(){
 const filters=compareKey('.compareStatusFilter');
 const picks=[...document.querySelectorAll('.progressComparePick:checked')].map(x=>String(x.closest('label')?.querySelector('span')?.textContent||'').trim()).filter(Boolean);
 write({compareFilters:filters,comparePicks:picks});
}
function restoreCompare(){
 const st=read();
 if(st.compareFilters)document.querySelectorAll('.compareStatusFilter').forEach(x=>{if(Object.prototype.hasOwnProperty.call(st.compareFilters,x.value))x.checked=!!st.compareFilters[x.value]});
 if(Array.isArray(st.comparePicks)){
   const set=new Set(st.comparePicks);
   document.querySelectorAll('.progressComparePick').forEach(x=>{const n=String(x.closest('label')?.querySelector('span')?.textContent||'').trim();x.checked=set.has(n)});
 }
}

function saveAll(){savePlanner();saveCompare();}
function restoreAll(dispatchPlanner=false){restorePlanner(dispatchPlanner);restoreCompare();}

document.addEventListener('change',e=>{
 const el=e.target;if(!el)return;
 if(el.closest?.('#planner'))savePlanner();
 if(el.classList?.contains('compareStatusFilter')||el.classList?.contains('progressComparePick'))setTimeout(saveCompare,0);
},true);
document.addEventListener('input',e=>{if(e.target?.closest?.('#planner'))savePlanner()},true);
document.addEventListener('click',e=>{
 if(e.target?.id==='compareProgressSelectAll'||e.target?.id==='compareProgressClear')setTimeout(saveCompare,0);
 const plannerNav=e.target?.closest?.('.bottom-nav button[data-view="planner"],[data-go-view="planner"]');
 if(plannerNav)setTimeout(()=>restorePlanner(true),0);
},true);
document.addEventListener('focusin',e=>{if(e.target?.closest?.('#planner'))restorePlanner(false)},true);
window.addEventListener('pagehide',saveAll);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')saveAll()});

/* Finite startup reconciliation only. Native async init can rewrite Planner controls
   after DOMContentLoaded, so restore at load and a few bounded checkpoints, then stop. */
restoreAll(false);
document.addEventListener('DOMContentLoaded',()=>restoreAll(false),{once:true});
window.addEventListener('load',()=>{
 restoreAll(false);
 [250,750,1500,3000].forEach((ms,i)=>setTimeout(()=>{
   restoreAll(i===3);
   if(i===3)document.documentElement.dataset.kowUiRestored='r9';
 },ms));
},{once:true});
})();
