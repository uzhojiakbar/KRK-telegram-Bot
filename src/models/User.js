const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  chatId: { type: Number, required: true, unique: true },
  district: { type: String, required: true },
  school: { type: String, required: true },
  subject: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
