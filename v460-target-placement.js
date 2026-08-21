(function(){
  function n(v,d){v=Number(v);return Number.isFinite(v)?v:d;}
  function byId(id){return document.getElementById(id);}
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
  function calculate(){
    var result=byId('v460TargetResult');
    if(!result)return;
    var tl=n(byId('v460TargetLevel')&&byId('v460TargetLevel').value,70);
    var ts=n(byId('v460TargetStars')&&byId('v460TargetStars').value,5);
    var tt=n(byId('v460TargetTraining')&&byId('v460TargetTraining').value,180);
    var cl=n(byId('currentLevel')&&byId('currentLevel').value,0);
    var cs=n(byId('currentStar')&&byId('currentStar').value,0);
    var ct=n((byId('trainingExact')&&byId('trainingExact').value)||(byId('training')&&byId('training').value),0);
    var dl=Math.max(0,tl-cl), ds=Math.max(0,ts-cs), dt=Math.max(0,tt-ct);
    var rec=[];
    if(dl)rec.push(dl+' Officer level'+(dl===1?'':'s'));
    if(ds)rec.push(ds+' Star level'+(ds===1?'':'s'));
    if(dt)rec.push(dt+' Training stage'+(dt===1?'':'s'));
    result.innerHTML='<strong>'+currentOfficerName()+'</strong><br><br>'+
      '<strong>Current:</strong> Level '+cl+' · '+cs+'★ · Training '+ct+'<br>'+
      '<strong>Target:</strong> Level '+tl+' · '+ts+'★ · Training '+tt+'<br><br>'+
      '<strong>Recommendation:</strong> '+(rec.length?'Develop '+rec.join(', ')+'.':'Target already achieved.')+
      '<br><small>No Officer progress or Inventory has been changed.</small>';
    result.style.background='rgba(213,167,47,.12)';
    result.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function init(){
    placeUpgradeTargets();
    var mode=byId('v460TargetMode');
    var button=byId('v460CalculateTarget');
    if(mode){
      mode.addEventListener('change',applyMode);
      applyMode();
    }
    if(button){
      button.addEventListener('click',function(e){e.preventDefault();calculate();});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
