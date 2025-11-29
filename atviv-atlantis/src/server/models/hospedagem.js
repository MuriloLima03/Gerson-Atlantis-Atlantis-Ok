const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HospedagemSchema = new Schema({
  id: String,
  clientId: { type: Schema.Types.ObjectId, ref: 'Cliente' },
  accommodationId: { type: Schema.Types.ObjectId, ref: 'Acomodacao' },
  from: Date,
  to: Date,
  notes: String
}, { collection: 'hospedagens' });

module.exports = mongoose.models.Hospedagem || mongoose.model('Hospedagem', HospedagemSchema);
