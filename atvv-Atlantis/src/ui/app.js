// Atlantis SPA prototype
// Simple hash-router and localStorage-backed CRUD for Clients, Accommodations and Bookings

const LS_KEYS = {
  clients: 'atlantis_clients_v1',
  accommodations: 'atlantis_accommodations_v1',
  bookings: 'atlantis_bookings_v1'
};

// --- Storage helpers
// DEPRECATED: Use loadAsync/saveAsync for HTTP mode. This is kept for backwards compatibility (loads from localStorage)
function load(key){
  try{
    const raw = localStorage.getItem(key); 
    return raw?JSON.parse(raw):[];
  }catch(e){console.error(e);return[]}
}

// async versions for HTTP mode (new)
async function loadAsync(key){
  try{
    if(window.apiAdapter && apiAdapter.mode === 'http'){
      return await apiAdapter.load(key);
    }
    return load(key);
  }catch(e){ console.error('loadAsync error:', e); return []; }
}

function save(key,data){
  try{
    localStorage.setItem(key, JSON.stringify(data||[]));
  }catch(e){console.error(e)}
}

async function saveAsync(key,data){
  try{
    if(window.apiAdapter && apiAdapter.mode === 'http'){
      await apiAdapter.save(key, data);
      return;
    }
    save(key, data);
  }catch(e){ console.error('saveAsync error:', e); }
}

// --- Seed sample data if empty
function seedIfEmpty(){
  if(!load(LS_KEYS.clients).length){
    save(LS_KEYS.clients, [
      {id: genId(), name:'Maria Silva', email:'maria@example.com', phone:'(11) 99999-0001'},
      {id: genId(), name:'João Souza', email:'joao@example.com', phone:'(11) 98888-0002'}
    ]);
  }
  if(!load(LS_KEYS.accommodations).length){
    save(LS_KEYS.accommodations, [
      {id: genId(), name:'Quarto Solteiro Simples', type:'SolteiroSimples', CamaSolteiro:1, CamaCasal:0, Climatizacao:false, Garagem:0, Suite:0, rate:120},
      {id: genId(), name:'Apartamento Família', type:'FamiliaMais', CamaSolteiro:2, CamaCasal:1, Climatizacao:true, Garagem:1, Suite:1, rate:320}
    ]);
  }
  if(!load(LS_KEYS.bookings).length){
    const clients = load(LS_KEYS.clients), acc = load(LS_KEYS.accommodations);
    save(LS_KEYS.bookings, [
      {id: genId(), clientId: clients[0].id, accommodationId: acc[1].id, from:'2025-11-01', to:'2025-11-05', notes:'Aniversário'}
    ]);
  }
}

function genId(){ return 'id_' + Math.random().toString(36).slice(2,9); }

