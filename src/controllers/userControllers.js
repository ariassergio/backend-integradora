import path from 'path';
import DAOFactory from '../dao/factory.js';
import UserRepository from '../repositories/userRepository.js';
import UserDTO from '../dto/userDTO.js';

// Obtener el tipo de DAO desde las variables de entorno o línea de comandos
const daoType = process.env.DAO_TYPE || 'mongo';  // 'mongo' por defecto
const userDao = DAOFactory.getDAO(daoType);
const userRepository = new UserRepository(userDao);

class UserController {
  constructor() {
    console.log("Controlador de usuarios");
  }

  async getAllUsers(req, res) {
    try {
      const users = await userRepository.getAllUsers();
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



