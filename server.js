// const express = require("express");
import express from "express";
import mainRoutes from "./modules/routes.js";
import cors from "cors";
import ErrorHandeler from "./errors/ErrorHandeling.js";

// const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", mainRoutes);
//gernic error for all page which not exist
app.use((req, res, next) => {
  return res.json({ message: "page not found" });
});
//route error
app.use((err, req, res, next) => {
  if (err instanceof ErrorHandeler) {
    res.status(err.status).json({
      errror: {
        message: err.message,
        status: err.status,
      },
    });
  } else {
    res.status(500).json({
      errror: {
        message: err.message,
        status: err.status,
      },
    });
  }
});

app.listen(PORT, () => {
  console.log(`listing on port ${PORT}`);
});