// --- Router
function navigate(){
  const hash = location.hash.replace(/^#\//,'') || '';
  const main = document.getElementById('app');
  setActiveNav();
  if(hash.startsWith('clients')) renderClients(main, hash);
  else if(hash.startsWith('accommodations')) renderAccommodations(main, hash);
  else if(hash.startsWith('bookings')) renderBookings(main, hash);
  else renderHome(main);
}

function setActiveNav(){
  document.querySelectorAll('.topbar nav a').forEach(a=>a.classList.remove('active'));
  const path = location.hash || '#/';
  const el = document.querySelector(`.topbar nav a[href="${path}"]`);
  if(el) el.classList.add('active');
}

// --- Home
function renderHome(container){
  container.innerHTML = `
    <section class="card">
      <h2>Bem-vindo ao Atlantis</h2>
      <p class="small">Use a navegação acima para acessar Clientes, Acomodações e Hospedagens. Os dados são salvos no Mongo.</p>
    </section>
    <section class="card">
      <h3>Resumo</h3>
      <div id="summary" class="grid"></div>
    </section>
  `;
  renderSummary();
}

function renderSummary(){
  const clients = load(LS_KEYS.clients).length;
  const acc = load(LS_KEYS.accommodations).length;
  const bookings = load(LS_KEYS.bookings).length;
  const el = document.getElementById('summary');
  el.innerHTML = `
    <div class="card"><strong>${clients}</strong><div class="small">Clientes</div></div>
    <div class="card"><strong>${acc}</strong><div class="small">Acomodações</div></div>
    <div class="card"><strong>${bookings}</strong><div class="small">Hospedagens</div></div>
  `;
}

// --- Clients
function renderClients(container, hash){
  container.innerHTML = `
    <div class="grid">
      <div class="card list">
        <div class="toolbar"><h2>Clientes</h2><button class="btn" id="btn-new-client">Novo Cliente</button></div>
        <div id="clients-list"></div>
      </div>
      <div class="card" id="clients-form-area">
        <div class="empty">Selecione um cliente ou clique em "Novo Cliente"</div>
      </div>
    </div>
  `;
  document.getElementById('btn-new-client').addEventListener('click', ()=> showClientForm());
  renderClientsList();
  if(hash.includes('edit')){
    const id = hash.split('/')[1]; if(id) showClientForm(id);
  }
}

function renderClientsList(){
  const list = load(LS_KEYS.clients);
  const container = document.getElementById('clients-list');
  if(!list.length){ container.innerHTML = '<div class="empty">Nenhum cliente cadastrado</div>'; return; }
  container.innerHTML = list.map(c=>{
    const tipo = c.tipo || c.Tipo || 'titular';
    const titularName = (tipo === 'dependente') ? (c.titularName || (c.Titular && (c.Titular.Nome || c.Titular.name)) || c.titular || '') : '';
    // format phone
    let phoneDisplay = '';
    if(c.Telefones && c.Telefones.length){ const t = c.Telefones[0]; phoneDisplay = `(${t.Ddd||''}) ${t.Numero||''}`; }
    else if(c.phone) phoneDisplay = c.phone;
    else if(c.Telefones === undefined && c.telefones && c.telefones.length){ const t = c.telefones[0]; phoneDisplay = `(${t.Ddd||''}) ${t.Numero||''}`; }
    return `
    <div class="item">
      <div>
        <div><strong>${escapeHtml(c.name || c.nome)}</strong> ${tipo === 'dependente' ? '<span class="small">(dependente)</span>' : '<span class="small">(titular)</span>'}</div>
        <div class="small">${escapeHtml(c.email || '')} • ${escapeHtml(c.Pais || c.pais || '')} ${escapeHtml(phoneDisplay)} ${titularName? '• Titular: '+escapeHtml(titularName):''}</div>
      </div>
      <div class="actions">
        <button class="btn ghost" data-action="edit" data-id="${c.id}">Editar</button>
        <button class="btn ghost" data-action="delete" data-id="${c.id}">Excluir</button>
      </div>
    </div>
  `}).join('');
  container.querySelectorAll('button[data-action]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const id = btn.dataset.id;
      if(btn.dataset.action === 'edit') showClientForm(id);
      else if(btn.dataset.action === 'delete'){
        if(confirm('Excluir cliente?')){ removeClient(id); renderClientsList(); renderSummary(); }
      }
    })
  })
}

