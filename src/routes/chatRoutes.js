import express from 'express';
import messagesModel from '../dao/models/messages.js';
import { isUser } from '../middleware/authorization.js'; // Importar middleware de autorización

const router = express.Router();

router.get('/chat', isUser, async (req, res) => { // Agregar middleware de autorización isUser
    try {
        const messages = await messagesModel.find();
        res.render('chat', { messages });
    } catch (error) {
        console.error("Error al obtener los mensajes:", error);
        res.status(500).json({ error: "Error interno del servidor" }); // Devolver respuesta JSON en caso de error
    }
});

export default router;
