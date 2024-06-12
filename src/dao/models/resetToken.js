// models/resetToken.js
const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 3600 }
});

module.exports = mongoose.model('ResetToken', resetTokenSchema);
