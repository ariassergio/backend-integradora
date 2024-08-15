import express from "express";
import { isAdmin, isUser, isPremium } from "../middleware/authorization.js"; // Importar middlewares de autorización
import ProductManager from "../dao/services/productManager.js";
import { sendMail } from '../config/mailer.js';
import { deleteProduct } from '../controllers/productController.js';

const productManager = new ProductManager();
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - category
 *         - brand
 *         - price
 *         - stock
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product
 *         title:
 *           type: string
 *           description: The title of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         category:
 *           type: string
 *           description: The category of the product
 *         brand:
 *           type: string
 *           description: The brand of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         stock:
 *           type: number
 *           description: The stock quantity of the product
 *         status:
 *           type: string
 *           description: The status of the product
 *         owner:
 *           type: string
 *           description: The owner of the product
 *       example:
 *         id: d5fE_asz
 *         title: Product 1
 *         description: This is a product description
 *         category: Electronics
 *         brand: BrandName
 *         price: 100
 *         stock: 20
 *         status: Available
 *         owner: 60d21b4667d0d8992e610c85
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 */

/**
 * @swagger
 * /products/all:
 *   get:
 *     summary: Get all products with pagination and filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products to return per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number to retrieve
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Filter query (e.g., category)
 *     responses:
 *       200:
 *         description: The list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 totalPages:
 *                   type: integer
 *                 prevPage:
 *                   type: integer
 *                 nextPage:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 hasPrevPage:
 *                   type: boolean
 *                 hasNextPage:
 *                   type: boolean
 *                 prevLink:
 *                   type: string
 *                 nextLink:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.get("/all", async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        // Lógica de filtrado
        let filter = {};
        if (query) {
            filter = { category: query }; // Ejemplo de filtrado por categoría
        }

        // Obtener productos con paginación y filtros
        const data = await productManager.getAll(limit, page, sort, filter);

        // Calcular el número total de páginas
        const totalCount = await productManager.count(filter);
        const totalPages = Math.ceil(totalCount / limit);

        // Calcular enlaces previos y siguientes
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        // Construir objeto de respuesta
        const response = {
            status: "success",
            payload: data,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: prevPage !== null,
            hasNextPage: nextPage !== null,
            prevLink: prevPage !== null ? `/api/products/all?page=${prevPage}&limit=${limit}` : null,
            nextLink: nextPage !== null ? `/api/products/all?page=${nextPage}&limit=${limit}` : null
        };

        res.json(response);
    } catch (error) {
        console.error("Error al obtener todos los productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

/**
 * @swagger
 * /products/add:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.post("/add", isPremium, async (req, res) => { // Cambiar middleware de autorización a isPremium
    try {
        const { title, description, category, brand, price, stock, status } = req.body;
        const owner = req.user._id; // Obtener el ID del usuario que crea el producto

        const newProduct = { title, description, category, brand, price, stock, status, owner };
        const result = await productManager.addProduct(newProduct);
        res.json({ status: "success", message: "Producto agregado correctamente" });
    } catch (error) {
        console.error("Error al agregar un producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               brand:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: The product was updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Product not found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.put("/:id", isUser, async (req, res) => { // Cambiar middleware de autorización a isUser
    try {
        const productId = req.params.id;
        const updatedFields = req.body; // Campos actualizados del producto
        const product = await productManager.getProductById(productId);

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        if (req.user.role !== 'admin' && product.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Acceso denegado" });
        }

        const result = await productManager.updateProduct(productId, updatedFields);
        res.json({ status: "success", message: "Producto actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar un producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove a product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Product not found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const user = await User.findById(product.userId);
        if (user && user.role === 'premium') {
            sendMail(user.email, 'Producto Eliminado', `El producto ${product.name} ha sido eliminado.`);
        }

        res.json({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:productId', isAdmin, deleteProduct);

export default router;
