/* KoW Companion v4.5.0 TEST — stability persistence r7 compatibility build. */
(function(){
'use strict';
window.KOW_V450_RUNTIME_DISABLED=true;window.KOW_STABILITY_BUILD='r7-compat';
const UI_KEY='kow_ui_state_v450';
const SUCCESS='Backup restored successfully. Officer profiles, Officer Badges Held and shared resources have been imported. The app will reload now.';
const FIELD_IDS=['officerSearch','officerSeasonFilter','officerRoleFilter','officerRarityFilter','compareOfficer','multiSavedPlans','multiPlanName','multiOrv','multiUniversal','multiChests','multiSelectionChests','multiChestMode','kowPlannerSession','kowPlannerSeasonFilter','kowFutureOfficerType','scenarioSession','scenarioOfficerCount','scenarioName','scenarioYear'];
const CHECK_IDS=['kowPlannerIncludeNotStarted','kowPlannerIncludeOriginals'];
let startupRestoring=true;
const readUI=()=>{try{return JSON.parse(localStorage.getItem(UI_KEY)||'{}')||{}}catch{return {}}};
const writeUI=patch=>{try{localStorage.setItem(UI_KEY,JSON.stringify(Object.assign(readUI(),patch)))}catch{}};
function saveOfficer(){if(startupRestoring)return;const s=document.getElementById('officerSelect');if(!s||s.selectedIndex<0)return;writeUI({officerValue:String(s.value),officerText:String(s.options[s.selectedIndex]?.textContent||'').trim()})}
function restoreOfficer(){const st=readUI(),s=document.getElementById('officerSelect');if(!s||!s.options.length)return;let i=-1;if(st.officerText)i=[...s.options].findIndex(o=>String(o.textContent||'').trim()===String(st.officerText).trim());if(i<0&&st.officerValue!==undefined)i=[...s.options].findIndex(o=>String(o.value)===String(st.officerValue));if(i>=0&&s.selectedIndex!==i){s.selectedIndex=i;s.dispatchEvent(new Event('change',{bubbles:true}))}}
function saveView(v){if(v&&!startupRestoring)writeUI({view:v})}
function restoreView(){const v=readUI().view,b=v&&document.querySelector('.bottom-nav button[data-view="'+CSS.escape(v)+'"]');if(b&&!b.classList.contains('active'))b.click()}
function saveField(el){if(el?.id&&!startupRestoring)writeUI({['field_'+el.id]:el.value})}
function saveCheck(el){if(el?.id&&!startupRestoring)writeUI({['check_'+el.id]:!!el.checked})}
function restoreFields(){const st=readUI();FIELD_IDS.forEach(id=>{const el=document.getElementById(id),k='field_'+id;if(!el||st[k]===undefined)return;const w=String(st[k]);if(el.tagName==='SELECT'&&![...el.options].some(o=>String(o.value)===w))return;el.value=w});CHECK_IDS.forEach(id=>{const el=document.getElementById(id),k='check_'+id;if(el&&st[k]!==undefined)el.checked=!!st[k]})}
function saveGroup(sel,key){if(startupRestoring)return;const b=[...document.querySelectorAll(sel)];if(!b.length)return;const s={};b.forEach(x=>s[x.value]=!!x.checked);writeUI({[key]:s})}
function restoreGroup(sel,key){const saved=readUI()[key];if(!saved)return;document.querySelectorAll(sel).forEach(x=>{if(Object.prototype.hasOwnProperty.call(saved,x.value))x.checked=!!saved[x.value]})}
const saveProgress=()=>saveGroup('.progressStatusFilter','progressStatusFilters');
const restoreProgress=()=>restoreGroup('.progressStatusFilter','progressStatusFilters');
const saveCompare=()=>saveGroup('.compareStatusFilter','compareStatusFilters');
const restoreCompare=()=>restoreGroup('.compareStatusFilter','compareStatusFilters');
function pickName(x){return String(x?.closest('label')?.querySelector('span')?.textContent||'').trim()}
function savePicks(){if(startupRestoring)return;writeUI({comparePickedOfficers:[...document.querySelectorAll('.progressComparePick:checked')].map(pickName).filter(Boolean)})}
function restorePicks(){const a=readUI().comparePickedOfficers;if(!Array.isArray(a))return;const set=new Set(a);document.querySelectorAll('.progressComparePick').forEach(x=>x.checked=set.has(pickName(x)))}
(function seed(){const st=readUI(),s=document.getElementById('officerSelect'),name=String(st.officerText||'').trim();if(name&&s&&!s.options.length){const o=document.createElement('option');o.value=String(st.officerValue??'');o.textContent=name;o.selected=true;s.appendChild(o)}restoreProgress();restoreCompare();restoreFields()})();
async function restoreBackupFile(file){const p=JSON.parse(await file.text());if(!p||!p.localStorage||typeof p.localStorage!=='object')throw new Error('Invalid KoW Companion backup file.');if(p.app&&p.app!=='KoW Companion')throw new Error('This is not a KoW Companion backup file.');localStorage.clear();Object.entries(p.localStorage).forEach(([k,v])=>{if(v!=null)localStorage.setItem(k,String(v))});alert(SUCCESS);location.reload()}
document.addEventListener('click',e=>{const nav=e.target.closest?.('.bottom-nav button[data-view]');if(nav)saveView(nav.dataset.view);if(e.target.closest?.('#restoreAppDataLabel')){const i=document.getElementById('restoreAppData');if(i)i.value=''}if(e.target?.id==='compareProgressSelectAll'||e.target?.id==='compareProgressClear')setTimeout(savePicks,0)},true);
document.addEventListener('change',async e=>{const el=e.target;if(!el)return;if(el.id==='restoreAppData'){e.stopImmediatePropagation();const f=el.files?.[0];if(!f)return;try{await restoreBackupFile(f)}catch(err){alert('Backup restore failed: '+(err?.message||String(err)));el.value=''}return}if(el.id==='officerSelect')saveOfficer();if(el.classList?.contains('progressStatusFilter'))saveProgress();if(el.classList?.contains('compareStatusFilter')){saveCompare();setTimeout(restorePicks,0)}if(el.classList?.contains('progressComparePick'))savePicks();if(FIELD_IDS.includes(el.id))saveField(el);if(CHECK_IDS.includes(el.id))saveCheck(el)},true);
document.addEventListener('input',e=>{if(FIELD_IDS.includes(e.target?.id))saveField(e.target)},true);
function saveAll(){if(startupRestoring)return;saveOfficer();saveProgress();saveCompare();savePicks();FIELD_IDS.forEach(id=>saveField(document.getElementById(id)));CHECK_IDS.forEach(id=>saveCheck(document.getElementById(id)))}
window.addEventListener('pagehide',saveAll);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')saveAll()});
window.addEventListener('load',()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{restoreFields();restoreProgress();restoreCompare();restoreOfficer();restoreView();setTimeout(()=>{restoreFields();restoreProgress();restoreCompare();restoreOfficer();restoreView();document.querySelectorAll('.compareStatusFilter').forEach(x=>x.dispatchEvent(new Event('change',{bubbles:true})));setTimeout(restorePicks,0);startupRestoring=false;document.documentElement.dataset.kowUiRestored='r7-compat'},500)}))},{once:true});
})();
