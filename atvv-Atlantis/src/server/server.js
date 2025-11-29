const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Reuse the in-repo JS domain where possible
const Armazem = require(path.join(__dirname, '..', 'js', 'dominio', 'armazem.js')).default;
const ClienteClass = require(path.join(__dirname, '..', 'js', 'modelos', 'cliente.js')).default;
// DB (MongoDB via mongoose)
const db = require(path.join(__dirname, 'db.js'));
let useDb = true;
db.connect().then(()=> console.log('Connected to MongoDB')).catch(err=>{ console.warn('MongoDB connect failed, falling back to in-memory store', err); useDb = false; });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Middleware de erro global
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err.message, err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION:', reason);
});

const store = Armazem.InstanciaUnica;

// Simple in-memory IDs
function genId(){ return 'id_' + Math.random().toString(36).slice(2,9); }

// --- Health
app.get('/api/health', (req,res)=> res.json({status:'ok', time: new Date()}));

// --- Accommodation Types and Specs
app.get('/api/v1/accommodation-types', (req, res) => {
  const types = [
    { key: 'SolteiroSimples', description: 'Acomodação simples para solteiro(a)' },
    { key: 'CasalSimples', description: 'Acomodação simples para casal' },
    { key: 'FamiliaSimples', description: 'Acomodação para família com até duas crianças' },
    { key: 'FamiliaMais', description: 'Acomodação para família com até cinco crianças' },
    { key: 'SolteiroMais', description: 'Acomodação com garagem para solteiro(a)' },
    { key: 'FamiliaSuper', description: 'Acomodação para até duas familias, casal e três crianças cada' }
  ];
  res.json({ data: types });
});

app.get('/api/v1/accommodation-types-specs', (req, res) => {
  const specs = [
    { key: 'SolteiroSimples', CamaSolteiro: 1, CamaCasal: 0, Climatizacao: false, Garagem: 0, Suite: 0 },
    { key: 'CasalSimples', CamaSolteiro: 0, CamaCasal: 1, Climatizacao: false, Garagem: 0, Suite: 0 },
    { key: 'FamiliaSimples', CamaSolteiro: 2, CamaCasal: 1, Climatizacao: true, Garagem: 1, Suite: 0 },
    { key: 'FamiliaMais', CamaSolteiro: 4, CamaCasal: 1, Climatizacao: true, Garagem: 1, Suite: 1 },
    { key: 'SolteiroMais', CamaSolteiro: 1, CamaCasal: 0, Climatizacao: true, Garagem: 1, Suite: 0 },
    { key: 'FamiliaSuper', CamaSolteiro: 6, CamaCasal: 2, Climatizacao: true, Garagem: 2, Suite: 2 }
  ];
  res.json({ data: specs });
});

// --- Accommodations
app.get('/api/v1/accommodations', async (req, res) => {
  try{
    if(useDb){
      const acc = await db.Accommodation.find().lean();
      return res.json(acc.map(a=> ({ id: a._id, ...a })));
    }
    const accommodations = (store.Acomodacoes || []).map(a => ({
      id: a.id || genId(),
      name: a.name || a.Nome,
      type: a.type || a.Tipo,
      CamaSolteiro: a.CamaSolteiro,
      CamaCasal: a.CamaCasal,
      Climatizacao: a.Climatizacao,
      Garagem: a.Garagem,
      Suite: a.Suite,
      rate: a.rate || a.Valor || 0
    }));
    res.json(accommodations);
  }catch(e){ res.status(500).json({ error: String(e) }); }
});

