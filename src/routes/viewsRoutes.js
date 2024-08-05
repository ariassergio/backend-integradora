import express from 'express';
import axios from 'axios';
import User from '../models/User.js'; // Importa el modelo de usuario con la extensión .js
import { isAdmin } from '../middleware/authorization.js'; // Importa el middleware de autorización con la extensión .js
import upload from '../config/multer.config.js'; // Importar multer para manejo de archivos

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Verificar si hay una sesión iniciada (comprobar si hay un token de sesión en las cookies)
        const token = req.cookies.token; 
        if (!token) {
            // Si no hay un token de sesión, redirigir al usuario a la página de inicio de sesión
            return res.redirect('/login');
        }

        // Si hay un token de sesión, adjuntarlo en el encabezado de la solicitud
        const headers = {
            Authorization: `Bearer ${token}`
        };

        // Realizar una solicitud al servidor para verificar el token y obtener los datos del usuario
        const response = await axios.get('/api/session/verify', { headers });

        // Si la solicitud es exitosa, renderizar la vista de perfil con los datos del usuario
        const userData = response.data;
        res.render('profile', { user: userData });
    } catch (error) {
        // Si hay un error al verificar el token o al obtener los datos del usuario, redirigir al usuario a la página de inicio de sesión
        console.error('Error al cargar la página principal:', error);
        res.redirect('/login');
    }
});

router.get('/login', (req, res) => {
  // Renderiza el formulario de login
  res.render('login');
});

router.get('/register', (req, res) => {
  // Renderiza el formulario de registro
  res.render('register');
});

router.get('/profile', (req, res) => {
  // Renderiza la vista de perfil
  res.render('profile');
});

// Restaurar password
router.get('/restore', (req, res) => {
  res.render('restore');
});

// Vista para administradores: gestionar usuarios
router.get('/admin/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, 'first_name last_name email role');
        res.render('adminUsers', { users });
    } catch (error) {
        console.error('Error al cargar los usuarios:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Actualizar rol de usuario
router.post('/admin/users/:uid/role', isAdmin, async (req, res) => {
    try {
        const { uid } = req.params;
        const { role } = req.body;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        user.role = role;
        await user.save();
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error al actualizar el rol del usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Eliminar usuario
router.post('/admin/users/:uid/delete', isAdmin, async (req, res) => {
    try {
        const { uid } = req.params;
        await User.findByIdAndDelete(uid);
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Subir documentos de usuario
router.post('/users/:uid/documents', upload.array('documents'), async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        
        const documents = req.files.map(file => ({
            name: file.originalname,
            reference: file.path
        }));
        
        user.documents = user.documents.concat(documents);
        await user.save();
        
        res.redirect(`/users/${uid}/documents`);
    } catch (error) {
        console.error('Error al subir documentos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;
