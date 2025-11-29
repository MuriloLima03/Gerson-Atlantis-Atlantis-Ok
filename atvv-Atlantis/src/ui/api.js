// Simple API adapter for the SPA
// Toggle API_MODE to 'local' or 'http' to switch behavior.
(function(global){
  const LS_KEYS = {
    clients: 'atlantis_clients_v1',
    accommodations: 'atlantis_accommodations_v1',
    bookings: 'atlantis_bookings_v1'
  };

  // evaluate mode/base at call time so index.html can set window.API_MODE before app.js runs
  function getMode(){ return (window.API_MODE || 'local'); }
  function getBase(){ return (window.API_BASE_URL && window.API_BASE_URL.length) ? window.API_BASE_URL : location.origin; }

  async function httpGet(path){
    const BASE = getBase();
    const res = await fetch(BASE + path, { headers: { 'Accept': 'application/json' } });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  async function httpPut(path, body){
    const BASE = getBase();
    const res = await fetch(BASE + path, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  function localLoad(key){ try{ const raw = localStorage.getItem(key); return raw? JSON.parse(raw): []; }catch(e){return []} }
  function localSave(key,data){ try{ localStorage.setItem(key, JSON.stringify(data||[])); return true }catch(e){return false} }

  const adapter = {
    // mode is resolved dynamically (getMode) in methods to respect runtime overrides from index.html
    get mode(){ return getMode(); },
    LS_KEYS,
    // load and save mimic old functions in app.js so minimal changes needed
    async load(key){
      if(this.mode === 'local') return localLoad(key);
      // map keys to endpoints
      if(key === LS_KEYS.clients){ const json = await httpGet('/api/v1/clients'); return Array.isArray(json) ? json : json.data || []; }
      if(key === LS_KEYS.accommodations){ const json = await httpGet('/api/v1/accommodations'); return Array.isArray(json) ? json : json.data || []; }
      if(key === LS_KEYS.bookings){ const json = await httpGet('/api/v1/bookings'); return Array.isArray(json) ? json : json.data || []; }
      return [];
    },
    async save(key, data){
      if(this.mode === 'local') return localSave(key, data);
      // use bulk replace endpoints for convenience
      if(key === LS_KEYS.clients) { const json = await httpPut('/api/v1/_bulk/clients', data || []); return Array.isArray(json) ? json : json.data || []; }
      if(key === LS_KEYS.accommodations) { const json = await httpPut('/api/v1/_bulk/accommodations', data || []); return Array.isArray(json) ? json : json.data || []; }
      if(key === LS_KEYS.bookings) { const json = await httpPut('/api/v1/_bulk/bookings', data || []); return Array.isArray(json) ? json : json.data || []; }
      return null;
    }
  };

  // expose globally
  global.apiAdapter = adapter;
})(window);
