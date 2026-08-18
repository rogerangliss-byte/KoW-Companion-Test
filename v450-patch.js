/* KoW Companion v4.5.0 TEST — clean session-state module.
   Single finite persistence layer only. No MutationObserver, no polling, no service-worker rewriting. */
(function(){
'use strict';
window.KOW_SESSION_STATE_BUILD='clean-1';
const KEY='kow_session_state_v450_clean1';
let restoring=true;

function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return {}}}
function write(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch{}}
function activeView(){return document.querySelector('.bottom-nav button.active[data-view]')?.dataset?.view||''}
function pickName(x){return String(x?.closest('label')?.querySelector('span')?.textContent||'').trim()}
function checkboxMap(selector){const m={};document.querySelectorAll(selector).forEach(x=>m[x.value]=!!x.checked);return m}
function restoreCheckboxMap(selector,m){if(!m)return;document.querySelectorAll(selector).forEach(x=>{if(Object.prototype.hasOwnProperty.call(m,x.value))x.checked=!!m[x.value]})}
function plannerControls(){const p=document.getElementById('planner');return p?[...p.querySelectorAll('input[id],select[id],textarea[id]')].filter(x=>x.type!=='file'):[]}
function plannerRows(){return [...document.querySelectorAll('#multiPlannerRows tr')].map(tr=>({officer:String(tr.querySelector('[data-multi-officer]')?.value??''),needed:String(tr.querySelector('[data-multi-needed]')?.value??'0')}))}

function capture(){
 if(restoring)return;
 const state=read();
 const s=document.getElementById('officerSelect');
 const controls={};
 plannerControls().forEach(e=>controls[e.id]=(e.type==='checkbox'||e.type==='radio')?!!e.checked:String(e.value??''));
 state.officerValue=s?String(s.value):state.officerValue;
 state.officerText=s&&s.selectedIndex>=0?String(s.options[s.selectedIndex]?.textContent||'').trim():state.officerText;
 state.view=activeView()||state.view;
 state.progress=checkboxMap('.progressStatusFilter');
 state.compare=checkboxMap('.compareStatusFilter');
 state.comparePicks=[...document.querySelectorAll('.progressComparePick:checked')].map(pickName).filter(Boolean);
 state.plannerControls=controls;
 state.plannerRows=plannerRows();
 state.savedAt=new Date().toISOString();
 write(state);
}

function setValue(e,v){
 if(!e)return;
 if(e.type==='checkbox'||e.type==='radio'){e.checked=!!v;return;}
 const wanted=String(v??'');
 if(e.tagName==='SELECT'&&![...e.options].some(o=>String(o.value)===wanted))return;
 e.value=wanted;
}
function restoreOfficer(){
 const st=read(),s=document.getElementById('officerSelect');if(!s||!s.options.length)return;
 let i=-1;
 if(st.officerText)i=[...s.options].findIndex(o=>String(o.textContent||'').trim()===String(st.officerText).trim());
 if(i<0&&st.officerValue!==undefined)i=[...s.options].findIndex(o=>String(o.value)===String(st.officerValue));
 if(i>=0&&s.selectedIndex!==i){s.selectedIndex=i;s.dispatchEvent(new Event('change',{bubbles:true}));}
}
function restoreView(){
 const v=read().view;if(!v)return;
 const b=document.querySelector('.bottom-nav button[data-view="'+CSS.escape(v)+'"]');
 if(b&&!b.classList.contains('active'))b.click();
}
function setRowCount(target){
 target=Math.max(0,Number(target)||0);
 let count=document.querySelectorAll('#multiPlannerRows tr').length;
 const add=document.getElementById('multiAddOfficer');
 while(count<target&&add){add.click();count=document.querySelectorAll('#multiPlannerRows tr').length;}
 while(count>target){const row=[...document.querySelectorAll('#multiPlannerRows tr')].at(-1);const remove=row?.querySelector('[data-remove]');if(!remove)break;remove.click();count=document.querySelectorAll('#multiPlannerRows tr').length;}
}
function restoreRows(rows){
 if(!Array.isArray(rows)||!rows.length)return;
 setRowCount(rows.length);
 rows.forEach((r,i)=>{
   let row=document.querySelectorAll('#multiPlannerRows tr')[i];
   let sel=row?.querySelector('[data-multi-officer]');
   if(sel&&[...sel.options].some(o=>String(o.value)===String(r.officer))){sel.value=String(r.officer);sel.dispatchEvent(new Event('change',{bubbles:true}));}
   row=document.querySelectorAll('#multiPlannerRows tr')[i];
   const need=row?.querySelector('[data-multi-needed]');
   if(need){need.value=String(r.needed??0);need.dispatchEvent(new Event('input',{bubbles:true}));}
 });
}
function restorePlanner(){
 const st=read(),controls=st.plannerControls||{};
 plannerControls().forEach(e=>{if(Object.prototype.hasOwnProperty.call(controls,e.id))setValue(e,controls[e.id]);});
 restoreRows(st.plannerRows);
}
function restoreProgressAndCompare(){
 const st=read();
 restoreCheckboxMap('.progressStatusFilter',st.progress);
 restoreCheckboxMap('.compareStatusFilter',st.compare);
 if(Array.isArray(st.comparePicks)){
   const names=new Set(st.comparePicks);
   document.querySelectorAll('.progressComparePick').forEach(x=>x.checked=names.has(pickName(x)));
 }
}
function restoreAll(){restorePlanner();restoreProgressAndCompare();restoreOfficer();restoreView();}

/* Seed the saved Officer before native startup falls back to Liora. */
(function seedOfficer(){
 const st=read(),name=String(st.officerText||'').trim(),s=document.getElementById('officerSelect');
 if(name&&s&&!s.options.length){const o=document.createElement('option');o.value=String(st.officerValue??'');o.textContent=name;o.selected=true;s.appendChild(o);}
 restoreProgressAndCompare();
})();

document.addEventListener('input',e=>{if(!restoring&&(e.target?.closest?.('#planner')||e.target?.id==='officerSelect'))queueMicrotask(capture);},true);
document.addEventListener('change',e=>{if(!restoring)queueMicrotask(capture);},true);
document.addEventListener('click',e=>{
 if(!restoring&&(e.target?.closest?.('#planner')||e.target?.id==='compareProgressSelectAll'||e.target?.id==='compareProgressClear'))setTimeout(capture,0);
 if(e.target?.closest?.('.bottom-nav button[data-view="planner"]'))setTimeout(()=>restorePlanner(),20);
},true);
window.addEventListener('pagehide',capture);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')capture();});
window.addEventListener('load',()=>{
 [350,900,1800].forEach((ms,i)=>setTimeout(()=>{
   restoreAll();
   if(i===2){
     restoring=false;
     document.querySelectorAll('.progressStatusFilter').forEach(x=>x.dispatchEvent(new Event('change',{bubbles:true})));
     document.querySelectorAll('.compareStatusFilter').forEach(x=>x.dispatchEvent(new Event('change',{bubbles:true})));
     setTimeout(()=>{restoreProgressAndCompare();capture();document.documentElement.dataset.kowSessionState='clean-1';},0);
   }
 },ms));
},{once:true});
})();
