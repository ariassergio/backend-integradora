import express from 'express';
import axios from 'axios';
import User from '../models/User'; // Importa el modelo de usuario si lo tienes definido

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
});

router.get('/register', (req, res) => {
  // Renderiza el formulario de registro
});

router.get('/profile', (req, res) => {
  // Renderiza la vista de perfil
});
//restaurar password
router.get("/restore", (req, res) => {
  res.render("restore");
});

export default router;
