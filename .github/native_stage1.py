from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')


def rep(old, new, label):
    global s
    if old not in s:
        raise SystemExit(f'Missing expected source for {label}')
    s = s.replace(old, new, 1)


# Native application state helpers: finite, event-driven, no observers or polling.
rep(
    "const $=id=>document.getElementById(id);\n",
    """const $=id=>document.getElementById(id);

// v4.5.0 TEST — native working-state persistence.
const UI_STATE_KEY='kow_ui_state_v450_native1';
const PLANNER_WORKING_KEY='kow_planner_working_v450_native1';
function getUiState(){try{return JSON.parse(localStorage.getItem(UI_STATE_KEY)||'{}')||{}}catch{return {}}}
function saveUiState(patch){try{localStorage.setItem(UI_STATE_KEY,JSON.stringify(Object.assign(getUiState(),patch)))}catch{}}
function saveSelectedOfficerState(){
 const sel=$('officerSelect');if(!sel||sel.selectedIndex<0)return;
 saveUiState({officerName:String(sel.options[sel.selectedIndex]?.textContent||'').trim()});
}
function saveOfficerFilterState(){
 saveUiState({officerFilters:{search:$('officerSearch')?.value||'',season:$('officerSeasonFilter')?.value||'',rarity:$('officerRarityFilter')?.value||'',role:$('officerRoleFilter')?.value||''}});
}
function restoreOfficerFilterState(){
 const f=getUiState().officerFilters||{};
 if($('officerSearch'))$('officerSearch').value=f.search||'';
 if($('officerSeasonFilter')&&[...$('officerSeasonFilter').options].some(o=>o.value===String(f.season||'')))$('officerSeasonFilter').value=f.season||'';
 if($('officerRarityFilter')&&[...$('officerRarityFilter').options].some(o=>o.value===String(f.rarity||'')))$('officerRarityFilter').value=f.rarity||'';
 if($('officerRoleFilter')&&[...$('officerRoleFilter').options].some(o=>o.value===String(f.role||'')))$('officerRoleFilter').value=f.role||'';
}
function saveStatusFilterState(){
 const map=sel=>Object.fromEntries([...document.querySelectorAll(sel)].map(x=>[x.value,!!x.checked]));
 saveUiState({progressFilters:map('.progressStatusFilter'),compareFilters:map('.compareStatusFilter')});
}
function restoreStatusFilterState(){
 const st=getUiState();
 const apply=(sel,map)=>{if(!map)return;document.querySelectorAll(sel).forEach(x=>{if(Object.prototype.hasOwnProperty.call(map,x.value))x.checked=!!map[x.value]})};
 apply('.progressStatusFilter',st.progressFilters);apply('.compareStatusFilter',st.compareFilters);
}
function saveComparePickState(){
 const names=[...document.querySelectorAll('.progressComparePick:checked')].map(x=>String(x.closest('label')?.querySelector('span')?.textContent||'').trim()).filter(Boolean);
 saveUiState({comparePicks:names});
}
function restoreComparePickState(){
 const names=new Set(getUiState().comparePicks||[]);
 document.querySelectorAll('.progressComparePick').forEach(x=>{const n=String(x.closest('label')?.querySelector('span')?.textContent||'').trim();x.checked=names.has(n)});
}
function saveActiveViewState(view){if(view)saveUiState({view})}
function restoreActiveViewState(){
 const view=getUiState().view;if(!view)return;
 const b=document.querySelector('.bottom-nav button[data-view="'+CSS.escape(view)+'"]');if(b)b.click();
}
function getPlannerWorkingState(){try{return JSON.parse(localStorage.getItem(PLANNER_WORKING_KEY)||'{}')||{}}catch{return {}}}
function savePlannerWorkingState(){
 try{
  const ids=['multiPlanName','multiOrv','multiUniversal','multiChests','multiSelectionChests','multiChestMode','kowPlannerSession','kowPlannerSeasonFilter','kowFutureOfficerType','kowPlannerIncludeNotStarted','kowPlannerIncludeOriginals','scenarioSession','scenarioOfficerCount','scenarioName','scenarioYear','compareOfficerSelect'];
  const controls={};ids.forEach(id=>{const e=$(id);if(e)controls[id]=e.type==='checkbox'?!!e.checked:String(e.value??'')});
  localStorage.setItem(PLANNER_WORKING_KEY,JSON.stringify({controls,officers:multiPlanOfficers.map(x=>({officerIndex:+x.officerIndex||0,badgesNeeded:Math.max(0,+x.badgesNeeded||0)}))}));
 }catch{}
}
function restorePlannerWorkingState(){
 const st=getPlannerWorkingState(),controls=st.controls||{};
 Object.entries(controls).forEach(([id,v])=>{const e=$(id);if(!e)return;if(e.type==='checkbox')e.checked=!!v;else if(e.tagName!=='SELECT'||[...e.options].some(o=>o.value===String(v)))e.value=String(v)});
 multiPlanOfficers=Array.isArray(st.officers)&&st.officers.length?st.officers.map(x=>({officerIndex:+x.officerIndex||0,badgesNeeded:Math.max(0,+x.badgesNeeded||0)})):[{officerIndex:0,badgesNeeded:1600}];
 renderMultiPlanner();
}
""",
    'state helpers'
)