app.post('/api/v1/accommodations', async (req, res) => {
  try{
    const { name, type, rate } = req.body;
    const specs = [
      { key: 'SolteiroSimples', CamaSolteiro: 1, CamaCasal: 0, Climatizacao: false, Garagem: 0, Suite: 0 },
      { key: 'CasalSimples', CamaSolteiro: 0, CamaCasal: 1, Climatizacao: false, Garagem: 0, Suite: 0 },
      { key: 'FamiliaSimples', CamaSolteiro: 2, CamaCasal: 1, Climatizacao: true, Garagem: 1, Suite: 0 },
      { key: 'FamiliaMais', CamaSolteiro: 4, CamaCasal: 1, Climatizacao: true, Garagem: 1, Suite: 1 },
      { key: 'SolteiroMais', CamaSolteiro: 1, CamaCasal: 0, Climatizacao: true, Garagem: 1, Suite: 0 },
      { key: 'FamiliaSuper', CamaSolteiro: 6, CamaCasal: 2, Climatizacao: true, Garagem: 2, Suite: 2 }
    ];
    const typeSpecs = specs.find(s => s.key === type);
    if (!typeSpecs) return res.status(400).json({ error: 'Invalid accommodation type' });
    if(useDb){
      const a = await db.Accommodation.create({ name, type, ...typeSpecs, rate });
      return res.status(201).json({ data: { id: a._id, ...a.toObject() } });
    }
    const accommodation = { id: genId(), name: name, type: type, ...typeSpecs, rate: rate };
    store.Acomodacoes = store.Acomodacoes || [];
    store.Acomodacoes.push(accommodation);
    res.status(201).json({ data: accommodation });
  }catch(e){ res.status(500).json({ error: String(e) }); }
});

app.put('/api/v1/accommodations/:id', async (req, res) => {
  try{
    const { name, type, rate } = req.body;
    const id = req.params.id;
    if(useDb){
      const updated = await db.Accommodation.findByIdAndUpdate(id, { name, type, rate }, { new: true });
      if(!updated) return res.status(404).json({ error: 'Accommodation not found' });
      return res.json({ data: { id: updated._id, ...updated.toObject() } });
    }
    store.Acomodacoes = store.Acomodacoes || [];
    const index = store.Acomodacoes.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).json({ error: 'Accommodation not found' });
    store.Acomodacoes[index] = { ...store.Acomodacoes[index], name: name || store.Acomodacoes[index].name, type: type || store.Acomodacoes[index].type, rate: typeof rate !== 'undefined' ? rate : store.Acomodacoes[index].rate };
    res.json({ data: store.Acomodacoes[index] });
  }catch(e){ res.status(500).json({ error: String(e) }); }
});

app.delete('/api/v1/accommodations/:id', async (req, res) => {
  try{
    const id = req.params.id;
    if(useDb){
      const deleted = await db.Accommodation.findByIdAndDelete(id);
      if(!deleted) return res.status(404).json({ error: 'Accommodation not found' });
      // also delete bookings referencing this accommodation
      await db.Booking.deleteMany({ accommodation: id });
      return res.status(204).end();
    }
    // fallback in-memory
    store.Acomodacoes = (store.Acomodacoes || []).filter(x=> x.id !== id);
    store.Hospedagens = (store.Hospedagens || []).filter(b=> b.accommodationId !== id && b.Acomodacao?.id !== id);
    res.status(204).end();
  }catch(e){ res.status(500).json({ error: String(e) }); }
});

// --- Clients
app.get('/api/v1/clients', async (req,res)=>{
  try{
    console.log('[GET /api/v1/clients] Buscando clientes...');
    if(useDb){
      const clients = await db.Client.find().lean();
      console.log(`[GET /api/v1/clients] Encontrados ${clients.length} clientes no MongoDB`);
      
      const mapped = clients.map(c => ({ 
          id: c._id,
          nome: c.Nome,
          nomeSocial: c.NomeSocial,
          dataNascimento: c.DataNascimento,
          dataCadastro: c.DataCadastro,
          email: c.email,
          pais: c.Pais,
          tipo: c.Tipo,
          telefones: c.Telefones,
          endereco: c.Endereco,
          documentos: c.Documentos,
          titularId: c.Titular,
          dependentes: c.Dependentes
      }));
      return res.json(mapped);
    }
    
    // Fallback in-memory
    console.log('[GET /api/v1/clients] Usando armazenamento em memória');
    const clients = (store.Clientes || []).map(c => ({
      id: c.id,
      nome: c.nome || c.Nome || 'Sem nome',
      nomeSocial: c.nomeSocial || c.NomeSocial || '',
      dataNascimento: c.dataNascimento || c.DataNascimento,
      dataCadastro: c.dataCadastro || c.DataCadastro,
      email: c.email || '',
      pais: c.pais || c.Pais || '',
      tipo: c.tipo || c.Tipo || 'titular',
      Telefones: c.Telefones || c.telefones || [],
      Endereco: c.Endereco || c.endereco || null,
      Documentos: c.Documentos || c.documentos || []
    }));
    res.json(clients);
  }catch(e){ 
    console.error('[GET /api/v1/clients] ERRO:', e.message);
    res.status(500).json({ error: e.message }); 
  }
});

