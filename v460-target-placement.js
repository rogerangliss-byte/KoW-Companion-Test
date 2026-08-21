(function(){
  function placeUpgradeTargets(){
    var card=document.getElementById('v460UpgradeTargetsCard');
    var officer=document.getElementById('officer');
    if(card&&officer&&card.parentElement!==officer){
      officer.appendChild(card);
      card.style.marginTop='14px';
    }
    var result=document.getElementById('v460TargetResult');
    if(result){
      result.style.fontSize='1rem';
      result.style.lineHeight='1.55';
      result.style.borderWidth='2px';
    }
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',placeUpgradeTargets);
  }else{
    placeUpgradeTargets();
  }
})();
