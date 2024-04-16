const mongoose = require("mongoose");

const connectMongoDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://sergioariaaas:W3tbatNjWzAXr2cx@cluster0.qh2nnui.mongodb.net/ecommerce?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Conexión a MongoDB Atlas establecida");

        // Creación de la base de datos y colecciones
        const db = mongoose.connection.db;
        await createCollections(db);

        console.log("Base de datos y colecciones creadas correctamente");
    } catch (error) {
        console.error("Error al conectar a MongoDB Atlas:", error);
        process.exit(1); // Termina el proceso con un código de error
    }
};

module.exports = connectMongoDB;
