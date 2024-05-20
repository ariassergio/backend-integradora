const mongoose = require('mongoose');

// Definir el esquema del Ticket
const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    purchase_datetime: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
});

// Crear el modelo Ticket
const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
