/* KoW Companion v4.5.0 TEST — stability persistence r8.
   Direct UI persistence for Compare and Planner controls. */
(function(){
'use strict';
window.KOW_STABILITY_BUILD='r8';
const KEY='kow_ui_state_v450_r8';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return {}}};
const write=p=>{try{localStorage.setItem(KEY,JSON.stringify(Object.assign(read(),p)))}catch{}};
const fieldIds=['kowPlannerSession','kowPlannerSeasonFilter','kowFutureOfficerType','multiPlanName','multiSavedPlans','multiOrv','multiUniversal','multiChests','multiSelectionChests','multiChestMode','scenarioSession','scenarioOfficerCount','scenarioName','scenarioYear'];
const checkIds=['kowPlannerIncludeNotStarted','kowPlannerIncludeOriginals'];
function compareKey(cls){const out={};document.querySelectorAll(cls).forEach(x=>out[x.value]=!!x.checked);return out}
function saveCompareFilters(){write({compareFilters:compareKey('.compareStatusFilter')})}
function restoreCompareFilters(){const s=read().compareFilters;if(!s)return;document.querySelectorAll('.compareStatusFilter').forEach(x=>{if(Object.prototype.hasOwnProperty.call(s,x.value))x.checked=!!s[x.value]})}
function pickName(x){return String(x.closest('label')?.querySelector('span')?.textContent||'').trim()}
function saveComparePicks(){write({comparePicks:[...document.querySelectorAll('.progressComparePick:checked')].map(pickName).filter(Boolean)})}
function restoreComparePicks(){const a=read().comparePicks;if(!Array.isArray(a))return;const set=new Set(a);document.querySelectorAll('.progressComparePick').forEach(x=>x.checked=set.has(pickName(x)))}
function savePlanner(){const p={};fieldIds.forEach(id=>{const e=document.getElementById(id);if(e)p[id]=e.value});checkIds.forEach(id=>{const e=document.getElementById(id);if(e)p[id]=!!e.checked});write({planner:p})}
function restorePlanner(){const p=read().planner||{};fieldIds.forEach(id=>{const e=document.getElementById(id);if(!e||p[id]===undefined)return;const v=String(p[id]);if(e.tagName==='SELECT'&&![...e.options].some(o=>String(o.value)===v))return;e.value=v});checkIds.forEach(id=>{const e=document.getElementById(id);if(e&&p[id]!==undefined)e.checked=!!p[id]})}
function saveAll(){saveCompareFilters();saveComparePicks();savePlanner()}
function restoreAll(){restorePlanner();restoreCompareFilters();setTimeout(restoreComparePicks,0)}

document.addEventListener('change',e=>{const el=e.target;if(!el)return;if(el.classList?.contains('compareStatusFilter')){saveCompareFilters();setTimeout(()=>{restoreCompareFilters();restoreComparePicks()},0)}if(el.classList?.contains('progressComparePick'))saveComparePicks();if(fieldIds.includes(el.id)||checkIds.includes(el.id))savePlanner()},true);
document.addEventListener('input',e=>{if(fieldIds.includes(e.target?.id))savePlanner()},true);
document.addEventListener('click',e=>{if(e.target?.id==='compareProgressSelectAll'||e.target?.id==='compareProgressClear')setTimeout(saveComparePicks,0)},true);
window.addEventListener('pagehide',saveAll);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')saveAll()});

/* Apply immediately, then after native startup has rebuilt dynamic Compare choices. */
restoreAll();
window.addEventListener('DOMContentLoaded',()=>{restoreAll();setTimeout(restoreAll,100)}, {once:true});
window.addEventListener('load',()=>{restoreAll();setTimeout(()=>{restoreAll();document.documentElement.dataset.kowUiRestored='r8'},700)}, {once:true});
})();
