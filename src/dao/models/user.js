const mongoose = require('mongoose');

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Otros campos que desees incluir en el modelo de usuario
});

// Crear el modelo de usuario a partir del esquema
const User = mongoose.model('User', userSchema);

// Exportar el modelo de usuario para su uso en otras partes de la aplicación
module.exports = User;
