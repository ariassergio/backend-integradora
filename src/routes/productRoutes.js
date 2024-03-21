import  ProductManager from "../dao/services/productManager.js"
import express from "express"

const productManager = new ProductManager()
const router = express.Router()

router.get("/all", (req, res)=>{
    let limit = req.query
    let data = productManager.getAll()

    res.json({data})

})

router.post("/add", (req, res)=>{

   const {title, description, category, brand, price, stock, status} = req.body

   const newProduct = req.body

   let result = productManager.addProduct(newProduct)
    res.json({data})

})

export default router