// models/Segment.js
const mongoose = require("mongoose");

const segmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  rules: [
    {
      field: { type: String, required: true },
      operator: { type: String, required: true },
      value: { type: mongoose.Schema.Types.Mixed, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Segment", segmentSchema);
