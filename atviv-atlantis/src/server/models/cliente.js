const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TelefoneSchema = new Schema({ Ddd: String, Numero: String }, { _id: false });
const DocumentoSchema = new Schema({ tipo: String, numero: String, dataExpedicao: Date }, { _id: false });

const ClienteSchema = new Schema({
  Nome: String,
  nome: String,
  NomeSocial: String,
  DataNascimento: Date,
  DataCadastro: { type: Date, default: Date.now },
  email: String,
  Pais: String,
  Telefones: [TelefoneSchema],
  Endereco: Schema.Types.Mixed,
  Documentos: [DocumentoSchema],
  Dependentes: [{ type: Schema.Types.ObjectId, ref: 'Cliente' }],
  Tipo: { type: String, default: 'titular' },
  Titular: { type: Schema.Types.ObjectId, ref: 'Cliente' }
}, { collection: 'clientes' });

module.exports = mongoose.models.Cliente || mongoose.model('Cliente', ClienteSchema);
