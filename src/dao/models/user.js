const mongoose = import('mongoose');
const bcrypt = import('bcrypt');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, default: 'user' },
  documents: [
    {
      name: { type: String, required: true },
      reference: { type: String, required: true }
    }
  ],
  last_connection: { type: Date }
});

// Método para verificar si la contraseña es válida
userSchema.methods.isValidPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Método para actualizar la última conexión
userSchema.methods.updateLastConnection = function() {
  this.last_connection = new Date();
  return this.save();
};

const User = mongoose.model('User', userSchema);

export default User;
