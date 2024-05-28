import express from 'express';
import { generateMockProducts } from '../utils/mocking.js';

const router = express.Router();

router.get('/mockingproducts', (req, res) => {
    const mockProducts = generateMockProducts();
    res.json({ status: "success", products: mockProducts });
});

export default router;
