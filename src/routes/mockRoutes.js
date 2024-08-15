// routes/mockRoutes.js

import express from 'express';
import { generateMockProducts } from '../utils/mocking';
const logger = import('../config/logger');

const router = express.Router();

router.get('/mockingproducts', (req, res) => {
    const mockProducts = generateMockProducts();
    res.json({ status: "success", products: mockProducts });
});

router.get('/loggerTest', (req, res) => {
    logger.debug('Debug message');
    logger.http('HTTP message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');
    logger.fatal('Fatal message');
    res.send('Logger test completed');
});

export default router;