app.get('/api/v1/clients/:id', async (req,res)=>{
  try{
    const id = req.params.id;
    if(useDb){
      const c = await db.Client.findById(id).populate('Titular').populate('Dependentes').lean();
      if(!c) return res.status(404).json({ error: 'Cliente não encontrado' });
      return res.json({ data: { id: c._id, nome: c.Nome, pais: c.Pais || (c.Endereco && c.Endereco.Pais) || undefined, nomeSocial: c.NomeSocial, dataNascimento: c.DataNascimento, dataCadastro: c.DataCadastro, telefones: c.Telefones || [], endereco: c.Endereco || null, documentos: c.Documentos || [], dependentes: (c.Dependentes||[]).map(d=> ({ id: d._id, Nome: d.Nome })), tipo: c.Tipo || 'titular', titularId: c.Titular ? c.Titular._id : undefined, titular: c.Titular ? { id: c.Titular._id, nome: c.Titular.Nome } : undefined } });
    }
    const c = (store.Clientes || []).find(x => x.id === id);
    if(!c) return res.status(404).json({ error: 'Cliente não encontrado' });
    c.id = c.id || genId();
    res.json({ data: { id: c.id, nome: c.Nome || c.nome, pais: c.Pais || (c.Endereco && c.Endereco.pais) || c.pais || undefined, nomeSocial: c.NomeSocial || c.nomeSocial, dataNascimento: c.DataNascimento || c.dataNascimento, dataCadastro: c.DataCadastro || c.dataCadastro, telefones: c.Telefones || c.telefones || [], endereco: c.Endereco || c.endereco || null, documentos: c.Documentos || c.documentos || [], dependentes: c.Dependentes || c.dependentes || [], tipo: c.Tipo || c.tipo || 'titular', titularId: c.Titular ? (c.Titular.id || c.Titular) : undefined, titular: (c.Tipo === 'dependente' || c.tipo === 'dependente') ? (c.Titular ? { id: c.Titular.id || c.Titular, nome: c.Titular.Nome || c.Titular.name || c.Titular.nome } : undefined) : undefined } });
  }catch(e){ res.status(500).json({ error: String(e) }); }
});

app.post('/api/v1/clients', async (req,res)=>{
  try{
    console.log('[POST /api/v1/clients] ▶️ Início da rota');
    const body = req.body || {};
    console.log('[POST /api/v1/clients] Body:', JSON.stringify(body));
    
    const nome =  body.nome || body.Nome || 'Sem nome';
    const email = body.email || body.Email || '';
    
    console.log('[POST /api/v1/clients] Testando in-memory...');
    
    // TEMPORARIAMENTE DESABILITAR DB PARA TESTAR
    const cliente = { 
      id: genId(), 
      nome: nome, 
      email: email
    };
    store.Clientes = store.Clientes || [];
    store.Clientes.push(cliente);
    
    console.log('[POST /api/v1/clients] ✅ Salvo em memória:', cliente.id);
    res.status(201).json({ id: cliente.id, nome: cliente.nome, email: cliente.email });
  }catch(e){ 
    console.error('[POST /api/v1/clients] ❌ ERRO:', e.message);
    res.status(500).json({ error: e.message }); 
  }
});

