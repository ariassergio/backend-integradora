import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import handlebars from 'express-handlebars';

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars());

// Middleware para sesiones
app.use(session({
    secret: 'mi_secreto_super_seguro',
    resave: false,
    saveUninitialized: true
}));

export default app;