function showClientForm(id){
  const area = document.getElementById('clients-form-area');
  const clients = load(LS_KEYS.clients);
  const c = id ? clients.find(x=>x.id===id) : {id:'',name:'',email:'',phone:'',tipo:'titular',dependentes:[],documentos:[],nomeSocial:'',dataNascimento:''};
  // ensure arrays
  c.dependentes = c.dependentes || c.Dependentes || [];
  c.documentos = c.documentos || c.Documentos || [];

  area.innerHTML = `
    <h3>${c.id? 'Editar Cliente' : 'Novo Cliente'}</h3>
    <form id="client-form">
      <label>Nome<input type="text" name="name" value="${escapeHtml(c.name || c.nome || '')}" required></label>
      <label>Nome social<input type="text" name="nomeSocial" value="${escapeHtml(c.nomeSocial || c.nomeSocial || '')}"></label>
  <label>Data nascimento<input type="date" name="dataNascimento" value="${c.dataNascimento? c.dataNascimento.split('T')[0] : ''}"></label>
      <label>Email<input type="text" name="email" value="${escapeHtml(c.email || '')}"></label>
      <div class="row">
        <label style="width:120px">DDD<input type="text" name="phoneDdd" value="${escapeHtml((c.Telefones && c.Telefones[0] && c.Telefones[0].Ddd) || (c.telefones && c.telefones[0] && c.telefones[0].Ddd) || '')}"></label>
        <label style="flex:1">Telefone<input type="text" name="phoneNumber" value="${escapeHtml((c.Telefones && c.Telefones[0] && c.Telefones[0].Numero) || (c.telefones && c.telefones[0] && c.telefones[0].Numero) || c.phone || '')}"></label>
      </div>
      <fieldset style="margin-top:8px;padding:8px;border:1px solid #eef">
        <legend>Endereço</legend>
        <label>Rua<input type="text" name="end_rua" value="${escapeHtml((c.Endereco && c.Endereco.rua) || (c.endereco && c.endereco.rua) || '')}"></label>
        <div class="row">
          <label style="width:120px">Número<input type="text" name="end_num" value="${escapeHtml((c.Endereco && c.Endereco.numero) || (c.endereco && c.endereco.numero) || '')}"></label>
          <label style="flex:1">Cidade<input type="text" name="end_cidade" value="${escapeHtml((c.Endereco && c.Endereco.cidade) || (c.endereco && c.endereco.cidade) || '')}"></label>
        </div>
        <div class="row">
          <label style="width:120px">Estado<input type="text" name="end_estado" value="${escapeHtml((c.Endereco && c.Endereco.estado) || (c.endereco && c.endereco.estado) || '')}"></label>
          <label style="flex:1">CEP<input type="text" name="end_cep" value="${escapeHtml((c.Endereco && c.Endereco.cep) || (c.endereco && c.endereco.cep) || '')}"></label>
        </div>
        </div class="row">
            <label>País<input type="text" name="end_pais" value="${escapeHtml((c.Endereco && c.Endereco.pais) || (c.endereco && c.endereco.pais) || '')}"></label>
        </div>
      </fieldset>
      <div style="margin-top:10px;display:flex;gap:8px">
        <button class="btn" type="submit">Salvar</button>
        <button class="btn ghost" id="btn-cancel-client" type="button">Cancelar</button>
      </div>
    </form>

    ${ (c.tipo === 'dependente' || c.Tipo === 'dependente') && (c.Titular || c.titular) ? `<div style="margin-top:10px"><strong>Titular:</strong> ${escapeHtml((c.Titular && (c.Titular.Nome || c.Titular.name)) || c.titularName || c.titular || '')}</div>` : '' }

    <section style="margin-top:14px">
      <h4>Documentos</h4>
      <div id="client-docs">
        ${c.documentos.length? c.documentos.map(d=>`
          <div class="item">
            <div class="small">${escapeHtml(d.tipo||d.Tipo||d.type)}: ${escapeHtml(d.numero||d.number)}</div>
            <div class="actions">
              <button class="btn ghost" data-action="edit-doc" data-id="${d.id}">Editar</button>
              <button class="btn ghost" data-action="delete-doc" data-id="${d.id}">Excluir</button>
            </div>
          </div>
        `).join('') : '<div class="empty">Nenhum documento</div>'}
      </div>
      <form id="doc-form" style="margin-top:10px">
        <div class="row">
          <label style="flex:1">Tipo<select name="tipo"><option>CPF</option><option>RG</option><option>PASSAPORTE</option></select></label>
          <label style="flex:2">Número<input type="text" name="numero"></label>
        </div>
        <div style="margin-top:8px">
          <button class="btn" type="submit">Adicionar documento</button>
          <input type="hidden" name="docId" value="">
        </div>
      </form>
    </section>

    <section style="margin-top:14px">
      <h4>Dependentes</h4>
      <div id="client-deps">
        ${c.dependentes.length? c.dependentes.map(d=>`<div class="small">${escapeHtml(d.name||d.Nome)}</div>`).join('') : '<div class="empty">Nenhum dependente</div>'}
      </div>
      ${c.tipo === 'titular' || c.Tipo === 'titular' || !c.id ? `
      <form id="dep-form" style="margin-top:10px">
        <div class="row">
          <label style="flex:1">Nome<input type="text" name="depName"></label>
          <label style="flex:1">Nome social<input type="text" name="depNomeSocial"></label>
        </div>
        <div class="row">
          <label>Data nascimento<input type="date" name="depNascimento"></label>
        </div>
        <div class="row" style="margin-top:8px">
          <label style="width:120px">DDD<input type="text" name="depDdd"></label>
          <label style="flex:1">Telefone<input type="text" name="depPhone"></label>
        </div>
        <fieldset style="margin-top:8px;padding:8px;border:1px solid #eef">
          <legend>Endereço do dependente</legend>
          <label>Rua<input type="text" name="dep_rua"></label>
          <div class="row">
            <label style="width:120px">Número<input type="text" name="dep_numero"></label>
            <label style="flex:1">Cidade<input type="text" name="dep_cidade"></label>
          </div>
        </fieldset>
        <div style="margin-top:8px"><button class="btn" type="submit">Adicionar dependente</button></div>
      </form>
      ` : ''}
    </section>
  `;

  document.getElementById('btn-cancel-client').addEventListener('click', ()=>{
    area.innerHTML = '<div class="empty">Selecione um cliente ou clique em "Novo Cliente"</div>';
  })

  document.getElementById('client-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const form = e.target;
    const endereco = { 
      rua: form.end_rua.value.trim(), 
      numero: form.end_num.value.trim(), 
      cidade: form.end_cidade.value.trim(), 
      estado: form.end_estado.value.trim(), 
      cep: form.end_cep.value.trim(),
      pais: form.end_pais.value.trim()
    };
    const telefones = [];
    if(form.phoneDdd.value || form.phoneNumber.value) telefones.push({ Ddd: form.phoneDdd.value.trim(), Numero: form.phoneNumber.value.trim() });
    const obj = { 
      id: c.id || genId(), 
      name: form.name.value.trim(), 
      nomeSocial: form.nomeSocial.value.trim(), 
      dataNascimento: form.dataNascimento.value,
      email: form.email.value.trim(), 
      Telefones: telefones, 
      Endereco: endereco, 
      tipo: c.tipo || c.Tipo || 'titular', 
      Documentos: c.documentos 
    };
    const clients = load(LS_KEYS.clients).filter(x=>x.id!==obj.id);
    clients.push(obj); save(LS_KEYS.clients, clients);
    renderClientsList(); renderSummary();
    area.innerHTML = '<div class="small">Cliente salvo com sucesso.</div>';
  })

  // document form and actions
  const docForm = document.getElementById('doc-form');
  const docsContainer = document.getElementById('client-docs');

  // Handle document edit/delete buttons
  docsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const docId = btn.dataset.id;
    const action = btn.dataset.action;
    const clients = load(LS_KEYS.clients);
    const idx = clients.findIndex(x => x.id === c.id);
    if (idx < 0) return;

    if (action === 'edit-doc') {
      const doc = clients[idx].Documentos.find(d => d.id === docId);
      if (doc) {
        docForm.tipo.value = doc.tipo;
        docForm.numero.value = doc.numero;
        docForm.docId.value = doc.id;
        docForm.querySelector('button[type="submit"]').textContent = 'Atualizar documento';
      }
    } else if (action === 'delete-doc') {
      if (confirm('Excluir documento?')) {
        clients[idx].Documentos = clients[idx].Documentos.filter(d => d.id !== docId);
        save(LS_KEYS.clients, clients);
        showClientForm(c.id);
      }
    }
  });

  // document form submit (add/edit)
  docForm.addEventListener('submit',(e)=>{
    e.preventDefault(); 
    const f = e.target;
    const doc = { 
      id: f.docId.value || genId(), 
      tipo: f.tipo.value, 
      numero: f.numero.value 
    };

    // attach to client in memory
    const clients = load(LS_KEYS.clients);
    const idx = clients.findIndex(x=>x.id===c.id);
    if(idx<0){ alert('Salve o cliente antes de adicionar documentos'); return; }
    
    clients[idx].Documentos = clients[idx].Documentos || [];
    
    if (f.docId.value) {
      // update existing
      const docIdx = clients[idx].Documentos.findIndex(d => d.id === f.docId.value);
      if (docIdx >= 0) {
        clients[idx].Documentos[docIdx] = doc;
      }
    } else {
      // add new
      clients[idx].Documentos.push(doc);
    }
    
    save(LS_KEYS.clients, clients);
    
    // reset form
    f.docId.value = '';
    f.tipo.value = 'CPF';
    f.numero.value = '';
    f.querySelector('button[type="submit"]').textContent = 'Adicionar documento';
    
    // refresh form area
    showClientForm(c.id);
  })

  // dependent form
  const depForm = document.getElementById('dep-form');
  if(depForm){
    depForm.addEventListener('submit',(e)=>{
      e.preventDefault(); const f=e.target;
      const enderecoDep = { rua: f.dep_rua.value.trim(), numero: f.dep_numero.value.trim(), cidade: f.dep_cidade.value.trim() };
      const telefones = [];
      if(f.depDdd.value || f.depPhone.value) telefones.push({ Ddd: f.depDdd.value.trim(), Numero: f.depPhone.value.trim() });
      const dep = { id: genId(), name: f.depName.value.trim(), nomeSocial: f.depNomeSocial.value.trim(), dataNascimento: f.depNascimento.value, tipo: 'dependente', Titular: { id: c.id, name: c.name }, Dependentes: [], Documentos: [], Endereco: enderecoDep, Telefones: telefones };
      const clients = load(LS_KEYS.clients);
      // add to titular dependentes array
      const idx = clients.findIndex(x=>x.id===c.id);
      if(idx<0){ alert('Salve o cliente antes de adicionar dependentes'); return; }
      clients[idx].Dependentes = clients[idx].Dependentes || [];
      clients[idx].Dependentes.push(dep);
      // also push dependent as separate client record
      clients.push(dep);
      save(LS_KEYS.clients, clients);
      // refresh
      showClientForm(c.id);
    })
  }
}

