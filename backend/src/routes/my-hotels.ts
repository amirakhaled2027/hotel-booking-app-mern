import express, {Request, Response} from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import Hotel from '../models/hotels';
import { HotelType } from '../shared/types'
import verifyToken from '../middleware/auth';
import { body } from 'express-validator';

const router = express.Router();


//what this line do is that it tells multer that we want to store any images that we get 
//from the push request in memory because we're not saving these files directly ourselves,
//but we're gonna upload them directly straight to cloudinary as soon as we get them 
const storage = multer.memoryStorage();
//define the file limits and initialize multer 
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 //5MB
    }
})

//creating the endpoint 
//we have to define the endpoint url "/"
//the reason: is because we will come to register the set of routes with our 
// express server after that so when we do this, the endpoint will be "api/my-hotels"
// and whenever we do a post request to this endpoint, it's gonna take us to 
//this function router.post("/")  since we defined it as the root

//this is the endpoint that the frontend will make a request to whenever the user submits the add hotel form
// since we are working with a form with images (instead of just JSON), we typically send the data as a multi-part form object
// the multer package will help us handle the images that we receive in the request
//it will take the binary image fields from the form data in the request we get 
// and it will give us all that stuff as an object so that we can handle it a bit easier
router.post(
    "/", 
    //we wanna make sure that the logged in user only can access this endpoint
    verifyToken, [
    //we wanna make sure the request form data has all the fields that we require in order to create a new hotel type
        body("name").notEmpty().withMessage('Name is required'),
        body("city").notEmpty().withMessage('City is required'),
        body("country").notEmpty().withMessage('Country is required'),
        body("description").notEmpty().withMessage('Description is required'),
        body("type").notEmpty().withMessage('Hotel type is required'),
        body("pricePerNight").notEmpty().isNumeric().withMessage('Price per night is required and must be a number'),
        body("facilities").notEmpty().isArray().withMessage('Facilities are required'),
        //you don't need to add image files in here, coz this gonna be handled by multer
    ],
    // after initializing multer, we'll add the upload variable as a middleware
    upload.array("imageFiles", 6), //our frontend form will have an image files array that will have up tp six images in it
    async(req: Request, res: Response) => {
         try {
            const imageFiles = req.files as Express.Multer.File[];
            const newHotel: HotelType = req.body;

            //1. upload the images to cloudinary (using the cloudinary SDK)
            const uploadPromises = imageFiles.map(async(image) => {
                //encoding the image as a base 64 string 
                const b64 = Buffer.from(image.buffer).toString("base64")  //creating a buffer from the image object that we're currently on in the map function, and once we have a buffer we can convert it to base 64 string by .toString("base64")  
                // we need to tell the cloudinary what type this image is/ then we have to attach that to our base 64 string
                let dataURI = "data:" + image.mimetype + ";base64," + b64;
                //upload the image to cloudinary 
                const res = await cloudinary.v2.uploader.upload(dataURI);
                //what we want from the previous res is to get the url of the hosted image that we just uploaded to cloudinary
                return res.url;
            });
            //this is gonna wait for all images to be uploaded before we get back a sting array that gets assigned to this imageUrls variable 
            const imageUrls = await Promise.all(uploadPromises);
            //2. if upload was successful, add the URLs to the new hotel
            newHotel.imageUrls = imageUrls;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;

            //3. save the new hotel in our database
            const hotel = new Hotel(newHotel);
            await hotel.save();

            //4. return a 201 status
            res.status(201).send(hotel);
         } catch (e) {
            console.log("Error creating hotel: ", e);
            //return a generic error message back to the frontend
            res.status(500).json({ message: "Something went wrong" });
            
         }
});

//ADDING A NEW ENDPOINT THAT WILL HANDLE THE GET ALL 
router.get("/", verifyToken, async(req: Request, res: Response) => {
    
    try {
        const hotels = await Hotel.find({userId: req.userId});
        res.json(hotels);      
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels"})
    }
})

export default router;



