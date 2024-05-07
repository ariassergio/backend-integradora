import path from 'path';

class UserController {
  constructor() {
    console.log("Controlador de usuarios");
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



