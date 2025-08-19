const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  handleGet,
  handlePost,
  handlePut,
  handleDelete,
} = require("../controllers/productControllers");

router.post("/get-product", protect, handleGet);
router.post("/post-product", protect, handlePost);
router.put("/put-product", protect, handlePut);
router.delete("/delete-product", protect, handleDelete);

module.exports = router;
