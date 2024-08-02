import path from 'path';
import DAOFactory from '../dao/factory.js';
import UserRepository from '../repositories/userRepository.js';
import UserDTO from '../dto/userDTO.js';
import nodemailer from 'nodemailer';

// Obtener el tipo de DAO desde las variables de entorno o línea de comandos
const daoType = process.env.DAO_TYPE || 'mongo';  // 'mongo' por defecto
const userDao = DAOFactory.getDAO(daoType);
const userRepository = new UserRepository(userDao);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tu-email@gmail.com',
        pass: 'tu-contraseña'
    }
});

class UserController {
  constructor() {
    console.log("Controlador de usuarios");
  }

  async getAllUsers(req, res) {
    try {
      const users = await userRepository.getAllUsers({}, 'name email role'); // Solo obtener nombre, correo y rol
      res.json(users);
    } catch (error) {
      res.status(500).send({ error: 'Error retrieving users' });
    }
  }

  async createUser(req, res) {
    try {
      const user = await userRepository.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).send({ error: 'Error creating user' });
    }
  }

  async getCurrentUser(req, res) {
    try {
      const user = await userRepository.getUserById(req.user.id);
      const userDTO = new UserDTO(user);
      res.json(userDTO);
    } catch (error) {
      res.status(500).send({ error: 'Error retrieving user data' });
    }
  }

  async deleteInactiveUsers(req, res) {
    try {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Últimos 2 días

      const inactiveUsers = await userRepository.getAllUsers({ last_connection: { $lt: twoDaysAgo } });

      for (const user of inactiveUsers) {
        // Enviar correo de notificación
        const mailOptions = {
          from: 'tu-email@gmail.com',
          to: user.email,
          subject: 'Cuenta eliminada por inactividad',
          text: `Hola ${user.name}, tu cuenta ha sido eliminada por inactividad.`
        };

        await transporter.sendMail(mailOptions);
      }

      await userRepository.deleteUsers({ _id: { $in: inactiveUsers.map(user => user._id) } });

      res.json({ status: 'success', message: 'Usuarios inactivos eliminados y notificados correctamente' });
    } catch (error) {
      console.error('Error al eliminar usuarios inactivos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async modifyUserRole(req, res) {
    try {
      const { userId, role } = req.body;
      await userRepository.updateUser(userId, { role });
      res.redirect('/admin/users');
    } catch (error) {
      console.error('Error al modificar el rol del usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  renderLogin(req, res) {
    res.sendFile(path.join(__dirname, '../../views/auth/login.html'));
  }

  renderRegister(req, res) {
    res.sendFile(path.join(__dirname, '../../views/auth/register.html'));
  }

  renderRestore(req, res) {
    res.sendFile(path.join(__dirname, '../../views/auth/restore.html'));
  }
}

export default new UserController();
