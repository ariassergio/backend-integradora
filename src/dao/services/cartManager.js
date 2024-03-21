import {cartsModel} from "../models/carts"


export default class CartManager{

    constructor(){
        console.log("Trabajando con cartManager")
    }


    getCartById = async (id) => {
        let result = await cartsModel.findById(id)
        return result
    }
    createCart = async () => {
        let result = await cartsModel.create({})
        return result
    }
    addProduct = async (cid, pid, quantity) => {
        let cart = await cartsModel.findById({cid})
        let product = cart.products.find((product) => product.product.toString() === pid)

        if (product){
            product.quantity += quantity;
        }else{
            cart.products.push({product: pid, quantity});
        }

        return await cart.save();

    }
    deleteProduct = async (cid, pid) => {
        let cart = await cartsModel.findById(cid)
        let product = cart.products.find((product) => product.product.toString() === pid)

        if(product === 0){


        }else{
            cart.product.splice(product)
        }

        return await cart.save();
    }
}