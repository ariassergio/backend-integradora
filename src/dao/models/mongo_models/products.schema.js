const mongoose = import("mongoose");
const mongoosePaginate = import('mongoose-paginate-v2');

const collectionName = "products";

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required:true,
    },
    status: {
        type: Boolean,
        required:true,
    },
    stock: {
        type: Number,
        required: true,
    },
    thumbnails: {
        type: [String],
        required: true,
    },
});

productsSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model(collectionName, productsSchema);
export default productsModel;