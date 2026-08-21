(function(){
  function n(v,d){v=Number(String(v==null?'':v).replace(/,/g,''));return Number.isFinite(v)?v:d;}
  function byId(id){return document.getElementById(id);}
  function txt(id){var e=byId(id);return e?String(e.textContent||e.value||'').trim():'';}
  function val(id,d){var e=byId(id);return e?n(e.value,d):d;}
  function f(v){return Math.max(0,Math.round(Number(v)||0)).toLocaleString();}
  function selectedOfficer(){var s=byId('officerSelect');if(!s||s.selectedIndex<0)return null;var name=(s.options[s.selectedIndex]&&s.options[s.selectedIndex].textContent||'').trim();if(!name)return null;return {name:name,season:txt('officerSeasonValue'),rarity:txt('officerRarityValue')||'Legendary',role:txt('officerRoleValue'),orv:val('orvCost',0),srv:val('srvCost',0)};}
  function cumulativeXp(level){level=Math.max(1,Math.min(70,n(level,1)));if(level<=1)return 0;if(level<=40)return 5806700*((level-1)/39);if(level<=50)return 5806700+16960000*((level-40)/10);if(level<=60)return 22766700+53430000*((level-50)/10);return 76196700+123450000*((level-60)/10);}
  function place(){var card=byId('v460UpgradeTargetsCard'),officer=byId('officer');if(card&&officer&&card.parentElement!==officer){officer.appendChild(card);card.style.marginTop='14px';card.style.marginBottom='120px';}}
  function applyMode(){var isMax=txt('v460TargetMode')==='max',level=byId('v460TargetLevel'),stars=byId('v460TargetStars'),training=byId('v460TargetTraining');if(isMax){if(level)level.value=70;if(stars)stars.value=5;if(training)training.value=180;}if(level)level.readOnly=isMax;if(training)training.readOnly=isMax;if(stars)stars.disabled=isMax;}
  function calculate(e){if(e){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}var r=byId('v460TargetResult'),o=selectedOfficer();if(!r)return false;if(!o){r.innerHTML='<strong>Select an Officer first.</strong>';return false;}
    var isMax=txt('v460TargetMode')==='max';if(isMax)applyMode();
    var tl=isMax?70:val('v460TargetLevel',70),ts=isMax?5:val('v460TargetStars',5),tt=isMax?180:val('v460TargetTraining',180),cl=val('currentLevel',0),cs=val('currentStar',0),ct=val('trainingExact',val('training',0));tl=Math.max(cl,Math.min(70,tl));ts=Math.max(cs,Math.min(5,ts));tt=Math.max(ct,Math.min(180,tt));
    var dl=Math.max(0,tl-cl),ds=Math.max(0,ts-cs),dt=Math.max(0,tt-ct),rec=[];if(dl)rec.push(dl+' Officer level'+(dl===1?'':'s'));if(ds)rec.push(ds+' Star level'+(ds===1?'':'s'));if(dt)rec.push(dt+' Training stage'+(dt===1?'':'s'));
    var rarity=o.rarity||'Legendary',readiness=String(o.season).toLowerCase()!=='original'&&o.orv>0;
    var xpNeed=Math.max(0,cumulativeXp(tl)-cumulativeXp(cl)),xpHeld=n(txt('xpHeld'),0),xpShort=Math.max(0,xpNeed-xpHeld);
    var starCum=[0,500,1500,8000,33000,98000],starNeed=Math.max(0,(starCum[ts]||0)-(starCum[cs]||0)),starHeld=n(txt('starsHeld'),0),starShort=Math.max(0,starNeed-starHeld);
    var trCost=rarity==='Elite'?100:rarity==='Epic'?25:5,badgeNeed=Math.max(0,tt-ct)*trCost;
    if(isMax){var maxTotal=rarity==='Elite'?18450:rarity==='Epic'?4950:1600,badgesUsed=n(txt('badgesUsed'),0);badgeNeed=Math.max(0,maxTotal-badgesUsed);}
    var badgeHeld=val('badgeHeld',0);if(rarity==='Legendary')badgeHeld+=val('universalBadgeHeld',0);else if(rarity==='Epic')badgeHeld+=val('universalEpicBadgeHeld',0);else badgeHeld+=val('universalEliteBadgeHeld',0);
    if(rarity==='Legendary'){var chestMode=byId('legendaryBadgeChestMode')?byId('legendaryBadgeChestMode').value:'badge',chests=val('legendaryBadgeChestHeld',0);if(chestMode==='badge')badgeHeld+=chests;var orvHeld=val('orvHeld',0)+(chestMode==='orv'?chests*600:0);if(readiness&&o.orv>0)badgeHeld+=Math.floor(orvHeld/o.orv);badgeHeld+=val('legendarySelectionChestHeld',0);}
    var badgeShort=Math.max(0,badgeNeed-badgeHeld);
    var html='<strong>'+o.name+'</strong><br><br><strong>Current:</strong> Level '+cl+' · '+cs+'★ · Training '+ct+'<br><strong>Target:</strong> Level '+tl+' · '+ts+'★ · Training '+tt+'<br><br><strong>Recommendation:</strong> '+(rec.length?'Develop '+rec.join(', ')+'.':'Target already achieved.')+'<br><br><strong>Resource requirement to target</strong><br><b>Officer XP:</b> '+f(xpNeed)+' required · '+f(xpHeld)+' held · <b>'+f(xpShort)+' shortfall</b><br><b>Officer Badges:</b> '+f(badgeNeed)+' required · '+f(badgeHeld)+' available · <b>'+f(badgeShort)+' shortfall</b><br>';
    if(rarity==='Legendary'&&readiness){html+='<b>ORV cost per badge:</b> '+f(o.orv)+'<br><b>ORV equivalent for badge shortfall:</b> '+f(badgeShort*o.orv)+'<br>';}
    html+='<b>'+rarity+' Star points:</b> '+f(starNeed)+' required · '+f(starHeld)+' available · <b>'+f(starShort)+' shortfall</b><br>';if(rarity==='Legendary'&&readiness&&o.srv>0&&starShort){var ex=Math.ceil(starShort/110);html+='<b>Exclusive Stars needed:</b> '+f(ex)+' · <b>SRV equivalent:</b> '+f(ex*o.srv)+'<br>';}
    html+='<br><small>Inventory is read for comparison only; nothing is spent or changed.</small>';r.innerHTML=html;r.style.background='rgba(213,167,47,.12)';return false;}
  function init(){place();var mode=byId('v460TargetMode'),button=byId('v460CalculateTarget');if(mode){mode.addEventListener('change',applyMode);applyMode();}if(button){var clone=button.cloneNode(true);button.parentNode.replaceChild(clone,button);clone.addEventListener('click',calculate,true);}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