function removeClient(id){
  const clients = load(LS_KEYS.clients);
  const target = clients.find(x=>x.id===id);
  if(!target) return;
  const tipo = target.tipo || target.Tipo || 'titular';
  if(tipo === 'dependente'){
    // remove from titular's dependentes array
    if(target.Titular || target.titular){
      const titularId = (target.Titular && (target.Titular.id || target.Titular)) || target.titular || (target.Titular && target.Titular.id);
      const tIdx = clients.findIndex(x=>x.id===titularId);
      if(tIdx>=0){ clients[tIdx].Dependentes = (clients[tIdx].Dependentes || []).filter(d=> (d.id || d) !== id); }
    }
    const remaining = clients.filter(x=>x.id!==id);
    save(LS_KEYS.clients, remaining);
    // remove bookings referencing this client
    const bookings = load(LS_KEYS.bookings).filter(b=>b.clientId!==id); save(LS_KEYS.bookings, bookings);
    return;
  }
  // titular: remove dependents and bookings
  const deps = (target.Dependentes || []).map(d=> d.id || d).filter(Boolean);
  let remaining = clients.filter(x=> !deps.includes(x.id) && x.id!==id);
  save(LS_KEYS.clients, remaining);
  const bookings = load(LS_KEYS.bookings).filter(b=> !deps.includes(b.clientId) && b.clientId!==id); save(LS_KEYS.bookings, bookings);
}

