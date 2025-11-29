const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AcomodacaoSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  rate: { type: Number, required: true, default: 0 },
  CamaSolteiro: { type: Number, default: 0 },
  CamaCasal: { type: Number, default: 0 },
  Climatizacao: { type: Boolean, default: false },
  Garagem: { type: Number, default: 0 },
  Suite: { type: Number, default: 0 },
  disponivel: { type: Boolean, default: true }
}, { collection: 'acomodacoes' });

module.exports = mongoose.models.Acomodacao || mongoose.model('Acomodacao', AcomodacaoSchema);
