import express from "express";
import CartManager from "../dao/services/cartManager.js";
import ProductManager from "../dao/services/productManager.js";
import { isUser } from "../middleware/authorization.js";
const ticketService = require('../dao/services/ticketService');
const logger = require("../config/logger");

const cartManager = new CartManager();
const productManager = new ProductManager();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: The cart managing API
 */

/**
 * @swagger
 * /carts/{cid}/products/{pid}:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart id
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product was removed from the cart
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
router.delete("/:cid/products/:pid", isUser, async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await cartManager.deleteProduct(cid, pid);
        res.json({ status: "success", message: "Producto eliminado del carrito correctamente" });
        logger.info(`Producto ${pid} eliminado del carrito ${cid}`);
    } catch (error) {
        logger.error("Error al eliminar producto del carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

/**
 * @swagger
 * /carts/{cid}:
 *   put:
 *     summary: Update the cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: The cart was updated
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
router.put("/:cid", isUser, async (req, res) => {
    try {
        const { cid } = req.params;
        const products = req.body.products;
        await cartManager.updateCart(cid, products);
        res.json({ status: "success", message: "Carrito actualizado correctamente" });
        logger.info(`Carrito ${cid} actualizado`);
    } catch (error) {
        logger.error("Error al actualizar el carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

/**
 * @swagger
 * /carts/{cid}/products/{pid}:
 *   put:
 *     summary: Update product quantity in the cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart id
 *       - in: path
 *         name: pid
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
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The product quantity was updated
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
router.put("/:cid/products/:pid", isUser, async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json({ status: "success", message: "Cantidad de producto actualizada correctamente" });
        logger.info(`Cantidad de producto ${pid} en carrito ${cid} actualizada a ${quantity}`);
    } catch (error) {
        logger.error("Error al actualizar la cantidad de producto en el carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

/**
 * @swagger
 * /carts/{cid}:
 *   delete:
 *     summary: Delete the cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart id
 *     responses:
 *       200:
 *         description: The cart was deleted
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
router.delete("/:cid", isUser, async (req, res) => {
    try {
        const { cid } = req.params;
        await cartManager.deleteCart(cid);
        res.json({ status: "success", message: "Carrito eliminado correctamente" });
        logger.info(`Carrito ${cid} eliminado`);
    } catch (error) {
        logger.error("Error al eliminar el carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

/**
 * @swagger
 * /carts/{cid}/purchase:
 *   post:
 *     summary: Purchase the items in the cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart id
 *     responses:
 *       200:
 *         description: The purchase was successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 ticket:
 *                   type: object
 *                 purchasedProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                 unavailableProducts:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: The cart is empty or does not exist
 *       500:
 *         description: Internal server error
 */
router.post("/:cid/purchase", isUser, async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);

        if (!cart || cart.products.length === 0) {
            logger.warn(`El carrito ${cid} está vacío o no existe`);
            return res.status(400).json({ error: "El carrito está vacío o no existe" });
        }

        let totalAmount = 0;
        const productsToPurchase = [];
        const unavailableProducts = [];

        for (const cartProduct of cart.products) {
            const product = await productManager.getProductById(cartProduct.productId);

            if (product.stock >= cartProduct.quantity) {
                product.stock -= cartProduct.quantity;
                await product.save();
                totalAmount += product.price * cartProduct.quantity;
                productsToPurchase.push(cartProduct);
            } else {
                unavailableProducts.push(cartProduct.productId);
            }
        }

        if (productsToPurchase.length === 0) {
            logger.warn(`No hay productos disponibles para la compra en el carrito ${cid} debido a stock insuficiente`);
            return res.status(400).json({ error: "No hay productos disponibles para la compra debido a stock insuficiente" });
        }

        const purchaser = req.user.email;

        const ticketData = {
            amount: totalAmount,
            purchaser
        };

        const newTicket = await ticketService.createTicket(ticketData);

        const remainingProducts = cart.products.filter(cartProduct => 
            unavailableProducts.includes(cartProduct.productId)
        );
        await cartManager.updateCart(cid, remainingProducts);

        res.json({ 
            status: "success", 
            message: "Compra realizada con éxito", 
            ticket: newTicket, 
            purchasedProducts: productsToPurchase,
            unavailableProducts 
        });
        logger.info(`Compra realizada con éxito para el carrito ${cid}`);
    } catch (error) {
        logger.error("Error al realizar la compra:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

/**
 * @swagger
 * /carts/{cid}/products/add:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: The product was added to the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       403:
 *         description: You cannot add your own product to the cart
 *       500:
 *         description: Internal server error
 */
router.post("/:cid/products/add", isUser, async (req, res) => {
    try {
        const { cid } = req.params;
        const { productId } = req.body;

        // Verificar si el usuario es premium
        if (req.user.role === 'premium') {
            // Obtener información del producto
            const product = await productManager.getProductById(productId);

            // Verificar si el producto pertenece al usuario premium
            if (product.owner.toString() === req.user._id.toString()) {
                return res.status(403).json({ error: "No puedes agregar tu propio producto al carrito" });
            }
        }

        // Agregar producto al carrito
        await cartManager.addProductToCart(cid, productId);
        res.json({ status: "success", message: "Producto agregado al carrito correctamente" });
    } catch (error) {
        console.error("Error al agregar un producto al carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
