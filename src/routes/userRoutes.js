import express from 'express';
import userController from '../controllers/userController.js';
import { isAdmin } from '../middleware/authorization.js'; // Importar middleware de autorización

const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/current', userController.getCurrentUser);

// Nueva ruta para actualizar el rol de un usuario a premium
router.put("/premium/:uid", isAdmin, async (req, res) => {
    try {
        const { uid } = req.params;
        const { role } = req.body;

        // Verificar si el rol proporcionado es válido
        if (role !== 'user' && role !== 'premium') {
            return res.status(400).json({ error: "Rol inválido. Debe ser 'user' o 'premium'" });
        }

        // Actualizar el rol del usuario
        await userManager.updateUserRole(uid, role);
        res.json({ status: "success", message: "Rol de usuario actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar el rol del usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
