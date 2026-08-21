(function(){
  function n(v,d){v=Number(v);return Number.isFinite(v)?v:d;}
  function byId(id){return document.getElementById(id);}
  function f(v){return Math.max(0,Math.round(Number(v)||0)).toLocaleString();}
  function currentOfficerName(){
    var s=byId('officerSelect');
    if(!s||s.selectedIndex<0)return 'Selected Officer';
    return (s.options[s.selectedIndex]&&s.options[s.selectedIndex].textContent)||'Selected Officer';
  }
  function placeUpgradeTargets(){
    var card=byId('v460UpgradeTargetsCard');
    var officer=byId('officer');
    if(card&&officer&&card.parentElement!==officer){
      officer.appendChild(card);
      card.style.marginTop='14px';
      card.style.marginBottom='120px';
    }
    var result=byId('v460TargetResult');
    if(result){
      result.style.fontSize='1rem';
      result.style.lineHeight='1.55';
      result.style.borderWidth='2px';
      result.style.minHeight='92px';
      result.style.scrollMarginBottom='140px';
    }
  }
  function applyMode(){
    var mode=byId('v460TargetMode');
    if(mode&&mode.value==='max'){
      if(byId('v460TargetLevel'))byId('v460TargetLevel').value=70;
      if(byId('v460TargetStars'))byId('v460TargetStars').value=5;
      if(byId('v460TargetTraining'))byId('v460TargetTraining').value=180;
    }
  }
  function resourceBreakdown(tl,ts,tt,cl,cs,ct){
    var o=(typeof currentOfficer==='function')?currentOfficer():null;
    if(!o)return '';
    var rarity=(typeof officerRarity==='function')?officerRarity(o):'Legendary';
    var mode=byId('v460TargetMode');
    var isMax=!!(mode&&mode.value==='max');
    var readiness=o.readinessEligible!==false&&String(o.season||'').toLowerCase()!=='original';

    var xpNeed=(typeof cumulativeXp==='function')?Math.max(0,cumulativeXp(tl)-cumulativeXp(cl)):0;
    var xpHeld=0;
    if(typeof XP_DENOMS!=='undefined')XP_DENOMS.forEach(function(v){xpHeld+=n(byId('xp'+v)&&byId('xp'+v).value,0)*v;});
    var xpShort=Math.max(0,xpNeed-xpHeld);

    var starCum=(typeof STAR_CUM!=='undefined')?STAR_CUM:[0,500,1500,8000,33000,98000];
    var starNeed=Math.max(0,(starCum[ts]||0)-(starCum[cs]||0));
    var starHeld=0;
    if(rarity==='Epic')starHeld=n(byId('es1')&&byId('es1').value,0)*110+n(byId('es2')&&byId('es2').value,0)*420+n(byId('es3')&&byId('es3').value,0)*960;
    else if(rarity==='Elite')starHeld=n(byId('bs1')&&byId('bs1').value,0)*110+n(byId('bs2')&&byId('bs2').value,0)*420+n(byId('bs3')&&byId('bs3').value,0)*960;
    else starHeld=n(byId('ls1')&&byId('ls1').value,0)*110+n(byId('ls2')&&byId('ls2').value,0)*420+n(byId('ls3')&&byId('ls3').value,0)*960;
    var srvHeld=rarity==='Legendary'?n(byId('srvHeld')&&byId('srvHeld').value,0):0;
    if(rarity==='Legendary'&&readiness&&n(o.srv,0)>0)starHeld+=Math.floor(srvHeld/n(o.srv,1))*110;
    var starShort=Math.max(0,starNeed-starHeld);

    var trCost=(typeof trainingBadgeCost==='function')?trainingBadgeCost(o):(rarity==='Elite'?100:rarity==='Epic'?25:5);
    var badgeNeed=Math.max(0,tt-ct)*trCost;
    if(isMax&&typeof maxBadgesForOfficer==='function'&&typeof skillBadgesSpent==='function'){
      var used=(byId('unlocked')&&byId('unlocked').checked?10:0)+skillBadgesSpent()+ct*trCost;
      badgeNeed=Math.max(0,maxBadgesForOfficer(o)-used);
    }
    var badgeHeld=n(byId('badgeHeld')&&byId('badgeHeld').value,0);
    if(rarity==='Epic')badgeHeld+=n(byId('universalEpicBadgeHeld')&&byId('universalEpicBadgeHeld').value,0);
    else if(rarity==='Elite')badgeHeld+=n(byId('universalEliteBadgeHeld')&&byId('universalEliteBadgeHeld').value,0);
    else {
      badgeHeld+=n(byId('universalBadgeHeld')&&byId('universalBadgeHeld').value,0);
      var chestMode=byId('legendaryBadgeChestMode')&&byId('legendaryBadgeChestMode').value;
      if(chestMode==='badge')badgeHeld+=n(byId('legendaryBadgeChestHeld')&&byId('legendaryBadgeChestHeld').value,0);
      if(typeof selectionChestEligibleOfficer==='function'&&selectionChestEligibleOfficer(o))badgeHeld+=n(byId('legendarySelectionChestHeld')&&byId('legendarySelectionChestHeld').value,0);
      var orv=n(byId('orvHeld')&&byId('orvHeld').value,0);
      if(chestMode==='orv')orv+=n(byId('legendaryBadgeChestHeld')&&byId('legendaryBadgeChestHeld').value,0)*600;
      if(readiness&&n(o.orv,0)>0)badgeHeld+=Math.floor(orv/n(o.orv,1));
    }
    var badgeShort=Math.max(0,badgeNeed-badgeHeld);

    var extra=[];
    if(rarity==='Legendary'&&readiness&&n(o.orv,0)>0&&badgeShort)extra.push('<b>ORV equivalent for badge shortfall:</b> '+f(badgeShort*n(o.orv,0)));
    if(rarity==='Legendary'&&readiness&&n(o.srv,0)>0&&starShort){
      var ex=Math.ceil(starShort/110);
      extra.push('<b>Exclusive Stars needed for star shortfall:</b> '+f(ex)+' · <b>SRV equivalent:</b> '+f(ex*n(o.srv,0)));
    }
    var badgeLabel=isMax?'Officer Badges to MAX (remaining skills/unlock/training included)':'Officer Badges for target Training';
    return '<br><br><strong>Resource requirement to target</strong><br>'+
      '<b>Officer XP:</b> '+f(xpNeed)+' required · '+f(xpHeld)+' held · <b>'+f(xpShort)+' shortfall</b><br>'+
      '<b>'+badgeLabel+':</b> '+f(badgeNeed)+' required · '+f(badgeHeld)+' available · <b>'+f(badgeShort)+' shortfall</b><br>'+
      '<b>'+rarity+' Star points:</b> '+f(starNeed)+' required · '+f(starHeld)+' available · <b>'+f(starShort)+' shortfall</b>'+
      (extra.length?'<br>'+extra.join('<br>'):'')+
      '<br><small>Inventory is read for comparison only; nothing is spent.</small>';
  }
  function calculate(){
    var result=byId('v460TargetResult');
    if(!result)return;
    var tl=n(byId('v460TargetLevel')&&byId('v460TargetLevel').value,70);
    var ts=n(byId('v460TargetStars')&&byId('v460TargetStars').value,5);
    var tt=n(byId('v460TargetTraining')&&byId('v460TargetTraining').value,180);
    var cl=n(byId('currentLevel')&&byId('currentLevel').value,0);
    var cs=n(byId('currentStar')&&byId('currentStar').value,0);
    var ct=n((byId('trainingExact')&&byId('trainingExact').value)||(byId('training')&&byId('training').value),0);
    tl=Math.max(cl,Math.min(70,tl)); ts=Math.max(cs,Math.min(5,ts)); tt=Math.max(ct,Math.min(180,tt));
    var dl=Math.max(0,tl-cl), ds=Math.max(0,ts-cs), dt=Math.max(0,tt-ct);
    var rec=[];
    if(dl)rec.push(dl+' Officer level'+(dl===1?'':'s'));
    if(ds)rec.push(ds+' Star level'+(ds===1?'':'s'));
    if(dt)rec.push(dt+' Training stage'+(dt===1?'':'s'));
    result.innerHTML='<strong>'+currentOfficerName()+'</strong><br><br>'+
      '<strong>Current:</strong> Level '+cl+' · '+cs+'★ · Training '+ct+'<br>'+
      '<strong>Target:</strong> Level '+tl+' · '+ts+'★ · Training '+tt+'<br><br>'+
      '<strong>Recommendation:</strong> '+(rec.length?'Develop '+rec.join(', ')+'.':'Target already achieved.')+
      resourceBreakdown(tl,ts,tt,cl,cs,ct)+
      '<br><small>No Officer progress or Inventory has been changed.</small>';
    result.style.background='rgba(213,167,47,.12)';
    result.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function init(){
    placeUpgradeTargets();
    var mode=byId('v460TargetMode');
    var button=byId('v460CalculateTarget');
    if(mode){mode.addEventListener('change',applyMode);applyMode();}
    if(button){button.addEventListener('click',function(e){e.preventDefault();calculate();});}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
