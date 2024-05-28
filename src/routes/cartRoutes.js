const express = require("express");
const CartManager = require("../dao/services/cartManager.js");
const ProductManager = require("../dao/services/productManager.js");
const { isUser } = require("../middleware/authorization.js");
const ticketService = require('../dao/services/ticketService');
const { CustomError, ERROR_CODES } = require('../utils/errors');

const cartManager = new CartManager();
const productManager = new ProductManager();
const router = express.Router();

// DELETE api/carts/:cid/products/:pid
router.delete("/:cid/products/:pid", isUser, async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        await cartManager.deleteProduct(cid, pid);
        res.json({ status: "success", message: "Producto eliminado del carrito correctamente" });
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        next(new CustomError("Error al eliminar producto del carrito", ERROR_CODES.CART_UPDATE_ERROR));
    }
});

// PUT api/carts/:cid
router.put("/:cid", isUser, async (req, res, next) => {
    try {
        const { cid } = req.params;
        const products = req.body.products; // Arreglo de productos con formato especificado
        await cartManager.updateCart(cid, products);
        res.json({ status: "success", message: "Carrito actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        next(new CustomError("Error al actualizar el carrito", ERROR_CODES.CART_UPDATE_ERROR));
    }
});

// PUT api/carts/:cid/products/:pid
router.put("/:cid/products/:pid", isUser, async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json({ status: "success", message: "Cantidad de producto actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar la cantidad de producto en el carrito:", error);
        next(new CustomError("Error al actualizar la cantidad de producto en el carrito", ERROR_CODES.CART_UPDATE_ERROR));
    }
});

// DELETE api/carts/:cid
router.delete("/:cid", isUser, async (req, res, next) => {
    try {
        const { cid } = req.params;
        await cartManager.deleteCart(cid);
        res.json({ status: "success", message: "Carrito eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el carrito:", error);
        next(new CustomError("Error al eliminar el carrito", ERROR_CODES.CART_UPDATE_ERROR));
    }
});

// POST api/carts/:cid/purchase
router.post("/:cid/purchase", isUser, async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);

        if (!cart || cart.products.length === 0) {
            throw new CustomError("El carrito está vacío o no existe", ERROR_CODES.CART_NOT_FOUND);
        }

        let totalAmount = 0;
        const productsToPurchase = [];
        const unavailableProducts = [];

        for (const cartProduct of cart.products) {
            const product = await productManager.getProductById(cartProduct.productId);

            if (!product) {
                throw new CustomError("Producto no encontrado", ERROR_CODES.PRODUCT_NOT_FOUND);
            }

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
            throw new CustomError("No hay productos disponibles para la compra debido a stock insuficiente", ERROR_CODES.CART_UPDATE_ERROR);
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
        next(error);
    }
});

module.exports = router;
