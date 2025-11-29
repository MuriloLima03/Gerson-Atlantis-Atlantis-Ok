const mongoose = require('mongoose');
const path = require('path');

// MongoDB connection helper. This project requires MONGODB_URI to be set.
const uri = process.env.MONGODB_URI || 'mongodb+srv://bob:UsBAR9y3QtENMJqA@clusterlegalteste.sctd2ab.mongodb.net/?appName=ClusterLegalTeste';
let _connected = false;
const models = {};

async function connect() {
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set. Please set it before starting the server.');
  }
  try {
    // connect with modern mongoose options
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    _connected = true;
    // load models
    models.Cliente = require(path.join(__dirname, 'models', 'cliente.js'));
    models.Acomodacao = require(path.join(__dirname, 'models', 'acomodacao.js'));
    models.Hospedagem = require(path.join(__dirname, 'models', 'hospedagem.js'));
    console.log('Connected to MongoDB. Models loaded.');
  } catch (err) {
    _connected = false;
    console.error('Failed to connect to MongoDB:', err && err.message ? err.message : err);
    throw err;
  }
}

function isConnected() {
  return _connected;
}

module.exports = { connect, isConnected, models, mongoose };
