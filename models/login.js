import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  email: String,
  password: String,
});

export default mongoose.model("user", loginSchema);
