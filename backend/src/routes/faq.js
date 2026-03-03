const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faq.controller");
const authMiddleware = require('../middlewares/auth.middleware');

// Admin Routes
router.post("/admin", authMiddleware(['admin']), faqController.create);
router.get("/admin", authMiddleware(['admin']), faqController.getAll);
router.put("/admin/:id", authMiddleware(['admin']), faqController.update);
router.delete("/admin/:id", authMiddleware(['admin']), faqController.delete);

// Public Route
router.get("/public", faqController.getPublic);

module.exports = router;