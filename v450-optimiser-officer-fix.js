/* KoW Companion v4.5.0 TEST — Resource Optimiser Officer selector fix */
(function(){
'use strict';
function findOptimiserSelect(){
 const headings=[...document.querySelectorAll('h1,h2,h3')];
 const heading=headings.find(h=>/Resource Optimiser/i.test(h.textContent||''));
 if(!heading)return null;
 const card=heading.closest('article,.card,section,div');
 if(!card)return null;
 return card.querySelector('select');
}
function populate(){
 const target=findOptimiserSelect();
 const source=document.getElementById('officerSelect');
 if(!target||!source||!source.options.length)return;
 const previous=target.value;
 const sourceOptions=[...source.options].filter(o=>String(o.textContent||'').trim());
 if(target.options.length<=1 || ![...target.options].some(o=>o.value)){
   target.innerHTML='<option value="">Select Officer</option>' + sourceOptions.map(o=>{
     const text=String(o.textContent||'').trim();
     const value=String(o.value??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
     return '<option value="'+value+'">'+text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</option>';
   }).join('');
   if(previous && [...target.options].some(o=>o.value===previous))target.value=previous;
 }
}
function start(){
 populate();
 setTimeout(populate,100);
 setTimeout(populate,400);
 document.addEventListener('click',e=>{
   if(e.target?.dataset?.view==='planner')setTimeout(populate,50);
 });
 const obs=new MutationObserver(()=>{clearTimeout(start._t);start._t=setTimeout(populate,40)});
 obs.observe(document.body,{subtree:true,childList:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.KOW_V450_OPTIMISER_FIX={populate};
})();
