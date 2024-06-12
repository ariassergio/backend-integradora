import express from "express";
import { isAdmin, isUser, isPremium } from "../middleware/authorization.js"; // Importar middlewares de autorización
import ProductManager from "../dao/services/productManager.js";

const productManager = new ProductManager();
const router = express.Router();

// Endpoint para obtener todos los productos
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

// Endpoint para agregar un producto
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

// Endpoint para actualizar un producto
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

// Endpoint para eliminar un producto
router.delete("/:id", isUser, async (req, res) => { // Cambiar middleware de autorización a isUser
    try {
        const productId = req.params.id;
        const product = await productManager.getProductById(productId);

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        if (req.user.role !== 'admin' && product.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Acceso denegado" });
        }

        const result = await productManager.deleteProduct(productId);
        res.json({ status: "success", message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar un producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