app.put('/api/v1/clients/:id', async (req,res)=>{
  try{
    const id = req.params.id;
    const body = req.body;
    
    if(useDb){
      const update = {};
      if (body.nome || body.Nome || body.name) update.Nome = body.nome || body.Nome || body.name;
      if (body.nomeSocial || body.NomeSocial) update.NomeSocial = body.nomeSocial || body.NomeSocial;
      if (body.email) update.email = body.email;
      if (body.dataNascimento || body.DataNascimento) {
        const dne = body.dataNascimento || body.DataNascimento;
        update.DataNascimento = dne instanceof Date ? dne : new Date(dne);
      }
      if (body.pais || body.Pais || body.country) update.Pais = body.pais || body.Pais || body.country;
      if (body.tipo || body.Tipo) update.Tipo = body.tipo || body.Tipo;
      
      if (body.Telefones && Array.isArray(body.Telefones)) {
        update.Telefones = body.Telefones.map(t => ({
          Ddd: t.Ddd || t.ddd || '',
          Numero: t.Numero || t.numero || ''
        }));
      }
      
      if (body.Endereco && typeof body.Endereco === 'object') {
        update.Endereco = {
          Rua: body.Endereco.Rua || body.Endereco.rua || '',
          Numero: body.Endereco.Numero || body.Endereco.numero || '',
          Bairro: body.Endereco.Bairro || body.Endereco.bairro || '',
          Cidade: body.Endereco.Cidade || body.Endereco.cidade || '',
          Estado: body.Endereco.Estado || body.Endereco.estado || '',
          Pais: body.Endereco.Pais || body.Endereco.pais || ''
        };
      }
      
      if (body.Documentos && Array.isArray(body.Documentos)) {
        update.Documentos = body.Documentos;
      }
      
      const updated = await db.Client.findByIdAndUpdate(id, update, { new: true });
      if(!updated) return res.status(404).json({ error: 'Cliente não encontrado' });
      
      return res.json({ id: updated._id, nome: updated.Nome, email: updated.email, tipo: updated.Tipo });
    }
    
    const list = store.Clientes;
    const idx = list.findIndex(x=>x.id===id);
    if(idx<0) return res.status(404).json({ error: 'Cliente não encontrado' });
    
    const c = list[idx];
    if(body.nome || body.Nome || body.name) c.nome = body.nome || body.Nome || body.name;
    if(body.nomeSocial || body.NomeSocial) c.nomeSocial = body.nomeSocial || body.NomeSocial;
    if(body.email) c.email = body.email;
    if(body.dataNascimento || body.DataNascimento) c.dataNascimento = new Date(body.dataNascimento || body.DataNascimento);
    if(body.pais || body.Pais || body.country) c.Pais = body.pais || body.Pais || body.country;
    if(body.tipo || body.Tipo) c.Tipo = body.tipo || body.Tipo;
    if(body.Telefones && Array.isArray(body.Telefones)) c.Telefones = body.Telefones;
    if(body.Endereco) c.Endereco = body.Endereco;
    if(body.Documentos && Array.isArray(body.Documentos)) c.Documentos = body.Documentos;
    
    res.json({ id: c.id, nome: c.nome, email: c.email, tipo: c.Tipo });
  }catch(e){ 
    console.error('[PUT /api/v1/clients/:id] ERRO:', e.message);
    res.status(500).json({ error: e.message }); 
  }
});

