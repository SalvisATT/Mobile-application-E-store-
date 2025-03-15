import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import EmployeeModel from './module/admin.module.js'; // Adjust path if necessary
import Product from './module/product.module.js'; // Adjust path if necessary

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Product Routes and Controller Functions
app.get("/products" , async(req, res) => {
  try{
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products})
  } catch (error) {
    console.log("error in fetching products:" , error.message);
    res.status(500).json({success: false , message: "Server Error"})
  }
})
app.post("/products", async (req, res)=>{
  const product = req.body;

  if (!product.name ||  !product.price || !product.image){
    return res.status(404).json({success:false, message: "Please procvide all fields"});
  }

  const newProduct = new Product(product);

  try{
    await newProduct.save()
    res.status(201).json({ success: true, data: newProduct})
  } catch (error){
    console.error("Error" , error.message);
    res.status(500).json({ success: false , message: "Server error"})
  }
})

app.delete('/products/delete/:id' , async (req , res) => {
  const {id} = req.params

  try {
    await Product.findByIdAndDelete(id);
    res.status(200),json({success: true, message: "Product deleted"})
  }catch (error) {
    res.status(404).json({message: "Product not found"})
  }

})

app.put('/products/update/:id', async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  // Fix: Validate ID correctly
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
      const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });

      if (!updatedProduct) {
          return res.status(404).json({ success: false, message: "Product not found" });
      }

      res.status(200).json({ success: true, message: "Product updated", data: updatedProduct });
  } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});


// Existing login and register routes
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Hardcoded admin credentials
  const adminEmail = "admin@example.com";
  const adminPassword = "adminpassword";

  try {
    // Check if the credentials match the hardcoded admin credentials
    if (email === adminEmail && password === adminPassword) {
      return res.json({ status: 'Admin' });
    }

    const user = await EmployeeModel.findOne({ email: email });

    if (!user) return res.status(404).json('User does not exist');
    if (user.password !== password) return res.status(401).json('Password is incorrect');
    
    res.json({ status: 'Success' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json('Server error');
  }
});


app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new EmployeeModel({ email, password });
    await newUser.save();

    res.status(201).json({ status: 'Success', message: 'User created successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Email route
app.post('/send-email', async (req, res) => {
  const { email, orderDetails } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'basicbeyong@gmail.com',
      subject: 'New Order',
      text: `Customer Email: ${email}\n\n${orderDetails}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).send('Failed to send email.');
  }
});

// Connect to the database and start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  });
