// Simple API adapter for the SPA
// Toggle API_MODE to 'local' or 'http' to switch behavior.
(function(global){
  const LS_KEYS = {
    clients: 'atlantis_clients_v1',
    accommodations: 'atlantis_accommodations_v1',
    bookings: 'atlantis_bookings_v1'
  };

  const API_MODE = window.API_MODE || 'http';
  const BASE = location.origin + '/api/v1';

  async function httpGet(path){
    const res = await fetch(BASE + path, { headers: { 'Accept': 'application/json' } });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  async function httpPost(path, body){
    const res = await fetch(BASE + path, { 
      method: 'POST', 
      headers: {'Content-Type':'application/json'}, 
      body: JSON.stringify(body) 
    });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  async function httpPut(path, body){
    const res = await fetch(BASE + path, { 
      method:'PUT', 
      headers:{'Content-Type':'application/json'}, 
      body: JSON.stringify(body) 
    });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  async function httpDelete(path){
    const res = await fetch(BASE + path, { method: 'DELETE' });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  function localLoad(key){ try{ const raw = localStorage.getItem(key); return raw? JSON.parse(raw): []; }catch(e){return []} }
  function localSave(key,data){ try{ localStorage.setItem(key, JSON.stringify(data||[])); return true }catch(e){return false} }

  const adapter = {
    mode: API_MODE,
    LS_KEYS,
    
    // Accommodation Type Methods
    async getAccommodationTypes(){
      if(API_MODE === 'http'){
        try {
          const res = await httpGet('/accommodation-types');
          if (!res.data || !Array.isArray(res.data)) {
            throw new Error('Invalid response format');
          }
          return res.data;
        } catch (err) {
          console.error('Failed to load accommodation types:', err);
          throw new Error('Não foi possível carregar os tipos de acomodação. Por favor, tente novamente.');
        }
      }
      return [];
    },

    async getAccommodationSpecs(){
      if(API_MODE === 'http'){
        const res = await httpGet('/accommodation-types-specs');
        return res.data || [];
      }
      return [];
    },
    
    // CRUD operations for all entity types
    async load(key) {
      if(this.mode === 'local') return localLoad(key);
      try {
        let endpoint = '';
        if(key === LS_KEYS.clients) endpoint = '/clients';
        if(key === LS_KEYS.accommodations) endpoint = '/accommodations';
        if(key === LS_KEYS.bookings) endpoint = '/bookings';
        
        const json = await httpGet(endpoint);
        if (json.error) throw new Error(json.message || 'API Error');
        return json.data || [];
      } catch(err) {
        console.error('API load failed:', err);
        return []; // Don't fall back to localStorage in HTTP mode
      }
    },

    async save(key, data) {
      if(this.mode === 'local') return localSave(key, data);
      
      let endpoint = '';
      if(key === LS_KEYS.clients) endpoint = '/clients';
      if(key === LS_KEYS.accommodations) endpoint = '/accommodations';
      if(key === LS_KEYS.bookings) endpoint = '/bookings';
      
      try {
        // If saving a single item
        if (!Array.isArray(data)) {
          if (!data._id) {
            // Create new item
            const response = await httpPost(endpoint, data);
            if (response.error) throw new Error(response.message || 'Failed to create item');
            return response.data;
          } else {
            // Update existing item
            const response = await httpPut(`${endpoint}/${data._id}`, data);
            if (response.error) throw new Error(response.message || 'Failed to update item');
            return response.data;
          }
        }
        
        // If saving multiple items, process them one by one
        const promises = data.map(async (item) => {
          if (!item._id) {
            const response = await httpPost(endpoint, item);
            return response.data;
          } else {
            const response = await httpPut(`${endpoint}/${item._id}`, item);
            return response.data;
          }
        });
        
        const results = await Promise.all(promises);
        return results;
      } catch(err) {
        console.error('API save failed:', err);
        throw err; // Don't fall back to localStorage in HTTP mode
      }
    },

    // New methods for individual operations
    async getById(key, id) {
      if(this.mode === 'local') {
        const items = localLoad(key);
        return items.find(i => i._id === id);
      }
      try {
        if(key === LS_KEYS.clients) {
          const json = await httpGet(`/clients/${id}`);
          return json.data;
        }
        if(key === LS_KEYS.accommodations) {
          const json = await httpGet(`/accommodations/${id}`);
          return json.data;
        }
        if(key === LS_KEYS.bookings) {
          const json = await httpGet(`/bookings/${id}`);
          return json.data;
        }
      } catch(err) {
        console.warn('API getById failed, falling back to localStorage');
        return null;
      }
    },

    async create(key, item) {
      if(this.mode === 'local') {
        const items = localLoad(key);
        items.push(item);
        localSave(key, items);
        return item;
      }
      try {
        let response;
        if(key === LS_KEYS.clients) {
          response = await httpPost('/clients', item);
        } else if(key === LS_KEYS.accommodations) {
          response = await httpPost('/accommodations', item);
        } else if(key === LS_KEYS.bookings) {
          response = await httpPost('/bookings', item);
        }
        return response.data;
      } catch(err) {
        console.warn('API create failed, falling back to localStorage');
        return this.create(key, item);
      }
    },

    async update(key, id, item) {
      if(this.mode === 'local') {
        const items = localLoad(key);
        const index = items.findIndex(i => i._id === id);
        if(index >= 0) {
          items[index] = {...items[index], ...item};
          localSave(key, items);
          return items[index];
        }
        return null;
      }
      try {
        let response;
        if(key === LS_KEYS.clients) {
          response = await httpPut(`/clients/${id}`, item);
        } else if(key === LS_KEYS.accommodations) {
          response = await httpPut(`/accommodations/${id}`, item);
        } else if(key === LS_KEYS.bookings) {
          response = await httpPut(`/bookings/${id}`, item);
        }
        return response.data;
      } catch(err) {
        console.warn('API update failed, falling back to localStorage');
        return this.update(key, id, item);
      }
    },

    async delete(key, id) {
      if(this.mode === 'local') {
        const items = localLoad(key);
        const filtered = items.filter(i => i._id !== id);
        localSave(key, filtered);
        return true;
      }

      let endpoint = '';
      if(key === LS_KEYS.clients) endpoint = '/clients';
      if(key === LS_KEYS.accommodations) endpoint = '/accommodations';
      if(key === LS_KEYS.bookings) endpoint = '/bookings';

      try {
        const response = await httpDelete(`${endpoint}/${id}`);
        if (response.error) throw new Error(response.message || 'Failed to delete item');
        return true;
      } catch(err) {
        console.error('API delete failed:', err);
        throw err; // Don't fall back to localStorage in HTTP mode
      }
    }
  };

  // Add accommodation helper
  adapter.createAccommodation = async function(data) {
    if (this.mode === 'local') {
      const items = localLoad(LS_KEYS.accommodations);
      items.push({...data, _id: Math.random().toString(36).substr(2,9)});
      localSave(LS_KEYS.accommodations, items);
      return data;
    }

    try {
      const specs = await this.getTypeSpecs(data.type);
      const payload = {
        ...specs,
        ...data,
        Nome: data.name,
        Tipo: data.type
      };
      
      const response = await httpPost('/accommodations', payload);
      return response.data;
    } catch (err) {
      console.error('Failed to create accommodation:', err);
      throw err;
    }
  };

  adapter.getTypeSpecs = async function(type) {
    const response = await httpGet('/api/v1/accommodation-types-specs');
    if (!response.data || !response.data[type]) {
      throw new Error(`Invalid accommodation type: ${type}`);
    }
    return response.data[type];
  };

  // expose globally
  global.apiAdapter = adapter;
})(window);