app.delete('/api/v1/clients/:id', async (req,res)=>{
  try{
    const id = req.params.id;
    
    if(useDb){
      const client = await db.Client.findById(id);
      if(!client) return res.status(404).json({ error: 'Cliente não encontrado' });
      
      if(client.Tipo === 'dependente'){
        // Se dependente, remover do titular e deletar bookings
        if(client.Titular) {
          await db.Client.findByIdAndUpdate(client.Titular, { $pull: { Dependentes: client._id } });
        }
        await db.Booking.deleteMany({ client: client._id });
        await db.Client.findByIdAndDelete(client._id);
        console.log('[DELETE /api/v1/clients] ✅ Dependente deletado:', id);
        return res.status(204).end();
      }
      
      // Se titular, deletar dependentes e seus bookings
      const deps = client.Dependentes || [];
      if(deps.length){
        await db.Booking.deleteMany({ client: { $in: deps } });
        await db.Client.deleteMany({ _id: { $in: deps } });
      }
      
      // Deletar bookings do titular
      await db.Booking.deleteMany({ client: client._id });
      // Deletar titular
      await db.Client.findByIdAndDelete(client._id);
      console.log('[DELETE /api/v1/clients] ✅ Titular e dependentes deletados:', id);
      return res.status(204).end();
    }
    
    // Fallback in-memory
    const list = store.Clientes || [];
    const targetIdx = list.findIndex(x=>x.id===id);
    if(targetIdx<0) return res.status(404).json({ error: 'Cliente não encontrado' });
    
    const target = list[targetIdx];
    const tipo = target.Tipo || target.tipo || 'titular';
    
    if(tipo === 'dependente'){
      if(target.Titular){
        const t = typeof target.Titular === 'object' ? target.Titular : list.find(x=>x.id=== (target.Titular.id || target.Titular));
        if(t && t.Dependentes){ t.Dependentes = (t.Dependentes || []).filter(d=> (d.id || d) !== id); }
      }
      store.Clientes = list.filter(x=> x.id !== id);
      store.Hospedagens = (store.Hospedagens || []).filter(b=> b.clientId !== id && b.Cliente?.id !== id);
      return res.status(204).end();
    }
    
    const deps = (target.Dependentes || []).map(d=> d.id || d).filter(Boolean);
    if(deps.length){
      store.Clientes = list.filter(x=> !deps.includes(x.id));
      store.Hospedagens = (store.Hospedagens || []).filter(b=> !deps.includes(b.clientId) && !(b.Cliente && deps.includes(b.Cliente.id)));
    }
    store.Clientes = (store.Clientes || []).filter(x=> x.id !== id);
    store.Hospedagens = (store.Hospedagens || []).filter(b=> b.clientId !== id && b.Cliente?.id !== id);
    res.status(204).end();
  }catch(e){ 
    console.error('[DELETE /api/v1/clients/:id] ERRO:', e.message);
    res.status(500).json({ error: e.message }); 
  }
});

// Add documents and dependents routes
// Add documents and dependents routes
app.post('/api/v1/clients/:id/documents', async (req,res)=>{
  try{
    const id = req.params.id; const { tipo, numero, dataExpedicao } = req.body;
    if(useDb){
      const client = await db.Client.findById(id);
      if(!client) return res.status(404).json({ error: 'Cliente não encontrado' });
      const doc = { tipo, numero, dataExpedicao: dataExpedicao ? new Date(dataExpedicao) : undefined };
      client.Documentos = client.Documentos || [];
      client.Documentos.push(doc);
      await client.save();
      return res.status(201).json({ data: client.Documentos[client.Documentos.length-1] });
    }
    const c = (store.Clientes || []).find(x=>x.id===id);
    if(!c) return res.status(404).json({ error: 'Cliente não encontrado' });
    c.Documentos = c.Documentos || [];
    const doc = { id: genId(), tipo, numero, dataExpedicao };
    c.Documentos.push(doc);
    res.status(201).json({ data: doc });
  }catch(e){ res.status(500).json({ error: String(e) }); }
});

app.get('/api/v1/clients/:id/dependents', async (req,res)=>{
  try{
    const id = req.params.id;
    if(useDb){
      const deps = await db.Client.find({ Titular: id }).lean();
      return res.json({ data: deps.map(d=> ({ id: d._id, Nome: d.Nome })) });
    }
    const c = (store.Clientes || []).find(x=>x.id===id);
    if(!c) return res.status(404).json({ error: 'Cliente não encontrado' });
    const deps = c.Dependentes || [];
    res.json({ data: deps });
  }catch(e){ res.status(500).json({ error: String(e) }); }
});

