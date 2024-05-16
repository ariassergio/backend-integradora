import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/current', userController.getCurrentUser);

export default router;
