import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes.js'

const app = express();
const PORT = process.env.PORT || 8080;

// Conexión a la base de datos
mongoose.connect("mongodb+srv://sergioariaaas:W3tbatNjWzAXr2cx@cluster0.qh2nnui.mongodb.net/ecommerce?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
    console.log("Conexión a MongoDB Atlas establecida");

    // Creación de la base de datos y colecciones
    const db = mongoose.connection.db;
    await createCollections(db);

    console.log("Base de datos y colecciones creadas correctamente");
})
.catch(err => console.error("Error al conectar a MongoDB Atlas:", err));


// Función para crear las colecciones
async function createCollections(db) {
    // Colección "carts"
    await db.createCollection("carts", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["userId", "items"],
                properties: {
                    userId: {
                        bsonType: "objectId",
                        description: "Identificador único del usuario"
                    },
                    items: {
                        bsonType: "array",
                        description: "Lista de ítems en el carrito",
                        items: {
                            bsonType: "object",
                            required: ["productId", "quantity"],
                            properties: {
                                productId: {
                                    bsonType: "objectId",
                                    description: "Identificador único del producto"
                                },
                                quantity: {
                                    bsonType: "int",
                                    description: "Cantidad del producto en el carrito"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Colección "messages"
    await db.createCollection("messages", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["userId", "content", "timestamp"],
                properties: {
                    userId: {
                        bsonType: "objectId",
                        description: "Identificador único del usuario"
                    },
                    content: {
                        bsonType: "string",
                        description: "Contenido del mensaje"
                    },
                    timestamp: {
                        bsonType: "date",
                        description: "Marca de tiempo del mensaje"
                    }
                }
            }
        }
    });

    // Colección "products"
    await db.createCollection("products", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["name", "price", "description"],
                properties: {
                    name: {
                        bsonType: "string",
                        description: "Nombre del producto"
                    },
                    price: {
                        bsonType: "decimal",
                        description: "Precio del producto"
                    },
                    description: {
                        bsonType: "string",
                        description: "Descripción del producto"
                    }
                }
            }
        }
    });
    // Puedes definir los esquemas de las colecciones aquí mismo o importarlos desde archivos separados
}

// Middlewares
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(__dirname + '/public'))
app.engine('handlebars', handlebars.engine())

// Rutas
app.use("/api/products", productRoutes)

const server = app.listen(PORT, () => console.log("Servidor corriendo en puerto", PORT));
const io = new Server(server);

// Aquí puedes añadir más configuraciones y rutas según sea necesario