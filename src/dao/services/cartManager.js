import { cartsModel } from "../models/carts";

export default class CartManager {
    constructor() {
        console.log("Trabajando con cartManager");
    }

    async getCartById(id) {
        return await cartsModel.findById(id);
    }

    async createCart() {
        return await cartsModel.create({});
    }

    async addProduct(cid, pid, quantity) {
        let cart = await cartsModel.findById(cid);
        let productIndex = cart.products.findIndex(product => product.product.toString() === pid);

        if (productIndex !== -1) {
            // Si el producto ya existe en el carrito, actualiza la cantidad
            cart.products[productIndex].quantity += quantity;
        } else {
            // Si el producto no existe, lo agrega al carrito
            cart.products.push({ product: pid, quantity });
        }

        return await cart.save();
    }

    async deleteProduct(cid, pid) {
        let cart = await cartsModel.findById(cid);
        cart.products = cart.products.filter(product => product.product.toString() !== pid);
        return await cart.save();
    }

    // Método para actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cid, pid, quantity) {
        let cart = await cartsModel.findById(cid);
        let productIndex = cart.products.findIndex(product => product.product.toString() === pid);

        if (productIndex !== -1) {
            // Si el producto existe en el carrito, actualiza la cantidad
            cart.products[productIndex].quantity = quantity;
            return await cart.save();
        }
    }

    async deleteCart(cid) {
        return await cartsModel.findByIdAndDelete(cid);
    }
}
