const express = require('express');
const router = express.Router();
const { createCar, getAllCars, updateCar, deleteCar, getOneCars, getBrandCars } = require('../controllers/carController');
const upload = require('../middlewares/multer');

// Create a car listing with photo
// router.post('/', upload.array(), createCar);
router.post('/', upload.array('images'), createCar);

// router.post('/create', upload.array('images', 5), carController.createCar);

// Get all car listings
router.get('/', getAllCars);

router.get('/:_id', getOneCars);

router.get('/:brand', getBrandCars);




// Update a car listing by ID (with photo update)
router.put('/:id', upload.single('image'), updateCar);

// Delete a car listing by ID
router.delete('/:id', deleteCar);

module.exports = router;
