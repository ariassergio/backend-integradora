const mongoose = import("mongoose");
const config = import('./config');


const connectMongoDB = async () => {
    try {
        await mongoose.connect(config.mongodbUri, {
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

export default connectMongoDB;