rep(
    "await loadOfficers();renderOfficerFilters();renderOfficerOptions();",
    "await loadOfficers();renderOfficerFilters();restoreOfficerFilterState();renderOfficerOptions(getUiState().officerName||undefined);",
    'Officer startup restore'
)
rep(
    "el.addEventListener(evt,()=>{renderOfficerOptions();calculate();populateCompareOfficers();buildUpgradeSummary()});",
    "el.addEventListener(evt,()=>{saveOfficerFilterState();renderOfficerOptions();saveSelectedOfficerState();calculate();populateCompareOfficers();buildUpgradeSummary()});",
    'Officer filters'
)
rep(
    "$('officerSelect').addEventListener('change',()=>{\n if(loadedOfficerProfileIndex!==null",
    "$('officerSelect').addEventListener('change',()=>{\n saveSelectedOfficerState();\n if(loadedOfficerProfileIndex!==null",
    'Officer selection'
)
rep(
    "document.querySelectorAll('.bottom-nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.bottom-nav button').forEach(x=>x.classList.remove('active'));",
    "document.querySelectorAll('.bottom-nav button').forEach(b=>b.onclick=()=>{saveActiveViewState(b.dataset.view);document.querySelectorAll('.bottom-nav button').forEach(x=>x.classList.remove('active'));",
    'active view'
)

# Multi-Officer Planner persists its actual native data model.
replacements = [
("tbody.querySelectorAll('[data-multi-officer]').forEach((el,i)=>el.onchange=()=>{multiPlanOfficers[i].officerIndex=+el.value;renderMultiPlanner();calculateMultiPlanner()});",
 "tbody.querySelectorAll('[data-multi-officer]').forEach((el,i)=>el.onchange=()=>{multiPlanOfficers[i].officerIndex=+el.value;renderMultiPlanner();calculateMultiPlanner();savePlannerWorkingState()});", 'row officer'),
("tbody.querySelectorAll('[data-multi-needed]').forEach((el,i)=>el.oninput=()=>{multiPlanOfficers[i].badgesNeeded=Math.max(0,+el.value||0);calculateMultiPlanner()});",
 "tbody.querySelectorAll('[data-multi-needed]').forEach((el,i)=>el.oninput=()=>{multiPlanOfficers[i].badgesNeeded=Math.max(0,+el.value||0);calculateMultiPlanner();savePlannerWorkingState()});", 'row need'),
("tbody.querySelectorAll('[data-up]').forEach((b,i)=>b.onclick=()=>{if(i){[multiPlanOfficers[i-1],multiPlanOfficers[i]]=[multiPlanOfficers[i],multiPlanOfficers[i-1]];renderMultiPlanner();calculateMultiPlanner()}});",
 "tbody.querySelectorAll('[data-up]').forEach((b,i)=>b.onclick=()=>{if(i){[multiPlanOfficers[i-1],multiPlanOfficers[i]]=[multiPlanOfficers[i],multiPlanOfficers[i-1]];renderMultiPlanner();calculateMultiPlanner();savePlannerWorkingState()}});", 'row up'),
("tbody.querySelectorAll('[data-down]').forEach((b,i)=>b.onclick=()=>{if(i<multiPlanOfficers.length-1){[multiPlanOfficers[i+1],multiPlanOfficers[i]]=[multiPlanOfficers[i],multiPlanOfficers[i+1]];renderMultiPlanner();calculateMultiPlanner()}});",
 "tbody.querySelectorAll('[data-down]').forEach((b,i)=>b.onclick=()=>{if(i<multiPlanOfficers.length-1){[multiPlanOfficers[i+1],multiPlanOfficers[i]]=[multiPlanOfficers[i],multiPlanOfficers[i+1]];renderMultiPlanner();calculateMultiPlanner();savePlannerWorkingState()}});", 'row down'),
("tbody.querySelectorAll('[data-remove]').forEach((b,i)=>b.onclick=()=>{multiPlanOfficers.splice(i,1);renderMultiPlanner();calculateMultiPlanner()});",
 "tbody.querySelectorAll('[data-remove]').forEach((b,i)=>b.onclick=()=>{multiPlanOfficers.splice(i,1);renderMultiPlanner();calculateMultiPlanner();savePlannerWorkingState()});", 'row remove'),
]
for old,new,label in replacements: rep(old,new,label)

