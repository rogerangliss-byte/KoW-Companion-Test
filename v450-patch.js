/* KoW Companion English Test — runtime patch disabled.
   The previous session-state module could re-enter the native Multi-Officer Planner
   while restoring rows and freeze the page. Keep this file as a harmless no-op only
   until the clean English Live based rebuild replaces the Test application natively. */
(function(){
  'use strict';
  window.KOW_SESSION_STATE_BUILD='disabled-clean-rebuild';
  window.KOW_V450_RUNTIME_DISABLED=true;
})();