// --- Accommodations
function renderAccommodations(container, hash){
  container.innerHTML = `
    <div class="grid">
      <div class="card list">
        <div class="toolbar"><h2>Acomodações</h2><div style="display:flex;gap:8px"><button class="btn" id="btn-new-acc">Nova Acomodação</button><button class="btn ghost" id="btn-show-types">Mostrar tipos</button></div></div>
        <div id="acc-list"></div>
      </div>
      <div class="card" id="acc-form-area"><div class="empty">Selecione uma acomodação ou crie uma nova</div></div>
    </div>
  `;
  document.getElementById('btn-new-acc').addEventListener('click', ()=> showAccForm());
  document.getElementById('btn-show-types').addEventListener('click', async ()=>{
    // try fetch from server, otherwise show static key+description
    const DEFAULT_TYPES = [
      { key: 'SolteiroSimples', description: 'Acomodação simples para solteiro(a)' },
      { key: 'CasalSimples', description: 'Acomodação simples para casal' },
      { key: 'FamilaSimples', description: 'Acomodação para família com até duas crianças' },
      { key: 'FamiliaMais', description: 'Acomodação para família com até cinco crianças' },
      { key: 'SolteiroMais', description: 'Acomodação com garagem para solteiro(a)' },
      { key: 'FamiliaSuper', description: 'Acomodação para até duas familias, casal e três crianças cada' }
    ];
    let types = DEFAULT_TYPES;
    try{
      const base = window.API_BASE_URL || location.origin;
      const res = await fetch((base||'') + '/api/v1/accommodation-types');
      if(res.ok){ const j = await res.json(); if(Array.isArray(j.data) && j.data.length) types = j.data; }
    }catch(e){ /* ignore */ }
    alert('Tipos de Acomodação:\n' + types.map(t=> (t.key? t.key + ' — ' : '') + (t.description||t)).join('\n'));
  });
  renderAccList();
}

