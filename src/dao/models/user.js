const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
});

// Método para verificar si la contraseña es válida
userSchema.methods.isValidPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Crear el modelo de usuario a partir del esquema
const User = mongoose.model('User', userSchema);

// Exportar el modelo de usuario para su uso en otras partes de la aplicación
module.exports = User;
