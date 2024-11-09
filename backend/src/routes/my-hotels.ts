import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotels";
import { HotelType } from "../shared/types";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

// Multer will hold incoming images in memory; I'll send them to Cloudinary directly instead of saving them to disk.
const storage = multer.memoryStorage();
//defining the file limits and initialize multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
});

//this is the endpoint that the frontend will make a request to whenever the user submits the add hotel form
router.post(
  "/",
  //making sure that the logged in user only can access this endpoint
  verifyToken,
  [
    //making sure the request form data has all the fields that are required in order to create a new hotel type
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
    //I don't need to add image files in here, coz this gonna be handled by multer
  ],
  //after initializing multer, I'll add the upload variable as a middleware
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      //1.upload the images to cloudinary (using the cloudinary SDK)
      const imageUrls = await uploadImages(imageFiles); //the code details is at the end of the file (CLOUDINARY HANDLING THE IMAGES)

      //2.if upload was successful, add the URLs to the new hotel
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      //3.save the new hotel in the database
      const hotel = new Hotel(newHotel);
      await hotel.save();

      //4.return a 201 status
      res.status(201).send(hotel);
    } catch (e) {
      console.log("Error creating hotel: ", e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

//ADDING A NEW ENDPOINT THAT WILL HANDLE THE GET ALL
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

//GIVING ACCESS TO THE USER TO edit his/her HOTEL DATA
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      //preventing users from editing or viewing hotels that don't belong to them
      userId: req.userId,
    });
    //this will be empty: if there's no hotel or if the query can't find one
    res.json(hotel);
  } catch (error) {
    res.json(500).json({ message: "Error fetching hotels" });
  }
});

//CREATE THE UPDATE HOTEL ENDPOINT
router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      );

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      //this is a new file that the user decided to add whenever they edit the hotel
      const files = req.files as Express.Multer.File[];
      //the uploadImages function: is gonna upload the new images to cloudinary, and it'll return back the URLs as an array of strings which gets assigned to updated image URLs
      const updatedImageUrls = await uploadImages(files);
      //[...updatedImageUrls] is making a copy of (updatedImageUrls) and spreading the elements into this new array; coz I wanna also add the existing image URLs in this array as well
      hotel.imageUrls = [
        ...updatedImageUrls,
        //this is gonna handle the case when the user has decided to delete all the existing images
        //in the case the image URL that they sent back will be either undefined or an empty array
        ...(updatedHotel.imageUrls || []),
      ];

      await hotel.save();
      //added after the api-client.ts
      //making sure the request completes then sends the hotel back as a json object
      res.status(201).json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

//CLOUDINARY HANDLING THE IMAGES
async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    //encoding the image as a base 64 string
    const b64 = Buffer.from(image.buffer).toString("base64");

    //telling cloudinary what type this image is, then attaching that to our base 64 string
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    //upload the image to cloudinary
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });
  //this is gonna wait for all images to be uploaded before getting back a string array that gets assigned to this imageUrls variable
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;
