/* KoW Companion v4.5.0 TEST 1 — consolidated planning/chest module. */
(function(){
'use strict';
const VERSION='4.5.0';
const TEST_BUILD='TEST 1';
const SELECTION_ELIGIBLE=new Set([
 'Katherine','Grace','Chloe','Ling','Jessica','Lilith','Angel','Sakura','Loubna','Angelica','Ophelia','Doireann',
 'S2 Natalia','S3 Sophia','S6 Emily','S6 Zoya'
]);
const $=id=>document.getElementById(id);
const num=id=>Math.max(0,Number($(id)?.value||0)||0);
const textNum=id=>Math.max(0,Number(String($(id)?.textContent||'0').replace(/[^0-9.-]/g,''))||0);
const fmt=v=>Math.max(0,Math.round(Number(v)||0)).toLocaleString();
function selectedOfficerName(){return String($('officerSelect')?.selectedOptions?.[0]?.textContent||'').trim();}
function rarity(){return String($('officerRarityValue')?.textContent||'Legendary').trim();}
function seasonal(){return String($('officerSeasonValue')?.textContent||'').trim().toLowerCase()!=='original';}
function orvCost(){const v=Number($('orvCost')?.value);return Number.isFinite(v)&&v>0?v:0;}
function selectionEligible(name=selectedOfficerName()){return SELECTION_ELIGIBLE.has(String(name||'').trim());}
function inventory(){try{return JSON.parse(localStorage.getItem('kow_central_inventory_v1')||'{}')||{}}catch(_){return {}}}
function progressBadgeNeed(){
 const m=String($('upgradeSummary')?.textContent||'').match(/Officer Badges remaining:\s*([\d,]+)/i);
 if(m)return Number(m[1].replace(/,/g,''))||0;
 const max=rarity()==='Epic'?4950:rarity()==='Elite'?18450:1600;
 return Math.max(0,max-textNum('badgesUsed'));
}
function chooseBadgeChestRoute(chests,mode,cost,canOrv){
 chests=Math.max(0,Number(chests)||0);
 if(!chests)return {badge:0,orvChests:0,generatedOrv:0};
 if(mode==='orv'&&canOrv)return {badge:0,orvChests:chests,generatedOrv:chests*600};
 if(mode==='optimise'&&canOrv&&cost>0&&600/cost>1)return {badge:0,orvChests:chests,generatedOrv:chests*600};
 return {badge:chests,orvChests:0,generatedOrv:0};
}
function smartFunding(){
 const inv=inventory(),name=selectedOfficerName(),need=progressBadgeNeed(),r=rarity(),isLegendary=r==='Legendary';
 const individual=Math.max(num('badgeHeld'),Number(inv.officerBadges?.[name]||0)||0);
 let remaining=Math.max(0,need-individual);
 const selectionChests=isLegendary?num('legendarySelectionChestHeld'):0;
 const eligibleSelection=isLegendary&&selectionEligible(name);
 const selectionUsed=eligibleSelection?Math.min(remaining,selectionChests):0;remaining-=selectionUsed;
 const universal=isLegendary?num('universalBadgeHeld'):(r==='Epic'?num('universalEpicBadgeHeld'):num('universalEliteBadgeHeld'));
 const universalUsed=Math.min(remaining,universal);remaining-=universalUsed;
 const chests=isLegendary?num('legendaryBadgeChestHeld'):0;
 const mode=$('legendaryBadgeChestMode')?.value||'optimise';
 const cost=orvCost(),canOrv=isLegendary&&seasonal()&&cost>0;
 const route=chooseBadgeChestRoute(chests,mode,cost,canOrv);
 const chestBadgeUsed=Math.min(remaining,route.badge);remaining-=chestBadgeUsed;
 const directOrv=canOrv?num('orvHeld'):0;
 const totalOrv=directOrv+route.generatedOrv;
 const orvBadgeUsed=canOrv?Math.min(remaining,Math.floor(totalOrv/cost)):0;remaining-=orvBadgeUsed;
 const covered=Math.max(0,need-remaining);
 return {name,need,individual,selectionChests,eligibleSelection,selectionUsed,universal,universalUsed,chests,mode,route,chestBadgeUsed,directOrv,totalOrv,orvBadgeUsed,remaining,covered,cost,canOrv};
}
function fixChestUI(){
 const badgeChest=$('legendaryBadgeChestHeld'),selection=$('legendarySelectionChestHeld'),mode=$('legendaryBadgeChestMode');
 if(badgeChest){const l=badgeChest.previousElementSibling;if(l?.tagName==='LABEL')l.textContent='Legendary Officer Badge Chests Held';}
 if(selection){const l=selection.previousElementSibling;if(l?.tagName==='LABEL')l.textContent='Legendary Officer Badge Selection Chests Held';}
 if(mode){
  const l=mode.previousElementSibling;if(l?.tagName==='LABEL')l.textContent='Use Legendary Officer Badge Chests as';
  if(!mode.dataset.v450options){
   const prev=mode.value||'optimise';
   mode.innerHTML='<option value="optimise">Optimise automatically</option><option value="badge">Universal Legendary Badges (1 each)</option><option value="orv">Officer Readiness Vouchers (600 each)</option>';
   mode.value=[...mode.options].some(o=>o.value===prev)?prev:'optimise';
   mode.dataset.v450options='1';
  }
 }
 const notices=[...document.querySelectorAll('#development .notice')];
 const wrong=notices.find(x=>/Each Selection Chest can be used as either/i.test(x.textContent||''));
 if(wrong)wrong.innerHTML='Each <b>Legendary Officer Badge Chest</b> gives either <b>1 Universal Legendary Officer Badge</b> or <b>600 Officer Readiness Vouchers (ORV)</b>. A Badge Chest cannot count as both.';
 const selectionNotice=notices.find(x=>/gives 1 specific Legendary Officer Badge/i.test(x.textContent||''));
 if(selectionNotice)selectionNotice.innerHTML='Each <b>Legendary Officer Badge Selection Chest</b> gives <b>1 eligible individual Officer Badge</b>. It has <b>no ORV option</b> and does not become a Universal Badge.';
 const generated=$('selectionChestOrvGenerated');if(generated){const row=generated.closest('.stat');const label=row?.querySelector('span');if(label)label.textContent='ORV generated from Legendary Officer Badge Chests';}
 if($('selectionChestOrvValue'))$('selectionChestOrvValue').textContent='600';
 const mm=$('multiChestMode');if(mm){const l=mm.previousElementSibling;if(l?.tagName==='LABEL')l.textContent='Legendary Badge Chest strategy';}
}
function reconcileDevelopment(){
 const f=smartFunding(),r=rarity(),max=r==='Epic'?4950:r==='Elite'?18450:1600,used=textNum('badgesUsed');
 const flexibleAvailable=f.selectionUsed+f.universalUsed+f.chestBadgeUsed;
 if($('universalBadgesAvailable'))$('universalBadgesAvailable').textContent=fmt(flexibleAvailable);
 if($('selectionChestOrvGenerated'))$('selectionChestOrvGenerated').textContent=fmt(f.route.generatedOrv);
 if($('badgesFromOrv'))$('badgesFromOrv').textContent=fmt(f.orvBadgeUsed);
 if($('orvRemainder'))$('orvRemainder').textContent=fmt(Math.max(0,f.totalOrv-f.orvBadgeUsed*f.cost));
 if($('badgesRequired'))$('badgesRequired').textContent=fmt(f.remaining);
 if($('orvRequired'))$('orvRequired').textContent=fmt(f.canOrv?f.remaining*f.cost:0);
 if($('badgeBar'))$('badgeBar').style.width=Math.min(100,Math.max(0,100*(max-f.remaining)/max))+'%';
 if($('dashBadgesFromOrv'))$('dashBadgesFromOrv').textContent=fmt(f.orvBadgeUsed);
 if($('dashBadgesRequired'))$('dashBadgesRequired').textContent=fmt(f.remaining);
 return f;
}
function renderSmartDevelopment(){
 const host=$('development')?.querySelector('article.card');if(!host)return;
 let box=$('v450ChestSummary');if(!box){box=document.createElement('div');box.id='v450ChestSummary';box.className='notice';host.appendChild(box);}
 const f=reconcileDevelopment();
 const selection=f.selectionChests?(f.eligibleSelection?`${fmt(f.selectionUsed)} used directly as ${f.name} Badge${f.selectionUsed===1?'':'s'}`:`0 usable — ${f.name||'selected Officer'} is not in the current Selection Chest pool`):'0 held';
 const chest=f.chests?`${fmt(f.chestBadgeUsed)} used as Universal Badge${f.chestBadgeUsed===1?'':'s'}${f.route.orvChests?` · ${fmt(f.route.orvChests)} converted to ${fmt(f.route.generatedOrv)} ORV`:''}`:'0 held';
 box.innerHTML=`<b>v4.5 Smart Badge Funding — ${f.name||'Select an Officer'}</b><br>Individual Officer Badges: <b>${fmt(f.individual)}</b><br>Selection Chests: <b>${selection}</b><br>Universal ${rarity()} Badges used: <b>${fmt(f.universalUsed)}</b><br>Legendary Badge Chests: <b>${chest}</b><br>ORV-funded Badges: <b>${fmt(f.orvBadgeUsed)}</b>${f.canOrv?` at ${fmt(f.cost)} ORV/Badge`:''}<br><b>${f.remaining===0?'✅ Fully Funded':'⚠️ Shortfall: '+fmt(f.remaining)+' Officer Badges'}</b>`;
}
function ensureSmartPlannerCard(){
 const planner=$('planner');if(!planner)return null;
 let card=$('v450SmartPlannerCard');if(card)return card;
 card=document.createElement('article');card.id='v450SmartPlannerCard';card.className='card';
 card.innerHTML='<div class="eyebrow">v4.5.0 TEST 1</div><h2>🧠 Smart Resource Shortfall</h2><p class="muted">Preview the selected Officer using the corrected chest rules. Inventory is never spent or changed.</p><div id="v450SmartPlannerResult" class="result-box">Select an Officer and enter Inventory.</div>';
 const goals=[...planner.querySelectorAll('article.card')].find(x=>/Goals Planner/i.test(x.textContent||''));
 if(goals)goals.insertAdjacentElement('afterend',card);else planner.prepend(card);
 return card;
}
function renderSmartPlanner(){
 ensureSmartPlannerCard();const box=$('v450SmartPlannerResult');if(!box)return;const f=reconcileDevelopment();
 const status=f.remaining===0?'✅ FULLY FUNDED':f.covered>0?'🟠 PARTIALLY FUNDED':'🔴 SHORTFALL';
 const selection=f.selectionChests?(f.eligibleSelection?`${fmt(f.selectionUsed)} Selection Chest${f.selectionUsed===1?'':'s'} allocated directly to ${f.name}.`:`Selection Chests held, but ${f.name} is not in the current eligible pool.`):'No Selection Chests allocated.';
 box.innerHTML=`<b>${status} — ${f.name||'Selected Officer'}</b><br>Required Officer Badges from current progress: <b>${fmt(f.need)}</b><br>Individual Officer Badges: <b>${fmt(f.individual)}</b><br>${selection}<br>Universal badges allocated: <b>${fmt(f.universalUsed)}</b><br>Legendary Badge Chest allocation: <b>${fmt(f.chestBadgeUsed)} badge route</b>${f.route.orvChests?` · <b>${fmt(f.route.orvChests)} ORV route (${fmt(f.route.generatedOrv)} ORV)</b>`:''}<br>ORV-funded badges: <b>${fmt(f.orvBadgeUsed)}</b><br><b>Remaining badge shortfall: ${fmt(f.remaining)}</b><br><span class="muted">Selection Chest = 1 eligible individual Officer Badge only. Badge Chest = 1 Universal Legendary Badge or 600 ORV.</span>`;
}
function populateOptimiserOfficerSelect(){
 const target=$('compareOfficerSelect'),source=$('officerSelect');if(!target||!source||!source.options.length)return;
 const current=String(source.value??''),previous=String(target.value??'');
 const desired=[...source.options].filter(o=>String(o.textContent||'').trim()&&String(o.value)!==current).map(o=>({value:String(o.value),text:String(o.textContent||'').trim()}));
 const sig=JSON.stringify([current,desired]);if(target.dataset.v450signature===sig)return;
 const frag=document.createDocumentFragment();frag.appendChild(new Option('Select Officer',''));desired.forEach(o=>frag.appendChild(new Option(o.text,o.value)));target.replaceChildren(frag);target.dataset.v450signature=sig;
 if(previous&&[...target.options].some(o=>o.value===previous))target.value=previous;
}
function renderOptimiser(){
 const box=$('optimiserSummary'),hint=$('compareHint'),target=$('compareOfficerSelect');if(!box||!target)return;
 const name=selectedOfficerName(),value=target.value;if(value===''){if(hint)hint.textContent='Choose another Officer to compare badge efficiency.';return;}
 const bridge=window.KOW_PLANNER_BRIDGE,db=typeof bridge?.officers==='function'?bridge.officers():[];
 const primaryCost=orvCost(),other=db[Number(value)],otherCost=Number(other?.orv)||0,otherName=String(other?.name||target.selectedOptions?.[0]?.textContent||'Officer');
 if(hint)hint.innerHTML=`Comparing <b>${name}</b> with <b>${otherName}</b>.`;
 let recommendation='ORV comparison is not available for one of these Officers.';
 if(primaryCost&&otherCost){
  if(primaryCost<otherCost)recommendation=`Favour ORV on <b>${name}</b> and flexible Universal Legendary Badges / Legendary Badge Chests on <b>${otherName}</b>.`;
  else if(primaryCost>otherCost)recommendation=`Favour ORV on <b>${otherName}</b> and flexible Universal Legendary Badges / Legendary Badge Chests on <b>${name}</b>.`;
  else recommendation='Both Officers have the same ORV cost per badge; allocate flexible badges by upgrade priority.';
 }
 const f=smartFunding();
 box.innerHTML=`<b>${name}</b><br>Corrected current badge shortfall: <b>${fmt(f.remaining)}</b><br><span class="muted">Preview only — resources are not spent.</span><hr style="border:0;border-top:1px solid rgba(255,255,255,.1);margin:10px 0"><b>Comparison: ${name} vs ${otherName}</b><br>${name} ORV per Badge: <b>${primaryCost||'N/A'}</b><br>${otherName} ORV per Badge: <b>${otherCost||'N/A'}</b><div class="notice" style="margin-top:10px"><b>Suggested resource strategy:</b><br>${recommendation}</div>`;
}
function fixHelp(){
 document.querySelectorAll('#help p').forEach(p=>{if(/Each Legendary Officer Badge Selection Chest can be used as either/i.test(p.textContent||''))p.innerHTML='Each <b>Legendary Officer Badge Chest</b> gives either <b>1 Universal Legendary Officer Badge</b> or <b>600 ORV</b>. Each <b>Legendary Officer Badge Selection Chest</b> gives <b>1 eligible individual Officer Badge only</b> and has no ORV option.';});
 const h=$('whatsNewV4329')?.querySelector('h3');if(h)h.textContent='✨ What’s New — v4.5.0 TEST 1';
}
function versionUI(){
 document.title='KoW Companion v4.5.0 TEST';
 ['headerVersion','installedVersion','aboutVersion'].forEach(id=>{if($(id))$(id).textContent='v'+VERSION;});
 const banner=$('helpPortraitTestBanner')||$('englishTestBanner');if(banner)banner.textContent='ENGLISH TEST VERSION — v4.5.0 TEST 1 — CLEAN CONSOLIDATED BUILD — NOT LIVE';
 const integrity=$('versionIntegrity');if(integrity)integrity.innerHTML='<b>Build integrity: OK</b><br>Header, Settings and About all report v4.5.0 TEST 1.';
}
function refresh(){fixChestUI();renderSmartDevelopment();renderSmartPlanner();versionUI();}
function wire(id,fn){const el=$(id);if(!el||el.dataset.v450wired)return;el.dataset.v450wired='1';el.addEventListener('input',fn);el.addEventListener('change',fn);}
function start(){
 fixChestUI();fixHelp();ensureSmartPlannerCard();populateOptimiserOfficerSelect();refresh();
 ['legendaryBadgeChestHeld','legendarySelectionChestHeld','legendaryBadgeChestMode','orvHeld','universalBadgeHeld','universalEpicBadgeHeld','universalEliteBadgeHeld','badgeHeld'].forEach(id=>wire(id,()=>setTimeout(refresh,0)));
 wire('officerSelect',()=>setTimeout(()=>{populateOptimiserOfficerSelect();refresh();},0));
 wire('compareOfficerSelect',()=>setTimeout(renderOptimiser,0));
 document.querySelectorAll('.bottom-nav button[data-view="planner"]').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>{populateOptimiserOfficerSelect();refresh();},25)));
 setTimeout(()=>{populateOptimiserOfficerSelect();refresh();},120);
 setTimeout(()=>{populateOptimiserOfficerSelect();refresh();},500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.KOW_V450={smartFunding,renderSmartPlanner,renderSmartDevelopment,populateOptimiserOfficerSelect,renderOptimiser,selectionEligible,SELECTION_ELIGIBLE};
})();
