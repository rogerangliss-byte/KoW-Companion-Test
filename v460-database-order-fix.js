(()=>{
  function install(){
    const add=document.getElementById('dbAdd');
    if(!add || typeof officers==='undefined') return;
    add.onclick=()=>{
      officers.unshift({name:'New Officer',season:'S8',orv:1,srv:1,notes:''});
      if(typeof renderDb==='function') renderDb();
      if(typeof renderOfficerOptions==='function') renderOfficerOptions('New Officer');
      if(typeof calculate==='function') calculate();
    };
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0));
  else setTimeout(install,0);
  window.addEventListener('load',()=>setTimeout(install,0));
})();