rep(
    "refreshMultiSavedPlans();\n multiPlanOfficers=[{officerIndex:0,badgesNeeded:1600}];\n renderMultiPlanner();",
    "refreshMultiSavedPlans();\n restorePlannerWorkingState();",
    'Planner startup'
)
rep(
    "if($('multiAddOfficer'))$('multiAddOfficer').onclick=()=>{multiPlanOfficers.push({officerIndex:0,badgesNeeded:1600});renderMultiPlanner()};",
    "if($('multiAddOfficer'))$('multiAddOfficer').onclick=()=>{multiPlanOfficers.push({officerIndex:0,badgesNeeded:1600});renderMultiPlanner();savePlannerWorkingState()};",
    'Planner add'
)
rep(
    "if($('multiUseCurrent'))$('multiUseCurrent').onclick=()=>{const x=(typeof kowInvGet==='function'?kowInvGet():{});$('multiOrv').value=x.invOrv||0;$('multiUniversal').value=x.invUniversalLegendary||0;$('multiChests').value=x.invLegendaryBadgeChests||0;if($('multiSelectionChests'))$('multiSelectionChests').value=x.invLegendarySelectionChests||0;calculateMultiPlanner()};",
    "if($('multiUseCurrent'))$('multiUseCurrent').onclick=()=>{const x=(typeof kowInvGet==='function'?kowInvGet():{});$('multiOrv').value=x.invOrv||0;$('multiUniversal').value=x.invUniversalLegendary||0;$('multiChests').value=x.invLegendaryBadgeChests||0;if($('multiSelectionChests'))$('multiSelectionChests').value=x.invLegendarySelectionChests||0;calculateMultiPlanner();savePlannerWorkingState()};",
    'Planner current inventory'
)
rep(
    "['multiOrv','multiUniversal','multiChests','multiChestMode'].forEach(id=>{const el=$(id);if(el)el.addEventListener('input',calculateMultiPlanner)});",
    "['multiPlanName','multiOrv','multiUniversal','multiChests','multiSelectionChests','multiChestMode','kowPlannerSession','kowPlannerSeasonFilter','kowFutureOfficerType','kowPlannerIncludeNotStarted','kowPlannerIncludeOriginals','scenarioSession','scenarioOfficerCount','scenarioName','scenarioYear','compareOfficerSelect'].forEach(id=>{const el=$(id);if(!el)return;const evt=(el.type==='checkbox'||el.tagName==='SELECT')?'change':'input';el.addEventListener(evt,()=>{if(id.startsWith('multi'))calculateMultiPlanner();savePlannerWorkingState()})});",
    'Planner controls'
)
rep(
    "plans[name]={name,orv:+$('multiOrv').value||0,universal:+$('multiUniversal').value||0,chests:+$('multiChests').value||0,chestMode:$('multiChestMode').value,officers:multiPlanOfficers};",
    "plans[name]={name,orv:+$('multiOrv').value||0,universal:+$('multiUniversal').value||0,chests:+$('multiChests').value||0,selectionChests:+$('multiSelectionChests').value||0,chestMode:$('multiChestMode').value,officers:multiPlanOfficers};",
    'saved plan selection chests'
)
rep(
    "$('multiPlanName').value=p.name||name;$('multiOrv').value=p.orv||0;$('multiUniversal').value=p.universal||0;$('multiChests').value=p.chests||0;$('multiChestMode').value=p.chestMode||'optimise';multiPlanOfficers=Array.isArray(p.officers)?p.officers:[];renderMultiPlanner();",
    "$('multiPlanName').value=p.name||name;$('multiOrv').value=p.orv||0;$('multiUniversal').value=p.universal||0;$('multiChests').value=p.chests||0;if($('multiSelectionChests'))$('multiSelectionChests').value=p.selectionChests||0;$('multiChestMode').value=p.chestMode||'optimise';multiPlanOfficers=Array.isArray(p.officers)?p.officers:[];renderMultiPlanner();savePlannerWorkingState();",
    'load named plan'
)

# Progress / Compare persistence.
rep("document.addEventListener('DOMContentLoaded',()=>setTimeout(renderSavedOfficerProgress,0));",
    "document.addEventListener('DOMContentLoaded',()=>{restoreStatusFilterState();setTimeout(renderSavedOfficerProgress,0)});", 'Progress restore')
