const mongoose = require('mongoose');
const Car = require('../model/Car');
const multer = require('multer');
const Brand = require('../model/Brand');
const BrandModel = require('../model/Model');
const Variant = require('../model/variant');
const Powertrain = require('../model/Powertrain');


// Create a new car (brand, model, variant, and powertrain)
exports.createCar = async (req, res) => {
  try {
    const {
      brandName,
      country,
      foundedYear,
      modelName,
      modelBodyType,
      launchDate,
      brochure,
      urlSlug,
      description,
      year,
      price,
      images,
      length,
      width,
      height,
      wheelbase,
      bootspace,
      fuelTank,
    } = req.body;

    // 1. Add or find the brand
    let brand = await Brand.findOne({ name: brandName });
    if (!brand) {
      brand = new Brand({ name: brandName, country, foundedYear });
      await brand.save();
    }

    // 2. Add the brand model
    const brandModel = new BrandModel({
      brand: brand._id,
      model_name: modelName,
      model_body_type: modelBodyType,
      launch_date: launchDate,
      upload_brochure: brochure,
      url_slug: urlSlug,
      description,
    });
    await brandModel.save();

    // 3. Add the variant
    const variant = new Variant({
      brand: brand._id,
      model: brandModel._id,
      year,
      price,
      images,
    });
    await variant.save();

    // 4. Add the powertrain
    const powertrain = new Powertrain({
      variant: variant._id,
      length,
      width,
      height,
      wheelbase,
      bootspace,
      fuel_tank: fuelTank,
    });
    await powertrain.save();

    res.status(201).json({
      message: 'Car data successfully added!',
      data: { brand, brandModel, variant, powertrain },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.createCar = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Extract car, powertrain, and variant data from the request body
//     const { carData, powertrainData, variantsData } = req.body;

//     // Create and save the car
//     const car = new Car({
//       brand: carData.brand,
//       brandmodal: carData.brandmodal,
//       model: carData.model,
//       year: carData.year,
//       price: carData.price,
//       images: carData.images,
//     });
//     await car.save({ session });

//     // Create and save the powertrain
//     const powertrain = new Powertrain({
//       car: car._id,
//       length: powertrainData.length,
//       width: powertrainData.width,
//       height: powertrainData.height,
//       wheelbase: powertrainData.wheelbase,
//       fueltank: powertrainData.fueltank,
//     });
//     await powertrain.save({ session });

//     // Add car ID to each variant and save them
//     const variants = variantsData.map((variant) => ({
//       ...variant,
//       car: car._id,
//     }));
//     const savedVariants = await Variant.insertMany(variants, { session });

//     // Update car with references to variants and powertrain
//     car.variants = savedVariants.map((variant) => variant._id);
//     car.powertrain = powertrain._id;
//     await car.save({ session });

//     // Commit the transaction
//     await session.commitTransaction();

//     res.status(201).json({
//       success: true,
//       message: 'Car with details created successfully!',
//       data: {
//         car,
//         powertrain,
//         variants: savedVariants,
//       },
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error('Error creating car with details:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create car with details',
//       error: error.message,
//     });
//   } finally {
//     session.endSession();
//   }
// };




// Get all car listings
exports.getAllCars = async (req, res) => {
  try {
    // Use .populate('brand') to get full brand details
    const cars = await Car.find()
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};








exports.getOneCars = async (req, res) => {
  try {
    const modelnam = req.params;
    const cars = await Car.findOne(modelnam);


    const carss = cars.map(car => {
      
      return {
        ...car.toObject(), // Convert the Mongoose document to a plain JavaScript object
        brand: car.brand.name // Replace brand object with brand name
      };
    });

    

    res.status(200).json(carss);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};




exports.getBrandCars = async (req, res) => {
  try {
    const { brand } = req.params; // Brand ID from request parameters

    console.log(brand)

    // Query to filter cars by brand and populate brand details
    const filteredCars = await Car.find({ brand: brand })
      .populate('brand', 'namess') // Populate brand details from the referenced Brand collection
      .sort({ year: -1 }) // Sort by year in descending order (newest cars first)
      .exec();

    res.status(200).json(filteredCars); // Respond with the filtered and populated car list
  } catch (err) {
    res.status(500).json({ error: 'Server error', error:err.error });
  }
};



// Update car listing by ID
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    const { brand, model, year, price, upcoming, Popular, latest, electric } = req.body;
    car.brand = brand || car.brand;
    car.model = model || car.model;
    car.year = year || car.year;
    car.upcoming = upcoming || car.upcoming;
    car.Popular = Popular || car.Popular;
    car.latest = latest || car.latest;
    car.electric = electric || car.electric;

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


exports.deleteCar = async (req, res) => {
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







// /***************Create ************* */


//   exports.model = async (req, res) => {
//   try {
//     const { brand, model, year, price, upcoming, Popular, latest, electric } = req.body;

//     const existingCar = await Car.findOne({ brand, model, year });
//     if (existingCar) {
//       return res.status(400).json({ error: "Car listing already exists." });
//     }


//     // let brandsss = await Brand.findOne({ name: brandName });
    
//     // // Step 2: If brand doesn't exist, create it
//     // if (!brandsss) {
//     //   brand = new Brand({ name: brand });
//     //   await brand.save();
//     // }

//     const images = req.files.map(file => file.path);

//     const car = new Car({
//       brand,
//       model,
//       year,
//       price,
//       upcoming, 
//       Popular, 
//       latest, 
//       electric,
//       images
//     });

//     await car.save();
//     res.status(201).json(car);
//   } catch (error) {
//     if (error instanceof multer.MulterError) {
//       // A Multer error occurred during upload
//       res.status(400).json({ error: `Multer error: ${error.message}` });
//     } else {
//       // A general error occurred
//       res.status(500).json({ error: error.message });
//     }
//   }
// };