// controllers/segmentController.js
const Segment = require("../models/segment");
const Customer = require("../models/customer");

const applyRules = (customer, rules) => {
  return rules.every((rule) => {
    const { field, operator, value } = rule;
    const fieldValue = customer[field];

    switch (operator) {
      case "equals":
        return fieldValue == value;
      case "not_equals":
        return fieldValue != value;
      case "greater_than":
        return fieldValue > value;
      case "less_than":
        return fieldValue < value;
      case "includes":
        return typeof fieldValue === "string" && fieldValue.includes(value);
      default:
        return false;
    }
  });
};

// Preview matching customers
exports.previewSegment = async (req, res) => {
  try {
    const rules = req.body.rules;
    if (!Array.isArray(rules)) {
      return res.status(400).json({ message: "Rules must be an array" });
    }

    const customers = await Customer.find();
    const filtered = customers.filter((customer) =>
      applyRules(customer, rules)
    );

    res.status(200).json(filtered);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error previewing segment", error: error.message });
  }
};

// Save segment to DB
exports.saveSegment = async (req, res) => {
  try {
    const { name, description, rules } = req.body;
    if (!name || !Array.isArray(rules)) {
      return res.status(400).json({ message: "Name and rules are required" });
    }

    const existing = await Segment.findOne({ name });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Segment with this name already exists" });
    }

    const newSegment = new Segment({ name, description, rules });
    await newSegment.save();
    res
      .status(201)
      .json({ message: "Segment saved successfully", segment: newSegment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving segment", error: error.message });
  }
};

// Get all saved segments
exports.getSegments = async (req, res) => {
  try {
    const segments = await Segment.find().sort({ createdAt: -1 });
    res.status(200).json(segments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching segments", error: error.message });
  }
};

// Get matching customers for a saved segment
exports.getSegmentCustomers = async (req, res) => {
  const segmentId = req.params.id;

  try {
    const customers = await Customer.find({ segmentId: segmentId }); // filter by segment
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};