app.post('/api/v1/clients/:id/dependents', async (req,res)=>{
  try{
    const titularId = req.params.id; const { name, nomeSocial, dataNascimento, documents, endereco, phoneDdd, phoneNumber } = req.body;
    if(useDb){
      const titular = await db.Client.findById(titularId);
      if(!titular) return res.status(404).json({ error: 'Titular não encontrado' });
      const depObj = {
              Nome: name,
              NomeSocial: nomeSocial || '',
              DataNascimento: new Date(dataNascimento || Date.now()),
              Tipo: 'dependente',
              Titular: titularId,
              Documentos: documents || [],
              Endereco: endereco || null,
              Telefones: phoneDdd || phoneNumber ? [{
                  Ddd: phoneDdd,
                  Numero: phoneNumber
              }] : []
            };
      if(phoneDdd || phoneNumber) depObj.Telefones.push({ Ddd: phoneDdd||'', Numero: phoneNumber||'' });
      await db.Client.findByIdAndUpdate(titularId, {
        $addToSet: { Dependentes: dep._id }
          });
      titular.Dependentes = titular.Dependentes || [];
      titular.Dependentes.push(dep._id);
      await titular.save();
      return res.status(201).json({ data: { id: dep._id, name: dep.Nome } });
    }
    const titular = (store.Clientes || []).find(x=>x.id===titularId);
    if(!titular) return res.status(404).json({ error: 'Titular não encontrado' });
    const dep = new ClienteClass(name || 'Sem nome', nomeSocial || '', dataNascimento ? new Date(dataNascimento) : new Date());
    dep.id = genId(); dep.Tipo = 'dependente'; dep.Titular = titular; dep.Documentos = documents || []; dep.Endereco = endereco || null; dep.Telefones = dep.Telefones || [];
    if(phoneDdd || phoneNumber) dep.Telefones.push({ Ddd: phoneDdd || '', Numero: phoneNumber || '' });
    titular.Dependentes = titular.Dependentes || []; titular.Dependentes.push(dep);
    store.Clientes.push(dep);
    res.status(201).json({ data: { id: dep.id, name: dep.Nome } });
  }catch(e){ res.status(500).json({ error: String(e) }); }
});

// --- Accommodations (simple plain objects stored in armazem.acomodacoes)
// accommodation types (from enumerations / directors)
const nomeAcomodacaoEnum = require(path.join(__dirname, '..', 'js', 'enumeracoes', 'NomeAcomadacao.js'));
// Build specs from directors (predefined characteristics)
const diretorIndex = require(path.join(__dirname, '..', 'js', 'diretores', 'index.js'));
app.get('/api/v1/accommodation-types', (req,res)=>{
  // return enumeration entries as { key, description }
  const map = nomeAcomodacaoEnum.NomeAcomadacao || {};
  const entries = Object.keys(map).map(k=> ({ key: k, description: map[k] }));
  res.json({ data: entries });
});

// Return detailed specs for each type (CamaSolteiro, CamaCasal, Climatizacao, Garagem, Suite)
app.get('/api/v1/accommodation-types-specs', (req,res)=>{
  const specs = [];
  // iterate exported directors
  Object.keys(diretorIndex).forEach(exportKey => {
    try{
      const DirClass = diretorIndex[exportKey];
      if(typeof DirClass === 'function'){
        const dir = new DirClass();
        if(typeof dir.construir === 'function'){
          const acom = dir.construir();
          // acomodacao has getters: NomeAcomadacao, CamaSolteiro, CamaCasal, Suite, Climatizacao, Garagem
          const key = String(acom.NomeAcomadacao || acom.NomeAcomodacao || '');
          specs.push({ key, CamaSolteiro: acom.CamaSolteiro || acom.camaSolteiro || 0, CamaCasal: acom.CamaCasal || acom.camaCasal || 0, Climatizacao: !!(acom.Climatizacao || acom.climatizacao), Garagem: acom.Garagem || acom.garagem || 0, Suite: acom.Suite || acom.suite || 0 });
        }
      }
    }catch(e){ /* ignore individual failures */ }
  });
  res.json({ data: specs });
});


