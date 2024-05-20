// const router = require("express").Router();
// import apiKeyMiddleWare from "../middleware/apiKeyMiddleWare.js";
import { Router } from "express";
import { ApiCall } from "../services/axios-helper/apicall.js";
import { data } from "../productsData.js";
import ErrorHandeler from "../errors/ErrorHandeling.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { mongoURI } from "../models/config.js";
import createproductdatas from "../models/createProductData.js";
import user from "../models/login.js";
const mainRoutes = Router();
// mainRoutes.use(apiKeyMiddleWare);  for general routes

//DB connect
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

//using mongo db apis
//fetch api
//search, pagination
mainRoutes.get("/productdatas", async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 3;
    const skip = (pageNumber - 1) * limitNumber;

    const searchQuery = search
      ? { productname: { $regex: search, $options: "i" } }
      : {};

    const productdata = await createproductdatas
      .find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Fetch the total count of documents
    const totalDocuments = await createproductdatas.countDocuments(searchQuery);

    // Send the response
    res.send({
      totalDocuments,
      totalPages: Math.ceil(totalDocuments / limitNumber),
      currentPage: pageNumber,
      productdata,
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch product", error: error });
  }
});

//create api
mainRoutes.post("/createProducts", async (req, res) => {
  try {
    const newProduct = await createproductdatas.create(req.body);
    if (newProduct) {
      res.status(201).send({
        message: "Product successfully Created",
        createProduct: newProduct,
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Failed to create product", error: error });
  }
});

//edit api
mainRoutes.put("/editProducts/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const productUpdate = await createproductdatas.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (productUpdate) {
      res.status(200).send({
        message: "Product successfully Updated",
        product: productUpdate,
      });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to Updated product", error: error });
  }
});

//delete api
mainRoutes.delete("/deleteProducts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const productDelete = await createproductdatas.findByIdAndDelete(id);
    if (productDelete) {
      console.log("Product Deleted:", productDelete);
      res.status(200).send({
        message: "Product successfully deleted",
        product: productDelete,
      });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error in deleting product:", error);
    res.status(500).send({ message: "Failed to delete product", error: error });
  }
});

//Login
mainRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const loginUser = await user.findOne({ email });
    if (!loginUser) {
      return res.status(404).send({ message: "User not found" });
    }
    // const isMatch = password !== loginUser.password;

    const isMatch = await bcrypt.compare(password, loginUser.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid credentials" });
    }
    res.send({ message: "login sucessfully" });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error });
  }
});

//SignUp
mainRoutes.post("/signUp", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(409).send("User already exists"); // 409 Conflict
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    const newUser = new user({
      email,
      password: hashedPassword,
    });

    // Save user to the database
    const savedUser = await newUser.save();
    console.log("register", savedUser); // Logging the registered user
    res.status(201).send("Register successfully"); // 201 Created
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Server error");
  }
});

//using axios api for third party extension
mainRoutes.get("/posts", async (req, res) => {
  const fetchData = await ApiCall(
    "https://jsonplaceholder.typicode.com/posts",
    "GET",
    {}
  );

  console.log("fetchData", fetchData);
  res.send(fetchData);
  //res.sendStatus(200);
});

//using fetch apis

let data1 = data;
//get api
mainRoutes.get("/products", (req, res) => {
  console.log({ data1 });
  res.json({ data: data1 });
});

//post api
mainRoutes.post("/products", (req, res, next) => {
  // try {
  //   console.log(city);
  // } catch (err) {
  //   next(ErrorHandeler.serverError(err.message));// system default error
  // }
  const { title, body } = req.body;
  if (!title || !body) {
    next(ErrorHandeler.validationError("title and des are required"));
    // throw new Error("All feilds are required");
    // return res.status(400).json({ error: "all feilds are required" });
  }
  const product = { title, body, id: data1.length + 1 };
  data1.push(product);

  console.log("req.body", data1);

  res.json(product);
});

//Delete Api
mainRoutes.delete("/products/:productId", (req, res) => {
  const { productId } = req.params;
  console.log(productId);
  const abc = data1.filter((product) => product.id !== +productId);
  data1 = abc;
  console.log({ abc });
  res.json({ status: "OK" });
});

export default mainRoutes;
