import express from "express";
import { isAdmin } from "../middleware/authorization.js"; // Importar middleware de autorización
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
router.post("/add", isAdmin, async (req, res) => { // Agregar middleware de autorización isAdmin
    try {
        const { title, description, category, brand, price, stock, status } = req.body;
        const newProduct = { title, description, category, brand, price, stock, status };
        const result = await productManager.addProduct(newProduct);
        res.json({ status: "success", message: "Producto agregado correctamente" });
    } catch (error) {
        console.error("Error al agregar un producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Endpoint para actualizar un producto (ejemplo)
router.put("/:id", isAdmin, async (req, res) => { // Agregar middleware de autorización isAdmin
    try {
        const productId = req.params.id;
        const updatedFields = req.body; // Campos actualizados del producto
        const result = await productManager.updateProduct(productId, updatedFields);
        res.json({ status: "success", message: "Producto actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar un producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Endpoint para eliminar un producto (ejemplo)
router.delete("/:id", isAdmin, async (req, res) => { // Agregar middleware de autorización isAdmin
    try {
        const productId = req.params.id;
        const result = await productManager.deleteProduct(productId);
        res.json({ status: "success", message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar un producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
