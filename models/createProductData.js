import mongoose from "mongoose";

const createProductDataSchema = new mongoose.Schema(
  {
    productname: String,
    count: Number,
  },
  { timestamps: true }
);

export default mongoose.model("createproductdatas", createProductDataSchema);
