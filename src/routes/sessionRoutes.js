const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importa el modelo de usuario si lo tienes definido
const passport = require('../config/passport.config');

// Ruta para registrar usuarios
router.post('/register', async (req, res) => {

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json({ message: info.message });
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(201).json({ message: 'Usuario registrado correctamente' });
        });
    })(req, res, next);

    /*
    const { username, password } = req.body;
    try {
        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        // Crear un nuevo usuario
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }*/

});

// Ruta para realizar el inicio de sesión
router.post('/login', async (req, res) => {

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({ message: 'Inicio de sesión exitoso' });
        });
    })(req, res, next);


    /*
    const { username, password } = req.body;
    try {
        // Buscar el usuario en la base de datos
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
        // Verificar la contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
        // Generar el token JWT con duración de 1 minuto
        const token = jwt.sign({ username: user.username }, 'secreto', { expiresIn: '1m' });
        // Enviar el token JWT como respuesta
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }*/
});

module.exports = router;
