import express from "express";
import handlebars from "express-handlebars";
import path from 'path';
import session from 'express-session';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import connectMongoDB from "./config/db.config.js";
import logger from "./config/logger.js";  // Importar el logger
import swaggerOptions from "./config/swagger.js";

// Importar las rutas
import cartRoutes from "./routes/cartRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import viewsRoutes from "./routes/viewsRoutes.js";
import mockRoutes from "./routes/mockRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // Importar las rutas de usuarios
import checkoutRoutes from './routes/checkoutRoutes.js'; // Nueva ruta de checkout
import confirmationRoutes from './routes/confirmationRoutes.js'; // Nueva ruta de confirmación

// Configurar Express
const app = express();
app.engine('handlebars', handlebars());
app.set("view engine", "handlebars");
app.set("views", path.join(path.resolve(), "views/"));

// Configuración de la sesión
app.use(session({ 
    secret: 'your_secret_key', 
    resave: false, 
    saveUninitialized: true 
}));

// Swagger setup
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Configurar las rutas
app.use("/api/cart", cartRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/product", productRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/users", userRoutes); // Agregar las rutas de usuarios
app.use("/", viewsRoutes);
app.use("/mockingproducts", mockRoutes);
app.use("/", checkoutRoutes); // Nueva ruta de checkout
app.use("/", confirmationRoutes); // Nueva ruta de confirmación

// Iniciar el servidor
const port = process.env.PORT || 8080;
app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});

// Conectar a MongoDB
connectMongoDB();
