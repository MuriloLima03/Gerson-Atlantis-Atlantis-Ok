const mongoose = require('mongoose');
const { Schema } = mongoose;

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://bob:UsBAR9y3QtENMJqA@clusterlegalteste.sctd2ab.mongodb.net/?appName=ClusterLegalTeste';


let connection = null;

async function connect(){
  if(connection) return connection;
  connection = await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  return connection;
}

// Subdocuments
const TelefoneSchema = new Schema({ Ddd: String, Numero: String }, { _id: false });
const EnderecoSchema = new Schema({ Rua: String, Numero: String, Cidade: String, Estado: String, Pais: String }, { _id: false });
const DocumentoSchema = new Schema({ tipo: String, numero: String, dataExpedicao: Date }, { _id: true });

// Client
const ClientSchema = new Schema({
  Nome: { type: String, required: true },
  NomeSocial: String,
  DataNascimento: Date,
  DataCadastro: { type: Date, default: Date.now },
  Telefones: [TelefoneSchema],
  Endereco: EnderecoSchema,
  Documentos: [DocumentoSchema],
  Tipo: { type: String, enum: ['titular','dependente'], default: 'titular' },
  Titular: { type: Schema.Types.ObjectId, ref: 'Client' },
  Dependentes: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
  Pais: String,
  email: String
});

// Accommodation
const AccommodationSchema = new Schema({
  name: String,
  type: String,
  CamaSolteiro: Number,
  CamaCasal: Number,
  Climatizacao: Boolean,
  Garagem: Number,
  Suite: Number,
  rate: Number
});

// Booking
const BookingSchema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  accommodation: { type: Schema.Types.ObjectId, ref: 'Accommodation', required: true },
  from: Date,
  to: Date,
  notes: String
});

const Client = mongoose.model('Client', ClientSchema);
const Accommodation = mongoose.model('Accommodation', AccommodationSchema);
const Booking = mongoose.model('Booking', BookingSchema);

module.exports = { connect, Client, Accommodation, Booking };
