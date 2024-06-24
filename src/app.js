// app.js

const app = require("./config/express.config");
const path = require('path');
const handlebars = require("./config/handlebars.config");
const connectMongoDB = require("./config/db.config");
const { isUser, isAdmin } = require("./middleware/authorization");
const logger = require("./config/logger");  // Importar el logger
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./config/swagger");

// Configurar Express
app.engine('handlebars', handlebars.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views/"));

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

// Configurar las rutas
app.use("/api/cart", isUser, cartRoutes);
app.use("/api/chat", isUser, chatRoutes);
app.use("/api/product", isAdmin, productRoutes);
app.use("/api/session", sessionRoutes);
app.use("/", viewsRoutes);
app.use("/mockingproducts", mockRoutes);

// Iniciar el servidor
const port = process.env.PORT || 8080;
app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});

// Conectar a MongoDB
connectMongoDB();
