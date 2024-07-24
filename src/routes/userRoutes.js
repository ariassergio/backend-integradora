import express from 'express';
import userController from '../controllers/userController.js';
import { isAdmin } from '../middleware/authorization.js';
import upload from '../config/multer.config.js'; // Importar multer
import User from '../models/User.js'; // Importar el modelo de usuario
import nodemailer from 'nodemailer'; // Importar nodemailer para enviar correos electrónicos

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Internal server error
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /api/users/current:
 *   get:
 *     summary: Get the current user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/current', userController.getCurrentUser);

/**
 * @swagger
 * /api/users/premium/{uid}:
 *   put:
 *     summary: Update user role to premium
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: body
 *         name: role
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             role:
 *               type: string
 *               enum: [user, premium]
 *         description: New role for the user
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role or bad request
 *       500:
 *         description: Internal server error
 */
router.put("/premium/:uid", isAdmin, async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const requiredDocuments = ["Identificación", "Comprobante de domicilio", "Comprobante de estado de cuenta"];
        const hasRequiredDocuments = requiredDocuments.every(doc => user.documents.some(d => d.name === doc));

        if (!hasRequiredDocuments) {
            return res.status(400).json({ error: "El usuario debe cargar los documentos requeridos antes de ser premium" });
        }

        user.role = 'premium';
        await user.save();
        res.json({ status: "success", message: "Rol de usuario actualizado a premium correctamente" });
    } catch (error) {
        console.error("Error al actualizar el rol del usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

/**
 * @swagger
 * /api/users/{uid}/documents:
 *   post:
 *     summary: Upload user documents
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Documents uploaded successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/:uid/documents', upload.array('documents'), async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const documents = req.files.map(file => ({
            name: file.originalname,
            reference: file.path
        }));
        
        user.documents = user.documents.concat(documents);
        await user.save();
        
        res.json({ status: 'success', message: 'Documentos subidos correctamente' });
    } catch (error) {
        console.error('Error al subir documentos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all users with basic information
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users with basic information
 *       500:
 *         description: Internal server error
 */
router.get('/', isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, 'first_name last_name email role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Delete users inactive for more than 2 days
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Inactive users deleted successfully
 *       500:
 *         description: Internal server error
 */
router.delete('/', isAdmin, async (req, res) => {
    try {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Cambia a 30 minutos para pruebas
        const inactiveUsers = await User.find({ last_connection: { $lt: twoDaysAgo } });

        for (const user of inactiveUsers) {
            // Configurar el transporte de correo electrónico
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'your-email@gmail.com',
                    pass: 'your-email-password'
                }
            });

            // Opciones del correo electrónico
            const mailOptions = {
                from: 'your-email@gmail.com',
                to: user.email,
                subject: 'Cuenta eliminada por inactividad',
                text: 'Tu cuenta ha sido eliminada por inactividad. Si tienes alguna pregunta, por favor, contacta con nosotros.'
            };

            // Enviar el correo electrónico
            await transporter.sendMail(mailOptions);

            // Eliminar el usuario de la base de datos
            await User.findByIdAndDelete(user._id);
        }

        res.json({ status: 'success', message: 'Usuarios inactivos eliminados y notificados correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/**
 * @swagger
 * /api/users/{uid}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:uid', isAdmin, async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/**
 * @swagger
 * /api/users/{uid}:
 *   put:
 *     summary: Update user role by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: body
 *         name: role
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             role:
 *               type: string
 *               enum: [user, premium, admin]
 *         description: New role for the user
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/:uid', isAdmin, async (req, res) => {
    try {
        const { uid } = req.params;
        const { role } = req.body;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        user.role = role;
        await user.save();
        res.json({ status: 'success', message: 'Rol de usuario actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/**
 * @swagger
 * /api/users/{uid}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:uid', isAdmin, async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findByIdAndDelete(uid);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ status: 'success', message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;
