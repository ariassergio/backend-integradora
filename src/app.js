// Importar las configuraciones necesarias
const app = require("./config/express.config");
const path = require('path');
const handlebars = require("./config/handlebars.config");
const connectMongoDB = require("./config/db.config");

// Configurar Express
app.engine('handlebars', handlebars.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views/"));

// Importar las rutas
const cartRoutes = require("./routes/cartRoutes");
const chatRoutes = require("./routes/chatRoutes");
const productRoutes = require("./routes/productRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const viewsRoutes = require("./routes/viewsRoutes");

// Configurar las rutas
app.use("/api/cart", cartRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/product", productRoutes);
app.use("/api/session", sessionRoutes);
app.use("/", viewsRoutes);

// Iniciar el servidor
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Conectar a MongoDB
connectMongoDB();

