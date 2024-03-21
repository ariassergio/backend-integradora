import mongoose from "mongoose";
const {Schema} = mongoose

const collectionName = "Carts"

const schema = new Schema({
    
    products: [{ 
        product: {
            type: mongoose.Schema.Types.ObjectId, ref: "products"
        },
        quantify: {
            type: Number,
            require: true
        }
    
    }]

    
   
})


// Verifica si la colección ya existe, si no, la crea con el esquema definido
const Cart = mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default cartsModel