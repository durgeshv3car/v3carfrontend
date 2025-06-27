const mongoose = require('mongoose');
const multer = require('multer');
const Brand = require('../model/Brand');

// Create new car listingname
exports.createBrand = async (req, res) => {
  try {
    const { name, country, foundedYear } = req.body;
     console.log( req.body)


     let admin = await Brand.findOne({ name });
    if (admin) {
      return res.status(400).json({ msg: 'Brand already exists' });
    }

    // let brandsss = await Brand.findOne({ name: brandName });
    
    // // Step 2: If brand doesn't exist, create it
    // if (!brandsss) {
    //   BrandDate = new Brand({ name: brandName });
    //   await brands.save();
    // }


    const car = new Brand({
      name,
      country,
      foundedYear,
    });

    await car.save();
    res.status(201).json(car);
  } catch (error) {

    res.status(500).json({ error: error.message, message: "helo" });

    // if (error instanceof multer.MulterError) {
    //   // A Multer error occurred during upload
    //   res.status(400).json({ error: `Multer error: ${error.message}` });
    // } else {
    //   // A general error occurred
    //   res.status(500).json({ error: error.message });
    // }
  }
};

// Get all car listings
exports.getAllBrand = async (req, res) => {
  try {


    const brandd = await Brand.find();
    
    if (brandd.length === 0) {
      // No data found in the Brand collection
      return res.status(404).json({ message: 'No data found' });
    }

    res.status(200).json(brandd);


  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getBrandOne = async (req, res) => {
  try {
    const modelnam = req.params;
    const brandd = await Brand.findOne(modelnam);
    console.log(modelnam)


    // const carss = cars.map(car => {
      
    //   return {
    //     ...car.toObject(), // Convert the Mongoose document to a plain JavaScript object
    //     brand: car.brand.name // Replace brand object with brand name
    //   };
    // });

    

    res.status(200).json(brandd);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Update car listing by ID
exports.updateBrand = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    const { brand, model, year, price } = req.body;
    car.brand = brand || car.brand;
    car.model = model || car.model;
    car.year = year || car.year;
    car.price = price || car.price;

    // If a new image is uploaded
    if (req.file) {
      car.image = req.file.path;
    }

    await car.save();
    res.status(200).json(car);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.deleteBrand = async (req, res) => {
    try {
      const carId = req.params.id;
  
  
      const car = await Car.findById(carId);
      
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }
  
      await car.deleteOne(); 
      res.status(200).json({ msg: 'Car deleted' });
      
    } catch (err) {
      console.error('Error deleting car:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  };
