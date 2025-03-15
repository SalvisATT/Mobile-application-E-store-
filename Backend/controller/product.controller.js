import Product from '../module/product.module.js'
import mongoose from 'mongoose'


export const getProduct = async (req , res) => {
    try{
        const products = await Product.find({})
        res.status(200).json({
            success:true , data: products
        })

    }catch (error){
        console.log("error in fetching products", error.message)
        res.status(500).json({success: false, message: "servver failure"})
    }
}


export const postProduct = async (req , res) => {
    const product = req.body

    if (!product.name || !product.price || !product.image){
        return res.status(404).json({
            success: false, message: "Please provide all fields with values!"
        })
    }
    const newProduct = new Product(product);

    try{
        await newProduct.save()
        res.status(201).json({ success:true , data: newProduct})
    }catch (error){
        console.error("Error in creating process", error.message)
        res.status(500).json({
            success: false, message: "Server Error"
        })
    }
}

export const deleteProduct = async (req , res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: "Invalid product"})
    }

    try{
        await Product.findByIdAndDelete(id)
    }catch (error){
        res.status(500).json({success:false , message: "Server error"})
    }
}

export const putProduct = async (req, res) => {
    const { id } = req.params;
    const product = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid product ID" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true, 
            data: updatedProduct
        });
    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({
            success: false, 
            message: "Server error"
        });
    }
};