rep("box.dataset.compareRows=JSON.stringify(rows);",
    "box.dataset.compareRows=JSON.stringify(rows);restoreComparePickState();", 'Compare picks restore')
rep("if(all)all.onclick=()=>document.querySelectorAll('.progressComparePick').forEach(x=>x.checked=true);",
    "if(all)all.onclick=()=>{document.querySelectorAll('.progressComparePick').forEach(x=>x.checked=true);saveComparePickState()};", 'Compare all')
rep("if(clear)clear.onclick=()=>{document.querySelectorAll('.progressComparePick').forEach(x=>x.checked=false);document.getElementById('compareProgressResultsWrap').style.display='none';document.getElementById('compareProgressRecommendation').style.display='none';};",
    "if(clear)clear.onclick=()=>{document.querySelectorAll('.progressComparePick').forEach(x=>x.checked=false);saveComparePickState();document.getElementById('compareProgressResultsWrap').style.display='none';document.getElementById('compareProgressRecommendation').style.display='none';};", 'Compare clear')
rep("document.addEventListener('DOMContentLoaded',setupProgressComparison);",
    "document.addEventListener('DOMContentLoaded',()=>{restoreStatusFilterState();setupProgressComparison();document.addEventListener('change',e=>{if(e.target?.classList?.contains('progressComparePick'))saveComparePickState()})});", 'Compare setup')
rep("document.querySelectorAll('.progressStatusFilter').forEach(x=>x.addEventListener('change',()=>{\n   renderSavedOfficerProgress();",
    "document.querySelectorAll('.progressStatusFilter').forEach(x=>x.addEventListener('change',()=>{\n   saveStatusFilterState();renderSavedOfficerProgress();", 'Progress save')
rep("document.querySelectorAll('.compareStatusFilter').forEach(x=>x.addEventListener('change',()=>{\n   renderProgressCompareChoices();",
    "document.querySelectorAll('.compareStatusFilter').forEach(x=>x.addEventListener('change',()=>{\n   saveStatusFilterState();renderProgressCompareChoices();", 'Compare save')

rep("renderSkillStrands();renderDb();calculate();populateCompareOfficers();buildUpgradeSummary();\n window.addEventListener('resize',applyResponsivePageBackground);",
    "renderSkillStrands();renderDb();calculate();populateCompareOfficers();buildUpgradeSummary();restoreStatusFilterState();restoreComparePickState();saveSelectedOfficerState();setTimeout(restoreActiveViewState,0);\n window.addEventListener('resize',applyResponsivePageBackground);", 'final restore')

# Correct chest wording: Selection Chests are specific Officer badges only; ordinary Badge Chests carry the 600 ORV option.
rep(
"""      <div class="notice">
        Each Selection Chest can be used as either <b>1 Universal Legendary Badge</b> or
        <b><span id="selectionChestOrvValue">600</span> Officer Readiness Vouchers</b>.
        The ORV value follows the highest ORV-per-badge cost in the latest published season.
      </div>
      <label>Use Selection Chests as</label>
      <select id="legendaryBadgeChestMode">
        <option value="badge">Universal Legendary Badges</option>
        <option value="orv">Officer Readiness Vouchers</option>
      </select>""",
"""      <div class="notice">
        Each <b>Legendary Officer Badge Chest</b> can be used as either <b>1 Universal Legendary Badge</b> or <b>600 Officer Readiness Vouchers</b>. A chest cannot count as both.
      </div>
      <label>Use Legendary Officer Badge Chests as</label>
      <select id="legendaryBadgeChestMode">
        <option value="badge">Universal Legendary Badges (1 each)</option>
        <option value="orv">Officer Readiness Vouchers (600 each)</option>
      </select>""", 'chest UI')
s=s.replace('<div class="stat"><span>ORV generated from Selection Chests</span><b id="selectionChestOrvGenerated">0</b></div>',
            '<div class="stat"><span>ORV generated from Legendary Officer Badge Chests</span><b id="selectionChestOrvGenerated">0</b></div>',1)