// --- Bookings
app.get('/api/v1/bookings', async (req,res)=>{
  try{
    if(useDb){
      const bookings = await db.Booking.find().populate('client').populate('accommodation').lean();
      const mapped = bookings.map(b=> ({ id: b._id, clientId: b.client ? b.client._id : undefined, accommodationId: b.accommodation ? b.accommodation._id : undefined, from: b.from, to: b.to, notes: b.notes }));
      return res.json(mapped);
    }
    const bookings = (store.Hospedagens || []).map(b=> ({ id: b.id || (b.id = genId()), clientId: b.clientId || b.Cliente?.id, accommodationId: b.accommodationId || b.Acomodacao?.id, from: b.from || b.dataEntrada || b.DataEntrada, to: b.to || b.dataSaida || b.DataSaida, notes: b.notes }));
    res.json(bookings);
  }catch(e){ 
    console.error('[GET /api/v1/bookings] ERRO:', e.message);
    res.status(500).json({ error: e.message }); 
  }
});

app.post('/api/v1/bookings', async (req,res)=>{
  try{
    const { clientId, accommodationId, from, to, notes } = req.body;
    if(useDb){
      const client = await db.Client.findById(clientId);
      if(!client) return res.status(400).json({ error: 'Cliente inválido' });
      if (client.Tipo === 'dependente') return res.status(400).json({ error: 'Dependentes não podem criar hospedagens' });
      const acc = await db.Accommodation.findById(accommodationId);
      if(!acc) return res.status(400).json({ error: 'Acomodação inválida' });
      const booking = await db.Booking.create({ client: client._id, accommodation: acc._id, from, to, notes });
      console.log('[POST /api/v1/bookings] ✅ Hospedagem criada:', booking._id);
      return res.status(201).json({ id: booking._id, clientId: client._id, accommodationId: acc._id, from: booking.from, to: booking.to, notes: booking.notes });
    }
    const client = (store.Clientes || []).find(x=> x.id === clientId);
    if(!client) return res.status(400).json({ error: 'Cliente inválido' });
    const tipo = client.Tipo || client.tipo || 'titular';
    if(tipo === 'dependente') return res.status(400).json({ error: 'Dependentes não podem criar hospedagens' });
    const booking = { id: genId(), clientId, accommodationId, from, to, notes };
    store.Hospedagens.push(booking);
    res.status(201).json(booking);
  }catch(e){ 
    console.error('[POST /api/v1/bookings] ERRO:', e.message);
    res.status(500).json({ error: e.message }); 
  }
});

app.put('/api/v1/bookings/:id', async (req,res)=>{
  try{
    const id = req.params.id;
    const { from, to, notes } = req.body;
    
    if(useDb){
      const update = {};
      if(from) update.from = from;
      if(to) update.to = to;
      if(notes) update.notes = notes;
      
      const updated = await db.Booking.findByIdAndUpdate(id, update, { new: true });
      if(!updated) return res.status(404).json({ error: 'Hospedagem não encontrada' });
      console.log('[PUT /api/v1/bookings/:id] ✅ Hospedagem atualizada:', id);
      return res.json({ id: updated._id, clientId: updated.client, accommodationId: updated.accommodation, from: updated.from, to: updated.to, notes: updated.notes });
    }
    
    const list = store.Hospedagens;
    const idx = list.findIndex(x=>x.id===id);
    if(idx<0) return res.status(404).json({ error: 'Hospedagem não encontrada' });
    
    const b = list[idx];
    if(from) b.from = from;
    if(to) b.to = to;
    if(notes) b.notes = notes;
    
    res.json(b);
  }catch(e){ 
    console.error('[PUT /api/v1/bookings/:id] ERRO:', e.message);
    res.status(500).json({ error: e.message }); 
  }
});

