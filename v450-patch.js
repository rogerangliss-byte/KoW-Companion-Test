/* KoW Companion v4.5.0 TEST — stability hold + backup restore reliability.
   Planning/chest runtime changes remain disabled. This file only restores the
   known-good backup import behaviour while English Test is stabilised. */
(function(){
  'use strict';
  window.KOW_V450_RUNTIME_DISABLED = true;

  const SUCCESS = 'Backup restored successfully. Officer profiles, Officer Badges Held and shared resources have been imported. The app will reload now.';

  async function restoreBackupFile(file){
    const payload = JSON.parse(await file.text());
    if(!payload || !payload.localStorage || typeof payload.localStorage !== 'object'){
      throw new Error('Invalid KoW Companion backup file.');
    }
    if(payload.app && payload.app !== 'KoW Companion'){
      throw new Error('This is not a KoW Companion backup file.');
    }

    localStorage.clear();
    Object.entries(payload.localStorage).forEach(([key,value])=>{
      if(value !== null && value !== undefined) localStorage.setItem(key, String(value));
    });

    const status=document.getElementById('backupStatus');
    if(status) status.textContent=SUCCESS;
    alert(SUCCESS);
    location.reload();
  }

  document.addEventListener('click', function(e){
    const label=e.target.closest?.('#restoreAppDataLabel');
    if(!label) return;
    const input=document.getElementById('restoreAppData');
    if(input) input.value='';
  }, true);

  document.addEventListener('change', async function(e){
    const input=e.target;
    if(!input || input.id!=='restoreAppData') return;

    e.stopImmediatePropagation();
    const file=input.files && input.files[0];
    if(!file) return;

    try{
      await restoreBackupFile(file);
    }catch(err){
      const msg='Backup restore failed: '+(err && err.message ? err.message : String(err));
      const status=document.getElementById('backupStatus');
      if(status) status.textContent=msg;
      alert(msg);
      input.value='';
    }
  }, true);
})();
