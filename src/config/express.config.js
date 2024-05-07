import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import handlebars from 'express-handlebars';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/user.js';
import config from './config.js';

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars());

// Configuración de Passport
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false, { message: 'Credenciales incorrectas' });
    }
    const isValid = await user.isValidPassword(password);
    if (!isValid) {
      return done(null, false, { message: 'Credenciales incorrectas' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

// Middleware para sesiones
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));

// Inicialización de Passport y sesión de Passport
app.use(passport.initialize());
app.use(passport.session());

// Importa las rutas de sesión
import sessionRoutes from './routes/sessionRoutes.js';

// Asocia las rutas de sesión
app.use("/api/sessions", sessionRoutes);

export default app;