app.delete('/api/v1/bookings/:id', async (req,res)=>{
  try{
    const id = req.params.id;
    if(useDb){
      await db.Booking.findByIdAndDelete(id);
      console.log('[DELETE /api/v1/bookings/:id] ✅ Hospedagem deletada:', id);
      return res.status(204).end();
    }
    store.Hospedagens = (store.Hospedagens || []).filter(x=>x.id!==id);
    res.status(204).end();
  }catch(e){ 
    console.error('[DELETE /api/v1/bookings/:id] ERRO:', e.message);
    res.status(500).json({ error: e.message }); 
  }
});

// --- Bulk replace endpoints (convenience for SPA adapter)
app.put('/api/v1/_bulk/clients', async (req,res)=>{
  try{
    const arr = Array.isArray(req.body) ? req.body : [];
    if(useDb){
      // wipe and insert - map incoming to Client schema fields where possible
      await db.Client.deleteMany({});
      const docs = arr.map(it=> ({ 
        Nome: it.nome || it.Nome || 'Sem nome', 
        NomeSocial: it.nomeSocial || it.NomeSocial || '', 
        DataNascimento: it.dataNascimento || it.DataNascimento || new Date(), 
        DataCadastro: it.dataCadastro || it.DataCadastro || new Date(), 
        Telefones: it.telefones || it.Telefones || [], 
        Endereco: it.endereco || it.Endereco || null, 
        Documentos: it.documentos || it.Documentos || [], 
        Tipo: it.tipo || it.Tipo || 'titular', 
        Pais: it.pais || it.Pais || '', 
        email: it.email || ''
      }));
      const inserted = await db.Client.insertMany(docs);
      return res.json(inserted.map(d=> ({ id: d._id, Nome: d.Nome })));
    }
    store.clientes = arr.map(item=> ({ ...item }));
    store.Clientes = store.clientes;
    res.json(store.Clientes);
  }catch(e){ 
    console.error('[PUT /api/v1/_bulk/clients] Error:', e);
    res.status(500).json({ error: String(e) }); 
  }
});

app.put('/api/v1/_bulk/accommodations', async (req,res)=>{
  try{
    const arr = Array.isArray(req.body) ? req.body : [];
    if(useDb){
      await db.Accommodation.deleteMany({});
      const docs = arr.map(it=> ({ name: it.name || it.Nome || '', type: it.type || it.Tipo || '', CamaSolteiro: it.CamaSolteiro || 0, CamaCasal: it.CamaCasal || 0, Climatizacao: it.Climatizacao || false, Garagem: it.Garagem || 0, Suite: it.Suite || 0, rate: it.rate || it.Valor || 0 }));
      const inserted = await db.Accommodation.insertMany(docs);
      return res.json(inserted.map(a=> ({ id: a._id, name: a.name })));
    }
    store.acomodacoes = arr.map(item=> ({ ...item }));
    store.Acomodacoes = store.acomodacoes;
    res.json(store.Acomodacoes);
  }catch(e){ 
    console.error('[PUT /api/v1/_bulk/accommodations] Error:', e);
    res.status(500).json({ error: String(e) }); 
  }
});

app.put('/api/v1/_bulk/bookings', async (req,res)=>{
  try{
    const arr = Array.isArray(req.body) ? req.body : [];
    if(useDb){
      await db.Booking.deleteMany({});
      const docs = arr.map(it=> ({ client: it.clientId || it.client || it.Cliente, accommodation: it.accommodationId || it.accommodation || it.Acomodacao, from: it.from || it.dataEntrada, to: it.to || it.dataSaida, notes: it.notes }));
      const inserted = await db.Booking.insertMany(docs);
      return res.json(inserted.map(b=> ({ id: b._id })));
    }
    store.hospedagens = arr.map(item=> ({ ...item }));
    store.Hospedagens = store.hospedagens;
    res.json(store.Hospedagens);
  }catch(e){ 
    console.error('[PUT /api/v1/_bulk/bookings] Error:', e);
    res.status(500).json({ error: String(e) }); 
  }
});

// Serve the UI statically for convenience
app.use('/', express.static(path.join(__dirname, '..', 'ui')));

// Global error handler for unhandled errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, ()=> console.log(`API server running at http://localhost:${port}/ - UI served at /index.html`));

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
