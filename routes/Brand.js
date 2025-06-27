const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const { createBrand, getAllBrand, getBrandOne, deleteBrand, updateBrand } = require('../controllers/BrandController');

// Create a car listing with photo
// router.post('/', upload.array('images', 1), createBrand);
router.post('/', createBrand);

// router.post('/create', upload.array('images', 5), carController.createCar);

// Get all car listings
router.get('/', getAllBrand);

router.get('/:name', getBrandOne);

// Update a car listing by ID (with photo update)
router.put('/:id', upload.array('images', 1), updateBrand);

// Delete a car listing by ID
router.delete('/:id', deleteBrand);

module.exports = router;
