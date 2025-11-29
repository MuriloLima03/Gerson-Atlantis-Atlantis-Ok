const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://bob:UsBAR9y3QtENMJqA@clusterlegalteste.sctd2ab.mongodb.net/?appName=ClusterLegalTeste';

async function test() {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Conectado!');

    // Criar um schema simples
    const { Schema } = mongoose;
    const ClientSchema = new Schema({
      Nome: { type: String, required: true },
      email: String,
      Telefones: [{ Ddd: String, Numero: String }],
      DataCadastro: { type: Date, default: Date.now }
    });

    const Client = mongoose.model('TestClient2', ClientSchema, 'test_clients');

    // Tentar criar um cliente
    console.log('Criando cliente teste...');
    const created = await Client.create({
      Nome: 'Carlos Test',
      email: 'carlos@test.com',
      Telefones: [{ Ddd: '11', Numero: '987654321' }]
    });
    
    console.log('✅ Criado com sucesso:', created._id);
    
    // Buscar
    console.log('Buscando...');
    const found = await Client.findById(created._id);
    console.log('✅ Encontrado:', found);
    
    await mongoose.disconnect();
    console.log('Desconectado');
  } catch (err) {
    console.error('❌ ERRO:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

test();
