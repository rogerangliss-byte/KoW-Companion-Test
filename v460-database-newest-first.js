(()=>{
  function install(){
    const b=document.getElementById('dbAdd');
    if(!b||b.dataset.v460NewestFirst==='1')return;
    b.dataset.v460NewestFirst='1';
    b.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      if(!Array.isArray(window.officers)&&typeof officers==='undefined')return false;
      const list=(typeof officers!=='undefined')?officers:window.officers;
      list.unshift({name:'New Officer',season:'S8',orv:1,srv:1,notes:''});
      if(typeof renderDb==='function')renderDb();
      if(typeof renderOfficerFilters==='function')renderOfficerFilters();
      if(typeof renderOfficerOptions==='function')renderOfficerOptions('New Officer');
      if(typeof calculate==='function')calculate();
      const db=document.getElementById('database');
      if(db)db.scrollIntoView({block:'start'});
      return false;
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);
  else install();
  window.addEventListener('load',install);
})();
