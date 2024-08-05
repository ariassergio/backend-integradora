// app.js

const express = require("express");
const app = require("./config/express.config");
const path = require('path');
const handlebars = require("./config/handlebars.config");
const connectMongoDB = require("./config/db.config");
const { isUser, isAdmin } = require("./middleware/authorization");
const logger = require("./config/logger");  // Importar el logger
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./config/swagger");
const session = require('express-session');

// Configurar Express
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
const cartRoutes = require("./routes/cartRoutes");
const chatRoutes = require("./routes/chatRoutes");
const productRoutes = require("./routes/productRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const viewsRoutes = require("./routes/viewsRoutes");
const mockRoutes = require("./routes/mockRoutes");
const userRoutes = require("./routes/userRoutes"); // Importar las rutas de usuarios
const checkoutRoutes = require('./routes/checkoutRoutes'); // Nueva ruta de checkout
const confirmationRoutes = require('./routes/confirmationRoutes'); // Nueva ruta de confirmación

// Configurar las rutas
app.use("/api/cart", isUser, cartRoutes);
app.use("/api/chat", isUser, chatRoutes);
app.use("/api/product", isAdmin, productRoutes);
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
