// routes/segmentRoutes.js
const express = require("express");
const router = express.Router();
const segmentController = require("../controller/segmentController");

// POST /api/segments/preview - Preview matching customers
router.post("/preview", segmentController.previewSegment);

// POST /api/segments/save - Save a segment
router.post("/save", segmentController.saveSegment);

// GET /api/segments - Get all saved segments
router.get("/", segmentController.getSegments);

// GET /api/segments/:id/customers - Get matching customers from saved segment
router.get("/:id/customers", segmentController.getSegmentCustomers);

module.exports = router;
