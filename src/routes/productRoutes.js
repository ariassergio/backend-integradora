import ProductManager from "../dao/services/productManager.js";
import express from "express";

const productManager = new ProductManager();
const router = express.Router();

router.get("/all", async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        // Lógica de filtrado
        let filter = {};
        if (query) {
            // Aquí puedes ajustar la lógica de filtrado según tus necesidades
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

router.post("/add", async (req, res) => {
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

export default router;
