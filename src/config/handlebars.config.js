const path = require("path");
const hbs = require("express-handlebars");
const Handlebars = require('handlebars');

// Configura Handlebars

// Crea una instancia de Handlebars
const handlebars = hbs.create({
    // Configura el layout por defecto
    defaultLayout: "main",

    // Configura la carpeta donde se encuentran los parciales
    partialsDir: path.join(__dirname, '../views/partials'),

    // Configura Handlebars para que permita el acceso a propiedades y métodos de objetos
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});

// Registra los helpers de Handlebars

// Helper para sumar dos valores
Handlebars.registerHelper("add", function (value1, value2) {
    return value1 + value2;
});

// Helper para restar dos valores
Handlebars.registerHelper("subtract", function (value1, value2) {
    return value1 - value2;
});

// Helper para multiplicar dos valores
// Handlebars.registerHelper("multiply", function (value1, value2) {
//     return value1 * value2;
// });

module.exports = handlebars;