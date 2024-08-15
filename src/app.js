// app.js

import express from 'express';
import path from 'path';
import handlebars from './config/handlebars.config.js';
import connectMongoDB from './config/db.config.js';
import { isUser, isAdmin } from './middleware/authorization.js';
import logger from './config/logger.js';  // Importar el logger
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './config/swagger.js';
import session from 'express-session';

// Configurar Express
const app = express();
app.engine('handlebars', handlebars.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views/"));

// Configuración de la sesión
app.use(session({ 
    secret: 'your_secret_key', 
    resave: false, 
    saveUninitialized: true 
}));

// Swagger setup
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Importar las rutas
import cartRoutes from './routes/cartRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import productRoutes from './routes/productRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import viewsRoutes from './routes/viewsRoutes.js';
import mockRoutes from './routes/mockRoutes.js';
import userRoutes from './routes/userRoutes.js'; // Importar las rutas de usuarios

// Configurar las rutas
app.use("/api/cart", isUser, cartRoutes);
app.use("/api/chat", isUser, chatRoutes);
app.use("/api/product", isAdmin, productRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/users", userRoutes); // Agregar las rutas de usuarios
app.use("/", viewsRoutes);
app.use("/mockingproducts", mockRoutes);

// Iniciar el servidor
const port = process.env.PORT || 8080;
app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});

// Conectar a MongoDB
connectMongoDB();
