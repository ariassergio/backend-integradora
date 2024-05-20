import express from "express";
import CartManager from "../dao/services/cartManager.js";
import { createTicket } from "../dao/services/ticketService.js"; // Importar servicio de tickets
import { isUser } from "../middleware/authorization.js"; // Importar middleware de autorización

const cartManager = new CartManager();
const router = express.Router();

// DELETE api/carts/:cid/products/:pid
router.delete("/:cid/products/:pid", isUser, async (req, res) => { // Agregar middleware de autorización isUser
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
router.put("/:cid", isUser, async (req, res) => { // Agregar middleware de autorización isUser
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
router.put("/:cid/products/:pid", isUser, async (req, res) => { // Agregar middleware de autorización isUser
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
router.delete("/:cid", isUser, async (req, res) => { // Agregar middleware de autorización isUser
    try {
        const { cid } = req.params;
        await cartManager.deleteCart(cid);
        res.json({ status: "success", message: "Carrito eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// POST api/carts/:cid/purchase - Finalizar la compra y crear un ticket
router.post("/:cid/purchase", isUser, async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCart(cid);

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const totalAmount = cart.products.reduce((acc, product) => acc + product.price * product.quantity, 0);
        const purchaser = req.user.email;

        const ticketData = {
            amount: totalAmount,
            purchaser: purchaser
        };

        const ticket = await createTicket(ticketData);

        // Aquí podrías vaciar el carrito o marcarlo como completado
        await cartManager.clearCart(cid);

        res.json({ status: "success", message: "Compra realizada con éxito", ticket });
    } catch (error) {
        console.error("Error al finalizar la compra:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
