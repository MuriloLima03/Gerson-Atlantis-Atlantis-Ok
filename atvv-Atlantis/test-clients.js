// Test script for clients API

async function test() {
  const BASE = 'http://localhost:3000';
  
  console.log('=== Testing Clients API ===\n');
  
  // Test 1: GET /api/v1/clients (should be empty)
  console.log('1. GET /api/v1/clients (lista vazia esperada)');
  try {
    let res = await fetch(BASE + '/api/v1/clients');
    let data = await res.json();
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  }
  
  console.log('\n---\n');
  
  // Test 2: POST /api/v1/clients (criar cliente)
  console.log('2. POST /api/v1/clients (criar novo cliente)');
  const newClient = {
    nome: "João Silva",
    nomeSocial: "João",
    dataNascimento: "1990-01-15",
    email: "joao@example.com",
    pais: "Brasil",
    tipo: "titular",
    Telefones: [
      { Ddd: "11", Numero: "987654321" }
    ],
    Endereco: {
      Rua: "Rua das Flores",
      Numero: "123",
      Bairro: "Centro",
      Cidade: "São Paulo",
      Estado: "SP",
      Pais: "Brasil"
    }
  };
  
  try {
    let res = await fetch(BASE + '/api/v1/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient)
    });
    let data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    clientId = data.id;
  } catch (e) {
    console.error('Error:', e.message);
  }
  
  console.log('\n---\n');
  
  // Test 3: GET /api/v1/clients (should have 1 client)
  console.log('3. GET /api/v1/clients (lista com 1 cliente)');
  try {
    let res = await fetch(BASE + '/api/v1/clients');
    let data = await res.json();
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test().catch(console.error);