function renderAccList(){
  const list = load(LS_KEYS.accommodations);
  const container = document.getElementById('acc-list');
  if(!list.length){ container.innerHTML = '<div class="empty">Nenhuma acomodação</div>'; return; }
  container.innerHTML = list.map(a=>`
    <div class="item">
      <div>
        <div><strong>${escapeHtml(a.name)}</strong></div>
        <div class="small">${escapeHtml(a.type)} • camas solteiro ${a.CamaSolteiro || a.camaSolteiro || 0} • camas casal ${a.CamaCasal || a.camaCasal || 0} • climatização ${String((a.Climatizacao||a.climatizacao)? 'sim':'não')} • garagens ${a.Garagem || a.garagem || 0} • suítes ${a.Suite || a.suite || 0} • R$ ${a.rate}</div>
      </div>
      <div class="actions">
        <button class="btn ghost" data-action="edit" data-id="${a.id}">Editar</button>
        <button class="btn ghost" data-action="delete" data-id="${a.id}">Excluir</button>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('button[data-action]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.id;
      if(btn.dataset.action==='edit') showAccForm(id);
      else if(btn.dataset.action==='delete'){ if(confirm('Excluir acomodação?')){ removeAcc(id); renderAccList(); renderSummary(); } }
    })
  })
}

function showAccForm(id){
  const area = document.getElementById('acc-form-area');
  const list = load(LS_KEYS.accommodations);
  const a = id ? list.find(x=>x.id===id) : {id:'',name:'',type:'',CamaSolteiro:1,CamaCasal:0,Climatizacao:false,Garagem:0,Suite:0,rate:0};
  
  // helper to load types from server or fallback
  const DEFAULT_TYPES = [
    { key: 'SolteiroSimples', description: 'Acomodação simples para solteiro(a)' },
    { key: 'CasalSimples', description: 'Acomodação simples para casal' },
    { key: 'FamilaSimples', description: 'Acomodação para família com até duas crianças' },
    { key: 'FamiliaMais', description: 'Acomodação para família com até cinco crianças' },
    { key: 'SolteiroMais', description: 'Acomodação com garagem para solteiro(a)' },
    { key: 'FamiliaSuper', description: 'Acomodação para até duas familias, casal e três crianças cada' }
  ];

  async function loadTypes(){
    try{
      const base = window.API_BASE_URL || location.origin;
      // fetch types and specs
      const res = await fetch((base||'') + '/api/v1/accommodation-types-specs');
      if(res.ok){ const j = await res.json(); if(Array.isArray(j.data) && j.data.length) return j.data; }
      // fallback to simpler list
      const res2 = await fetch((base||'') + '/api/v1/accommodation-types');
      if(res2.ok){ const j2 = await res2.json(); return (j2.data || DEFAULT_TYPES).map(t=> ({ key: t.key, description: t.description })); }
    }catch(e){ }
    return DEFAULT_TYPES;
  }
  area.innerHTML = `
    <h3>${a.id?'Editar Acomodação':'Nova Acomodação'}</h3>
    <form id="acc-form">
      <label>Nome<input type="text" name="name" value="${escapeHtml(a.name)}" required></label>
      <div class="row">
        <label style="flex:1">Tipo<select name="type" id="acc-type-select">
          <option>Carregando...</option>
        </select></label>
      </div>
      <div class="row">

      </div>
      <div class="row">
      <label>Tarifa (R$)<input type="text" name="rate" value="${a.rate}"></label>
      <div style="margin-top:10px;display:flex;gap:8px">
        <button class="btn" type="submit">Salvar</button>
        <button class="btn ghost" id="btn-cancel-acc" type="button">Cancelar</button>
      </div>
    </form>
  `;
  document.getElementById('btn-cancel-acc').addEventListener('click', ()=>{ area.innerHTML = '<div class="empty">Selecione uma acomodação ou crie uma nova</div>'; });
  // populate types then wire submit
  loadTypes().then(types=>{
    const sel = document.getElementById('acc-type-select');
    sel.innerHTML = types.map(t=>`<option value="${t.key}" ${t.key===a.type? 'selected':''}>${escapeHtml(t.key)} — ${escapeHtml(t.description||t.description||'')}</option>`).join('');
    // show specs read-only area
    const specsArea = document.createElement('div'); specsArea.className = 'specs';
    sel.parentNode.appendChild(specsArea);

    function renderSpecsFor(key){
      const t = types.find(tt=>tt.key===key) || types[0] || {};
      specsArea.innerHTML = `
        <div class="spec-row"><strong>camas solteiro:</strong> ${t.CamaSolteiro || t.camaSolteiro || 0}</div>
        <div class="spec-row"><strong>camas casal:</strong> ${t.CamaCasal || t.camaCasal || 0}</div>
        <div class="spec-row"><strong>climatização:</strong> ${ (t.Climatizacao||t.climatizacao) ? 'sim' : 'não' }</div>
        <div class="spec-row"><strong>garagens:</strong> ${t.Garagem || t.garagem || 0}</div>
        <div class="spec-row"><strong>suítes:</strong> ${t.Suite || t.suite || 0}</div>
      `;
    }

    renderSpecsFor(a.type || sel.value);
    sel.addEventListener('change', ()=> renderSpecsFor(sel.value));

    document.getElementById('acc-form').addEventListener('submit',async (e)=>{
      e.preventDefault(); const f=e.target; const obj = { id: a.id || genId(), name: f.name.value.trim(), type: f.type.value || f['type'].value || sel.value, rate: parseFloat(f.rate.value)||0 };
      // POST to server to let server derive specs
      const base = window.API_BASE_URL || location.origin;
      if(a.id){
        // update
        const res = await fetch((base||'') + '/api/v1/accommodations/' + a.id, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: obj.name, type: obj.type, rate: obj.rate }) });
        if(res.ok){ 
          const data = await res.json();
          // Update in localStorage
          const list = load(LS_KEYS.accommodations);
          const index = list.findIndex(x => x.id === a.id);
          if (index !== -1) {
            list[index] = data.data;
          }
          save(LS_KEYS.accommodations, list);
          renderAccList(); 
          renderSummary(); 
          area.innerHTML = '<div class="small">Acomodação atualizada.</div>'; 
        }
        else area.innerHTML = '<div class="small">Erro ao atualizar acomodação.</div>';
      } else {
        const res = await fetch((base||'') + '/api/v1/accommodations', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: obj.name, type: obj.type, rate: obj.rate }) });
        if(res.ok){ 
          const data = await res.json();
          // Add to localStorage
          const list = load(LS_KEYS.accommodations);
          list.push(data.data);
          save(LS_KEYS.accommodations, list);
          renderAccList(); 
          renderSummary(); 
          area.innerHTML = '<div class="small">Acomodação criada.</div>'; 
        }
        else area.innerHTML = '<div class="small">Erro ao criar acomodação.</div>';
      }
    })
  });
}

function removeAcc(id){
  const list = load(LS_KEYS.accommodations).filter(x=>x.id!==id); save(LS_KEYS.accommodations, list);
  // also remove bookings using this accommodation
  const bookings = load(LS_KEYS.bookings).filter(b=>b.accommodationId!==id); save(LS_KEYS.bookings, bookings);
}

// --- Bookings (Hospedagens)
function renderBookings(container){
  container.innerHTML = `
    <div class="grid">
      <div class="card list">
        <div class="toolbar"><h2>Hospedagens</h2><button class="btn" id="btn-new-booking">Nova Hospedagem</button></div>
        <div id="bookings-list"></div>
      </div>
      <div class="card" id="booking-form-area"><div class="empty">Selecione hospedagem ou crie nova</div></div>
    </div>
  `;
  document.getElementById('btn-new-booking').addEventListener('click', ()=> showBookingForm());
  renderBookingsList();
}

function renderBookingsList(){
  const bookings = load(LS_KEYS.bookings);
  const clients = load(LS_KEYS.clients);
  const acc = load(LS_KEYS.accommodations);
  const container = document.getElementById('bookings-list');
  if(!bookings.length){ container.innerHTML = '<div class="empty">Nenhuma hospedagem registrada</div>'; return; }
  container.innerHTML = bookings.map(b=>{
    const client = clients.find(c=>c.id===b.clientId) || {name:'(cliente removido)'};
    const a = acc.find(x=>x.id===b.accommodationId) || {name:'(acomodação removida)'};
    return `
      <div class="item">
        <div>
          <div><strong>${escapeHtml(client.name)}</strong> — ${escapeHtml(a.name)}</div>
          <div class="small">${b.from} → ${b.to} • ${escapeHtml(b.notes||'')}</div>
        </div>
        <div class="actions">
          <button class="btn ghost" data-action="edit" data-id="${b.id}">Editar</button>
          <button class="btn ghost" data-action="delete" data-id="${b.id}">Cancelar</button>
        </div>
      </div>
    `
  }).join('');
  container.querySelectorAll('button[data-action]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.id;
      if(btn.dataset.action==='edit') showBookingForm(id);
      else if(btn.dataset.action==='delete'){ if(confirm('Cancelar hospedagem?')){ removeBooking(id); renderBookingsList(); renderSummary(); } }
    })
  })
}

function showBookingForm(id){
  const area = document.getElementById('booking-form-area');
  const bookings = load(LS_KEYS.bookings);
  // only allow titulars to create bookings
  const clients = load(LS_KEYS.clients).filter(c=> (c.tipo || c.Tipo || 'titular') === 'titular');
  const acc = load(LS_KEYS.accommodations);
  const b = id ? bookings.find(x=>x.id===id) : {id:'',clientId:'',accommodationId:'',from:'',to:'',notes:''};
  area.innerHTML = `
    <h3>${b.id? 'Editar Hospedagem' : 'Nova Hospedagem'}</h3>
    <form id="booking-form">
      <label>Cliente<select name="clientId">${clients.map(c=>`<option value="${c.id}" ${c.id===b.clientId? 'selected':''}>${escapeHtml(c.name)}</option>`).join('')}</select></label>
      <label>Acomodação<select name="accommodationId">${acc.map(a=>`<option value="${a.id}" ${a.id===b.accommodationId? 'selected':''}>${escapeHtml(a.name)} — ${escapeHtml(a.type)}</option>`).join('')}</select></label>
      <div class="row">
        <label>Entrada<input type="date" name="from" value="${b.from}"></label>
        <label>Saída<input type="date" name="to" value="${b.to}"></label>
      </div>
      <label>Observações<textarea name="notes">${escapeHtml(b.notes|| '')}</textarea></label>
      <div style="margin-top:10px;display:flex;gap:8px">
        <button class="btn" type="submit">Salvar</button>
        <button class="btn ghost" id="btn-cancel-booking" type="button">Cancelar</button>
      </div>
    </form>
  `;
  document.getElementById('btn-cancel-booking').addEventListener('click', ()=>{ area.innerHTML='<div class="empty">Selecione hospedagem ou crie nova</div>' });
  document.getElementById('booking-form').addEventListener('submit', (e)=>{
    e.preventDefault(); const f=e.target; const obj = { id: b.id || genId(), clientId: f.clientId.value, accommodationId: f.accommodationId.value, from: f.from.value, to: f.to.value, notes: f.notes.value };
    const list = load(LS_KEYS.bookings).filter(x=>x.id!==obj.id); list.push(obj); save(LS_KEYS.bookings, list);
    renderBookingsList(); renderSummary(); area.innerHTML = '<div class="small">Hospedagem salva.</div>';
  })
}

function removeBooking(id){ const list = load(LS_KEYS.bookings).filter(x=>x.id!==id); save(LS_KEYS.bookings, list); }

// --- Utilities
function escapeHtml(s){ if(!s && s!==0) return ''; return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }

// --- Init
seedIfEmpty();

// Load data from server on startup if in HTTP mode
async function initApp(){
  try{
    if(window.API_MODE === 'http' && window.apiAdapter){
      console.log('[Atlantis] Loading data from server...');
      // Load all data from server and sync to localStorage
      const clients = await apiAdapter.load(LS_KEYS.clients);
      const accommodations = await apiAdapter.load(LS_KEYS.accommodations);
      const bookings = await apiAdapter.load(LS_KEYS.bookings);
      
      save(LS_KEYS.clients, clients);
      save(LS_KEYS.accommodations, accommodations);
      save(LS_KEYS.bookings, bookings);
      
      console.log(`[Atlantis] Loaded ${clients.length} clients, ${accommodations.length} accommodations, ${bookings.length} bookings`);
    }
  }catch(e){
    console.warn('[Atlantis] Failed to load from server, using localStorage:', e);
  }
  // Navigate to current page
  navigate();
}

window.addEventListener('hashchange', navigate);
window.addEventListener('load', initApp);
