import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import bcrypt from 'bcrypt';
import sessionRoutes from './routes/sessionRoutes.js';
import viewRoutes from './routes/viewRoutes.js';

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
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.engine('handlebars', handlebars.engine())

// Middleware para sesiones
app.use(session({
    secret: 'mi_secreto_super_seguro',
    resave: false,
    saveUninitialized: true
}));

// Middleware para rutas públicas
const publicRouteMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect('/profile'); // Redirecciona a la pantalla de perfil si hay una sesión activa
    }
    next(); // Continúa con el siguiente middleware
};

// Middleware para rutas privadas
const privateRouteMiddleware = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login'); // Redirecciona a la pantalla de login si no hay una sesión activa
    }
    next(); // Continúa con el siguiente middleware
};


// Rutas
app.use('/api/sessions', sessionRoutes);
app.use('/', viewRoutes);


// Rutas públicas
app.get('/login', publicRouteMiddleware, (req, res) => {
    res.render('login'); // Renderiza la pantalla de login si no hay una sesión activa
});

app.get('/register', publicRouteMiddleware, (req, res) => {
    res.render('register'); // Renderiza la pantalla de registro si no hay una sesión activa
});

// Rutas privadas
app.get('/profile', privateRouteMiddleware, (req, res) => {
    res.render('profile', { user: req.session.user }); // Renderiza la pantalla de perfil si hay una sesión activa
});

// Ruta para logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            res.sendStatus(500);
        } else {
            res.redirect('/login'); // Redirecciona a la pantalla de login después de cerrar sesión
        }
    });
});



const server = app.listen(PORT, () => console.log("Servidor corriendo en puerto", PORT));
const io = new Server(server);

//Configuracion Chat

io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    socket.on('chatMessage', async (data) => {
        console.log('Mensaje recibido:', data);
        try {
            await messagesModel.create(data);
            io.emit('chatMessage', data);
        } catch (error) {
            console.error("Error al guardar el mensaje:", error);
        }
    });
});

// Modelo de usuario
const User = mongoose.model('User', {
    username: String,
    password: String
});

// Rutas de sesiones
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.send("Usuario registrado correctamente");
    } catch (error) {
        res.status(500).send("Error al registrar usuario");
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            req.session.user = user;
            res.send("Login exitoso");
        } else {
            res.status(401).send("Credenciales incorrectas");
        }
    } else {
        res.status(401).send("Credenciales incorrectas");
    }
});
