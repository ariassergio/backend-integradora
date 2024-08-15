const express = import('express');
const router = express.Router();
const passport = import('../config/passport.config');
const User = import('../models/User'); // Importa el modelo de usuario

// Ruta para registrar usuarios
router.post('/register', (req, res, next) => {
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
});

// Ruta para realizar el inicio de sesión
router.post('/login', (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.login(user, async (err) => {
            if (err) {
                return next(err);
            }
            try {
                // Actualizar la última conexión
                await User.updateOne({ _id: user._id }, { last_connection: new Date() });
                return res.status(200).json({ message: 'Inicio de sesión exitoso' });
            } catch (error) {
                return next(error);
            }
        });
    })(req, res, next);
});

// Ruta para cerrar sesión
router.post('/logout', (req, res, next) => {
    if (req.isAuthenticated()) {
        req.logout(async (err) => {
            if (err) {
                return next(err);
            }
            try {
                // Actualizar la última conexión
                await User.updateOne({ _id: req.user._id }, { last_connection: new Date() });
                res.status(200).json({ message: 'Cierre de sesión exitoso' });
            } catch (error) {
                res.status(500).json({ message: 'Error al cerrar sesión' });
            }
        });
    } else {
        res.status(401).json({ message: 'No hay usuario autenticado' });
    }
});

// Ruta para obtener el usuario actual
router.get('/current', (req, res) => {
    // Verificar si hay un usuario autenticado en la sesión
    if (req.isAuthenticated()) {
        // Usuario autenticado, devolver el usuario actual
        res.status(200).json({ user: req.user });
    } else {
        // No hay usuario autenticado en la sesión
        res.status(401).json({ message: 'No hay usuario autenticado' });
    }
});

export default router;
