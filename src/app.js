// app.js

const express = import("express");
const app = import("./config/express.config");
const path = import('path');
const handlebars = import("./config/handlebars.config");
const connectMongoDB = import("./config/db.config");
const { isUser, isAdmin } = import("./middleware/authorization");
const logger = import("./config/logger");  // Importar el logger
const swaggerJsdoc = import("swagger-jsdoc");
const swaggerUi = import("swagger-ui-express");
const swaggerOptions = import("./config/swagger");
const session = import('express-session');

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
const cartRoutes = import("./routes/cartRoutes");
const chatRoutes = import("./routes/chatRoutes");
const productRoutes = import("./routes/productRoutes");
const sessionRoutes = import("./routes/sessionRoutes");
const viewsRoutes = import("./routes/viewsRoutes");
const mockRoutes = import("./routes/mockRoutes");
const userRoutes = import("./routes/userRoutes"); // Importar las rutas de usuarios
const checkoutRoutes = import('./routes/checkoutRoutes'); // Nueva ruta de checkout
const confirmationRoutes = import('./routes/confirmationRoutes'); // Nueva ruta de confirmación

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
