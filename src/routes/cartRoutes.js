import express from "express";
import CartManager from "../dao/services/cartManager.js";
import ProductManager from "../dao/services/productManager.js";
import { isUser } from "../middleware/authorization.js";
const ticketService = require('../dao/services/ticketService'); // Importar el servicio de ticket

const cartManager = new CartManager();
const productManager = new ProductManager();
const router = express.Router();

// DELETE api/carts/:cid/products/:pid
router.delete("/:cid/products/:pid", isUser, async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await cartManager.deleteProduct(cid, pid);
        res.json({ status: "success", message: "Producto eliminado del carrito correctamente" });
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// PUT api/carts/:cid
router.put("/:cid", isUser, async (req, res) => {
    try {
        const { cid } = req.params;
        const products = req.body.products; // Arreglo de productos con formato especificado
        await cartManager.updateCart(cid, products);
        res.json({ status: "success", message: "Carrito actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// PUT api/carts/:cid/products/:pid
router.put("/:cid/products/:pid", isUser, async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json({ status: "success", message: "Cantidad de producto actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar la cantidad de producto en el carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// DELETE api/carts/:cid
router.delete("/:cid", isUser, async (req, res) => {
    try {
        const { cid } = req.params;
        await cartManager.deleteCart(cid);
        res.json({ status: "success", message: "Carrito eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// POST api/carts/:cid/purchase
router.post("/:cid/purchase", isUser, async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío o no existe" });
        }

        let totalAmount = 0;
        const productsToPurchase = [];
        const unavailableProducts = [];

        for (const cartProduct of cart.products) {
            const product = await productManager.getProductById(cartProduct.productId);

            if (product.stock >= cartProduct.quantity) {
                product.stock -= cartProduct.quantity;
                await product.save(); // Actualizar el stock del producto en la base de datos
                totalAmount += product.price * cartProduct.quantity;
                productsToPurchase.push(cartProduct);
            } else {
                unavailableProducts.push(cartProduct.productId);
            }
        }

        if (productsToPurchase.length === 0) {
            return res.status(400).json({ error: "No hay productos disponibles para la compra debido a stock insuficiente" });
        }

        const purchaser = req.user.email;

        const ticketData = {
            amount: totalAmount,
            purchaser
        };

        const newTicket = await ticketService.createTicket(ticketData);

        // Filtrar los productos comprados y dejar los no comprados en el carrito
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
    } catch (error) {
        console.error("Error al realizar la compra:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