rep(
""" const selectionChests=officerRarity(o)==='Legendary'?+$('legendaryBadgeChestHeld').value:0;
 const selectionMode=$('legendaryBadgeChestMode').value;
 const latestOrvCost=latestSeasonOrvCost();
 const selectionChestBadges=selectionMode==='badge'?selectionChests:0;
 const selectionChestOrv=selectionMode==='orv'?selectionChests*latestOrvCost:0;
 const universalBadgesAvailable=universalBadgesHeld+selectionChestBadges;""",
""" const badgeChests=officerRarity(o)==='Legendary'?+$('legendaryBadgeChestHeld').value:0;
 const badgeChestMode=$('legendaryBadgeChestMode').value;
 const badgeChestBadges=badgeChestMode==='badge'?badgeChests:0;
 const badgeChestOrv=badgeChestMode==='orv'?badgeChests*600:0;
 const specificSelectionChests=officerRarity(o)==='Legendary'&&selectionChestEligibleOfficer(o)?+$('legendarySelectionChestHeld').value:0;
 const universalBadgesAvailable=universalBadgesHeld+badgeChestBadges+specificSelectionChests;""", 'chest calculation')
rep(" const directOrv=+$('orvHeld').value;\n const orvHeld=directOrv+selectionChestOrv;\n $('selectionChestOrvValue').textContent=fmt(latestOrvCost);\n $('selectionChestOrvGenerated').textContent=fmt(selectionChestOrv);",
    " const directOrv=+$('orvHeld').value;\n const orvHeld=directOrv+badgeChestOrv;\n $('selectionChestOrvGenerated').textContent=fmt(badgeChestOrv);", 'badge chest ORV')
rep("return LEGENDARY_SELECTION_CHEST_ELIGIBLE.has(String(o?.name||o||'').trim());",
    "return LEGENDARY_SELECTION_CHEST_ELIGIBLE.has(String(o?.name||o||'').trim().replace(/^S\\d+\\s+/i,''));", 'selection eligibility')
rep("const shared=numericText('universalBadgeHeld')+numericText('legendaryBadgeChestHeld');",
    "const shared=numericText('universalBadgeHeld')+($('legendaryBadgeChestMode')?.value==='badge'?numericText('legendaryBadgeChestHeld'):0)+(selectionChestEligibleOfficer(o)?numericText('legendarySelectionChestHeld'):0);", 'optimiser chests')

# Separate Selection Chest global resource persistence.
rep("legendaryBadgeChestHeld:$('legendaryBadgeChestHeld').value,\n  legendaryBadgeChestMode:$('legendaryBadgeChestMode').value,",
    "legendaryBadgeChestHeld:$('legendaryBadgeChestHeld').value,\n  legendarySelectionChestHeld:$('legendarySelectionChestHeld').value,\n  legendaryBadgeChestMode:$('legendaryBadgeChestMode').value,", 'capture selection')
rep("$('legendaryBadgeChestHeld').value=d.legendaryBadgeChestHeld??0;\n  $('legendaryBadgeChestMode').value=d.legendaryBadgeChestMode??'badge';",
    "$('legendaryBadgeChestHeld').value=d.legendaryBadgeChestHeld??0;\n  $('legendarySelectionChestHeld').value=d.legendarySelectionChestHeld??0;\n  $('legendaryBadgeChestMode').value=d.legendaryBadgeChestMode??'badge';", 'apply selection')
rep("'legendaryBadgeChestHeld','legendaryBadgeChestMode','orvHeld'",
    "'legendaryBadgeChestHeld','legendarySelectionChestHeld','legendaryBadgeChestMode','orvHeld'", 'autosave selection')
rep("['universalBadgeHeld','legendaryBadgeChestHeld','legendaryBadgeChestMode'].forEach(id=>{",
    "['universalBadgeHeld','legendaryBadgeChestHeld','legendarySelectionChestHeld','legendaryBadgeChestMode'].forEach(id=>{", 'calculate selection')

# Fix Central Inventory bridge IDs while here.
s=s.replace("['universalLegendaryHeld','invUniversalLegendary']","['universalBadgeHeld','invUniversalLegendary']",1)
s=s.replace("if(sel&&x.officerBadges)kowInvField('officerBadgesHeld',x.officerBadges[sel.value]||0);",
            "if(sel&&x.officerBadges){const name=sel.options[sel.selectedIndex]?.textContent?.trim()||'';kowInvField('badgeHeld',x.officerBadges[name]||0);}",1)

s=s.replace(
    "Each <b>Legendary Officer Badge Selection Chest</b> can be used as <b>either</b> 1 Universal Legendary Badge <b>or</b> converted to the latest-Season Officer Readiness Voucher (ORV) value. A chest cannot count as both. With the current S7 database the benchmark is <b>600 ORV per chest</b>.",
    "Each <b>Legendary Officer Badge Selection Chest</b> gives <b>1 specific Legendary Officer Badge</b> for an Officer currently available in that chest. It does not convert to ORV. Each <b>Legendary Officer Badge Chest</b> can instead be used as either <b>1 Universal Legendary Badge</b> or <b>600 ORV</b>.",
    1
)

p.write_text(s, encoding='utf-8')
