import productsModel from "../models/products.js"

export default class ProductManager{

    constructor(){
        console.log("Trabajando con productManager")
    }

    getAll = async (limit, page, sort, query) => {
        let options = {};
    
        // Aplicar límite
        if (limit) {
            options.limit = parseInt(limit);
        }
    
        // Aplicar paginación
        if (page) {
            options.skip = (parseInt(page) - 1) * options.limit || 0;
        }
    
        // Aplicar ordenamiento
        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }
    
        // Aplicar filtrado por nombre (query)
        let filter = {};
        if (query) {
            filter.title = { $regex: query, $options: 'i' };
        }
    
        let result = await productsModel.find(filter, null, options);
        return result;
    }
    getById = async (id) => {

        let result = await productsModel.findById(id)
        return result

    }
    getBybrand = async (brand) =>{

        let result = await productsModel.find({brand: brand})
        return result

    }
    addProduct = async (product) => {

        let result = await productsModel.create(product)
        return result

    }
    updateProduct = async (id, product) => {

        let result = await productsModel.updateOne({_id:id}, {$set: productData})
        return result

    }
    deleteProduct = async (id) => {

        let result = await productsModel.deleteOne({_id:id})
        return result
    }
}