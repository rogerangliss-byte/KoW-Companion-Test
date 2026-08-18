/* KoW Companion v4.5.0 TEST 3 — Advanced Planning, corrected chest logic & stable optimiser selector. */
(function(){
'use strict';
const VERSION='4.5.0';
const TEST_BUILD='TEST 3';
const SELECTION_ELIGIBLE=new Set([
 'Katherine','Grace','Chloe','Ling','Jessica','Lilith','Angel','Sakura','Loubna','Angelica','Ophelia','Doireann',
 'S2 Natalia','S3 Sophia','S6 Emily','S6 Zoya'
]);
const $=id=>document.getElementById(id);
const n=id=>Math.max(0,Number($(id)?.value||0)||0);
const fmt=v=>Math.max(0,Math.round(Number(v)||0)).toLocaleString();
function selectedOfficerName(){return String($('officerSelect')?.selectedOptions?.[0]?.textContent||'').trim();}
function selectionEligible(){return SELECTION_ELIGIBLE.has(selectedOfficerName());}
function rarity(){return String($('officerRarityValue')?.textContent||'Legendary').trim();}
function seasonal(){return String($('officerSeasonValue')?.textContent||'').trim().toLowerCase()!=='original';}
function orvCost(){const v=Number($('orvCost')?.value);return Number.isFinite(v)&&v>0?v:0;}
function progressBadgeNeed(){
 const text=String($('upgradeSummary')?.textContent||'');
 const m=text.match(/Officer Badges remaining:\s*([\d,]+)/i);
 return m?Number(m[1].replace(/,/g,''))||0:Math.max(0,Number(String($('badgesRequired')?.textContent||'0').replace(/,/g,''))||0);
}
function inventory(){
 try{return JSON.parse(localStorage.getItem('kow_central_inventory_v1')||'{}')||{}}catch(_){return {}}
}
function fixChestUI(){
 const badgeChest=$('legendaryBadgeChestHeld'), selection=$('legendarySelectionChestHeld'), mode=$('legendaryBadgeChestMode');
 if(badgeChest){const l=badgeChest.previousElementSibling;if(l&&l.tagName==='LABEL')l.textContent='Legendary Officer Badge Chests Held';}
 if(selection){const l=selection.previousElementSibling;if(l&&l.tagName==='LABEL')l.textContent='Legendary Officer Badge Selection Chests Held';}
 if(mode){
   const l=mode.previousElementSibling;if(l&&l.tagName==='LABEL')l.textContent='Use Legendary Officer Badge Chests as';
   if(!mode.dataset.v450options){
     const previous=mode.value||'optimise';
     mode.innerHTML='<option value="optimise">Optimise automatically</option><option value="badge">Universal Legendary Badges (1 each)</option><option value="orv">Officer Readiness Vouchers (600 each)</option>';
     if([...mode.options].some(o=>o.value===previous))mode.value=previous;
     mode.dataset.v450options='1';
   }
 }
 const badNotice=[...document.querySelectorAll('#development .notice')].find(x=>/Each Selection Chest can be used as either/i.test(x.textContent||''));
 if(badNotice)badNotice.innerHTML='Each <b>Legendary Officer Badge Chest</b> gives either <b>1 Universal Legendary Officer Badge</b> or <b>600 Officer Readiness Vouchers (ORV)</b>. The Smart Planner can choose the more useful route.';
 const goodNotice=[...document.querySelectorAll('#development .notice')].find(x=>/gives 1 specific Legendary Officer Badge/i.test(x.textContent||''));
 if(goodNotice)goodNotice.innerHTML='Each <b>Legendary Officer Badge Selection Chest</b> gives <b>1 eligible individual Officer Badge</b>. It has <b>no ORV option</b> and does not become a Universal Badge.';
 const gen=$('selectionChestOrvGenerated');if(gen){const row=gen.closest('.stat');if(row)row.querySelector('span').textContent='ORV generated from Legendary Officer Badge Chests';}
 const val=$('selectionChestOrvValue');if(val)val.textContent='600';
 const multiMode=$('multiChestMode');if(multiMode){const l=multiMode.previousElementSibling;if(l&&l.tagName==='LABEL')l.textContent='Legendary Badge Chest strategy';}
 const multiSel=$('multiSelectionChests');if(multiSel&&!multiSel.dataset.v450wired){multiSel.dataset.v450wired='1';multiSel.addEventListener('input',()=>setTimeout(renderSmartPlanner,0));}
}
function chooseBadgeChestRoute(need,universal,orv,cost,chests,mode,canOrv){
 if(!chests)return {badge:0,orvChests:0,generatedOrv:0};
 if(mode==='badge'||!canOrv)return {badge:chests,orvChests:0,generatedOrv:0};
 if(mode==='orv')return {badge:0,orvChests:chests,generatedOrv:chests*600};
 const viaOrv=cost>0?600/cost:0;
 if(viaOrv>1)return {badge:0,orvChests:chests,generatedOrv:chests*600};
 return {badge:chests,orvChests:0,generatedOrv:0};
}
function smartFunding(){
 const inv=inventory(), name=selectedOfficerName(), need=progressBadgeNeed(), isLegendary=rarity()==='Legendary';
 const individual=Math.max(n('badgeHeld'),Number(inv.officerBadges?.[name]||0)||0);
 const selectionChests=isLegendary?n('legendarySelectionChestHeld'):0;
 const eligibleSelection=isLegendary&&selectionEligible();
 const selectionUsed=eligibleSelection?Math.min(need,selectionChests):0;
 let remaining=Math.max(0,need-individual-selectionUsed);
 const universal=isLegendary?n('universalBadgeHeld'):(rarity()==='Epic'?n('universalEpicBadgeHeld'):n('universalEliteBadgeHeld'));
 const universalUsed=Math.min(remaining,universal);remaining-=universalUsed;
 const chests=isLegendary?n('legendaryBadgeChestHeld'):0;
 const mode=$('legendaryBadgeChestMode')?.value||'optimise';
 const cost=orvCost(), canOrv=isLegendary&&seasonal()&&cost>0;
 const route=chooseBadgeChestRoute(remaining,universal,n('orvHeld'),cost,chests,mode,canOrv);
 const chestBadgeUsed=Math.min(remaining,route.badge);remaining-=chestBadgeUsed;
 const totalOrv=canOrv?n('orvHeld')+route.generatedOrv:0;
 const orvBadgeUsed=canOrv?Math.min(remaining,Math.floor(totalOrv/cost)):0;remaining-=orvBadgeUsed;
 const covered=Math.max(0,need-remaining);
 return {name,need,individual,selectionChests,eligibleSelection,selectionUsed,universal,universalUsed,chests,mode,route,chestBadgeUsed,totalOrv,orvBadgeUsed,remaining,covered,cost,canOrv};
}
function renderSmartDevelopment(){
 const host=$('development')?.querySelector('article.card');if(!host)return;
 let box=$('v450ChestSummary');if(!box){box=document.createElement('div');box.id='v450ChestSummary';box.className='notice';host.appendChild(box);}
 const f=smartFunding();
 const selText=f.selectionChests?(f.eligibleSelection?`${fmt(f.selectionUsed)} used as individual ${f.name} Badges`:`0 usable — ${f.name||'selected Officer'} is not currently in the Selection Chest pool`):'0 held';
 const chestText=f.chests?`${fmt(f.chestBadgeUsed)} used as Universal Badges${f.route.orvChests?` · ${fmt(f.route.orvChests)} converted to ${fmt(f.route.generatedOrv)} ORV`:''}`:'0 held';
 const html=`<b>v4.5 Smart Badge Funding — ${f.name||'Select an Officer'}</b><br>Individual Officer Badges: <b>${fmt(f.individual)}</b><br>Selection Chests: <b>${selText}</b><br>Universal ${rarity()} Badges used: <b>${fmt(f.universalUsed)}</b><br>Legendary Badge Chests: <b>${chestText}</b><br>ORV-funded Badges: <b>${fmt(f.orvBadgeUsed)}</b>${f.canOrv?` at ${fmt(f.cost)} ORV/Badge`:''}<br><b>${f.remaining===0?'✅ Fully Funded':'⚠️ Shortfall: '+fmt(f.remaining)+' Officer Badges'}</b>`;
 if(box.innerHTML!==html)box.innerHTML=html;
}
function ensureSmartPlannerCard(){
 const planner=$('planner');if(!planner)return null;
 let card=$('v450SmartPlannerCard');if(card)return card;
 card=document.createElement('article');card.id='v450SmartPlannerCard';card.className='card';
 card.innerHTML='<div class="eyebrow">v4.5.0 TEST 3</div><h2>🧠 Smart Resource Shortfall</h2><p class="muted">Preview the selected Officer using the corrected chest rules. Inventory is never spent or changed.</p><div id="v450SmartPlannerResult" class="result-box">Select an Officer and enter Inventory.</div>';
 const goals=[...planner.querySelectorAll('article.card')].find(x=>/Goals Planner/i.test(x.textContent||''));
 if(goals)goals.insertAdjacentElement('afterend',card);else planner.prepend(card);
 return card;
}
function renderSmartPlanner(){
 ensureSmartPlannerCard();const box=$('v450SmartPlannerResult');if(!box)return;const f=smartFunding();
 const status=f.remaining===0?'✅ FULLY FUNDED':f.covered>0?'🟠 PARTIALLY FUNDED':'🔴 SHORTFALL';
 const selectionRule=f.selectionChests?(f.eligibleSelection?`${fmt(f.selectionUsed)} Selection Chest${f.selectionUsed===1?'':'s'} allocated directly to ${f.name}.`:`Selection Chests held, but ${f.name} is not in the current eligible pool.`):'No Selection Chests allocated.';
 const html=`<b>${status} — ${f.name||'Selected Officer'}</b><br>Required Officer Badges from current progress: <b>${fmt(f.need)}</b><br>Individual Officer Badges: <b>${fmt(f.individual)}</b><br>${selectionRule}<br>Universal badges allocated: <b>${fmt(f.universalUsed)}</b><br>Legendary Badge Chest allocation: <b>${fmt(f.chestBadgeUsed)} badge route</b>${f.route.orvChests?` · <b>${fmt(f.route.orvChests)} ORV route (${fmt(f.route.generatedOrv)} ORV)</b>`:''}<br>ORV-funded badges: <b>${fmt(f.orvBadgeUsed)}</b><br><b>Remaining badge shortfall: ${fmt(f.remaining)}</b><br><span class="muted">Rule check: Selection Chests = 1 eligible individual Officer Badge only. Badge Chests = 1 Universal Legendary Badge or 600 ORV.</span>`;
 if(box.innerHTML!==html)box.innerHTML=html;
}
function populateOptimiserOfficerSelect(){
 const target=$('compareOfficerSelect'), source=$('officerSelect');
 if(!target||!source||!source.options.length)return;
 const current=String(source.value??'');
 const previous=String(target.value??'');
 const desired=[...source.options].filter(o=>String(o.textContent||'').trim() && String(o.value)!==current).map(o=>({value:String(o.value),text:String(o.textContent||'').trim()}));
 const signature=JSON.stringify([current,desired]);
 if(target.dataset.v450signature===signature)return;
 const frag=document.createDocumentFragment();
 frag.appendChild(new Option('Select Officer',''));
 desired.forEach(o=>frag.appendChild(new Option(o.text,o.value)));
 target.replaceChildren(frag);
 target.dataset.v450signature=signature;
 if(previous && [...target.options].some(o=>o.value===previous))target.value=previous;
}
function fixHelp(){
 document.querySelectorAll('#help p').forEach(p=>{
   if(/Each Legendary Officer Badge Selection Chest can be used as either/i.test(p.textContent||''))p.innerHTML='Each <b>Legendary Officer Badge Chest</b> gives either <b>1 Universal Legendary Officer Badge</b> or <b>600 ORV</b>. Each <b>Legendary Officer Badge Selection Chest</b> gives <b>1 eligible individual Officer Badge only</b> and has no ORV option.';
 });
 const heading=$('whatsNewV4329')?.querySelector('h3');if(heading)heading.textContent='✨ What’s New — v4.5.0 TEST 3';
}
function versionUI(){
 document.title='KoW Companion v4.5.0 TEST';
 ['headerVersion','installedVersion','aboutVersion'].forEach(id=>{if($(id))$(id).textContent='v'+VERSION;});
 const banner=$('helpPortraitTestBanner');if(banner)banner.textContent='ENGLISH TEST VERSION — v4.5.0 TEST 3 — STABLE OPTIMISER SELECTOR — NOT LIVE';
 const integrity=$('versionIntegrity');if(integrity)integrity.innerHTML='<b>Build integrity: OK</b><br>Header, Settings and About all report v4.5.0 TEST 3.';
}
function refresh(){fixChestUI();renderSmartDevelopment();renderSmartPlanner();versionUI();}
function start(){
 fixChestUI();fixHelp();ensureSmartPlannerCard();populateOptimiserOfficerSelect();refresh();
 ['legendaryBadgeChestHeld','legendarySelectionChestHeld','legendaryBadgeChestMode','orvHeld','universalBadgeHeld','universalEpicBadgeHeld','universalEliteBadgeHeld','badgeHeld','officerSelect'].forEach(id=>{const el=$(id);if(!el||el.dataset.v450wired)return;el.dataset.v450wired='1';el.addEventListener('input',()=>setTimeout(refresh,0));el.addEventListener('change',()=>{if(id==='officerSelect')setTimeout(populateOptimiserOfficerSelect,0);setTimeout(refresh,0);});});
 const compare=$('compareOfficerSelect');if(compare&&!compare.dataset.v450wired){compare.dataset.v450wired='1';compare.addEventListener('change',()=>{try{window.buildUpgradeSummary?.()}catch(_){}});}
 document.addEventListener('click',e=>{if(e.target?.dataset?.view==='planner')setTimeout(()=>{populateOptimiserOfficerSelect();refresh();},25);});
 setTimeout(()=>{populateOptimiserOfficerSelect();refresh();},100);
 setTimeout(()=>{populateOptimiserOfficerSelect();refresh();},400);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.KOW_V450={smartFunding,renderSmartPlanner,renderSmartDevelopment,populateOptimiserOfficerSelect,selectionEligible,SELECTION_ELIGIBLE};
})();
