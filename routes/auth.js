const express = require('express');
const { registerAdmin, loginAdmin } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const Admin = require('../model/Admin');
const router = express.Router();

// Register route
router.post('/register', registerAdmin);

// Login route
router.post('/login', loginAdmin);





module.exports = router;
