import express from "express";
import CartManager from "../dao/services/cartManager.js";

const cartManager = new CartManager();
const router = express.Router();

// DELETE api/carts/:cid/products/:pid
router.delete("/:cid/products/:pid", async (req, res) => {
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
router.put("/:cid", async (req, res) => {
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
router.put("/:cid/products/:pid", async (req, res) => {
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
router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        await cartManager.deleteCart(cid);
        res.json({ status: "success", message: "Carrito eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
