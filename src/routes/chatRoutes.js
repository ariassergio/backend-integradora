import express from 'express';
import messagesModel from '../dao/models/messages.js';

const router = express.Router();

router.get('/chat', async (req, res) => {
    try {
        const messages = await messagesModel.find();
        res.render('chat', { messages });
    } catch (error) {
        console.error("Error al obtener los mensajes:", error);
        res.status(500).send("Error interno del servidor");
    }
});

export default router;
