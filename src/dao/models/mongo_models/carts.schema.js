const mongoose = require("mongoose");

const collectionName = "carts";

const cartsSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products", // Esto debe coincidir con el nombre que usaste al crear el modelo de Productos.
            },
            quantity: {
                type: Number,
                required: true,
            },
            subTotal: {
                type: Number,
                required: false,
            },
        },
    ],
});

const cartsModel = mongoose.model(collectionName, cartsSchema);
module.exports =  cartsModel;