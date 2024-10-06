import express, {Request, Response} from "express";
import Hotel from "../models/hotels";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";


//INITIALIZING A NEW STRIPE CONNECTION
const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const router = express.Router();



//when the frontend calls this endpoint it'll be: /api/hotels/search
router.get("/search", async (req: Request, res: Response) => {
    try {
        //so in our search point, when we call construct search query, all
        //those if statement will kick in, and the results will get assigned to
        //the query parameter or to the query variable
        const query = constructSearchQuery(req.query);
        //then pass it to the hotels variable as find(query)


        //coding the sorting logic (too much more work than the search query/filter)
        let sortOptions = {};
        switch (req.query.sortOption) {
            //we're gonna send the sortOption along with the queried parameters
            //weill check which sort option the user selected coz the sort option is gonna 
            //be a single value which is taken from a drop down 
            case "starRating":
                //this will mean: sort all the results from our query where the star rating high to low
                //and yes, it's weird that we're passing -1 for that, but that how it's work
                sortOptions = { starRating: -1 };
                break;
            //Asc for Ascending: low to high
            case "pricePerNightAsc":
                sortOptions = {pricePerNight: 1};
                break;
            //Desc for Descending: high to low
            case "pricePerNightDesc":
                sortOptions = {pricePerNight: -1};
                break;
        }
        //then pass it to the hotels variable as sort(sortOptions)



        //adding pagination coz if we have hundreds of hotels, we don't wanna returning 
        //them on every search hit coz it'll be quite expensive on our server
        //especially if there's hundreds or thousands of people accessing the search endpoint at the same time
        //so here we're gonna define a page size
        const pageSize = 5;

        //whenever the frontend makes a request to the search endpoint, we will give them
        //the option to send a page number
        const pageNumber = parseInt(
          req.query.page ? req.query.page.toString() : "1"
        );

        //we need to define a variable that we pass to our fine query
        //that tells the query how many pages to skip
        //ex: if the frontend is asking for the third page, so:
        // const skip = (3-1) * 5 = 10 // so it's gonna skip the first 10 items that it finds
        //so since each page holds five, the first two pages will hold 10 
        //and since we're asking for the third page, we want to return the results after those 10
        const skip = (pageNumber - 1) * pageSize;

        //this is gonna find all the hotel and assign it to the hotel variable
        //mongoose is gonna go and find all the hotels that matches our filter and search query
        //then is gonna sort those results based on the sort options
        //.skip(skip).limit(pageSize): then is gonna add the pagination stuff at the very end
        const hotels = await Hotel
        // the order of these is important
          .find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(pageSize);

        //whenever you create an API that has pagination, it's a good idea to pass
        //the pagination data back to the frontend to help it determine how many
        //pages it can display and total numbers, ...etc.
        const total = await Hotel.countDocuments();

        //the types to this response is gonna be in the shared folder, types.ts
        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total/ pageSize),
            },
        };
        res.json(response);

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});


//THE LAST ROUTER ADDED TO THIS PROJECT
//This homepage is gonna be a public endpoint so we're not gonna need to do the Token Verification stuff
router.get("/", async (req: Request, res: Response) => {
    try {
        //every time a hotel gets added or edited then the hotel type id gonna
        //to store the last updated value as a date against that record 
        //so it means we can get the most up-to-date ones first and then get the rest as well
        const hotels = await Hotel.find().sort("-lastUpdated");
        res.json(hotels);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Error fetching hotels" });
    }
});



//we need a way to get an individual hotel when the user navigates to
//the details page, we're going to store the id in the url, and we will use this id
//to fetch the given hotel from our API
//any request that go to /api/hotels/12345645654(the id), it's gonna get handled by this handler
//this root has to be after /search root, otherwise it'll give you an error 
router.get("/:id",[param("id").notEmpty().withMessage("Hotel ID is required")], async (req: Request, res: Response) => {
    //check for any errors
    const errors = validationResult(req);

    //check the errors that appears (if there're any errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }

    const id = req.params.id.toString();

    //adding a try catch block because we're gonna do some database stuff in here
    try {
        const  hotel = await Hotel.findById(id);
        //if the hotel is empty then this will pass back an empty object,
        //so the frontend can deal with it as it likes
        res.json(hotel);
    } catch (error) {
        console.log(error); //helping with debugging
        res.status(500).json({ message: "Error fetching hotel"});
    }
});


//CREATING STRIPE ENDPOINT
router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    //to create a payment intent there's three things that we need here:
    //1. we need to know The Total Cost of this booking
    //2. we need to know The Hotel ID so we can tie our payment intent to a hotelId
    //3. we need to know The User ID of the user who's trying to create this booking so we can also tie it to the payment intent
    
    //1. TOTAL COST
    //to get the total cost, we need to know the total number of nights that the user is trying to book for
    //and then we will get the price per night from the hotel in the database
    const { numberOfNights } = req.body;

    //2.HOTEL ID
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findById(hotelId);
    if(!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
    }

    //3. PRICE PER NIGHT
    //the reason we calculate the cost on the backend is that it gives us the most up-t-date price
    const totalCost = hotel.pricePerNight * numberOfNights;

    //creating the payment intent/invoice
    const paymentIntent = await stripe.paymentIntents.create({
        //hover over amount and you will see why we multiply by 100
        amount: totalCost * 100,
        currency: "usd",
        //the metadata object is a thing that stripe gives us that lets us store whatever we want gainst this payment intent
        //part of the reason we store this is for analytics and things like that
        //it also helps us check if a booking has been paid for successfully before we save it to the database
        metadata: {
            hotelId,
            userId: req.userId,
        }
    })
    //the payment intent will have a client secret init.
    //The Client Secret: th thing that we need to return back to the frontend 
    //so that the user can create a card payment against this payment intent 
    //to pay for the invoice essentially

    //since the client secret is important, we wanna check first it exists
    if(!paymentIntent.client_secret) {
        //500 coz it indicates something's gone wrong with stripe 
        //and there isn't too much the user can do on their end to fix it.
        return res.status(500).json({ message: "Error creating payment intent" });
    }

    //we wanna define the things that we want back to the frontend  
    const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.toString(),
        totalCost,
    };
    //we wanna create a type for this response in the shared folder
    //so that the UI knows what to expect in terms of the properties 
    //that it's gonna get back  
    

    res.send(response);
  }
);

//ENDPOINT FOR CREATING A HOTEL BOOKING
router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
        //check if the stripe payment was successful, and the booking has been paid for
        //to do that we're gonna use the payment intent id that will get sent 
        //to us by the frontend 


        //AFTER WE: 
        //1. created the payment intent on stripe, and
        //2. sent the totalCost/clientSecret back to the frontend
        //SO: the frontend has to send this back to us again
        const paymentIntentId = req.body.paymentIntentId;
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId as string
        );

        if(!paymentIntent) {
            return res.status(400).json({ message: "payment intent not found"});
        }

        //after we've got a payment intent, we wanna check that 
        //the hotelId and the userId that we stored in the payment intent whenever 
        //we get it created that they match the hotelId and the userId that we get 
        //in the request from the backend
        if (
          paymentIntent.metadata.hotelId !== req.params.hotelId ||
          paymentIntent.metadata.userId !== req.userId
        ) {
            //we have to make sure that the payment intent of the invoice matches up
            //the details that was passed to us by the loggedIn user 
            //and the hotelId and if these things don't match, then we will return:
            return res.status(400).json({ message: "payment intent mismatch" }); //we will keep the message kinda of generic so we won't reveal too much information
        }

        //we wanna check the payment status of the payment intent 
        if (paymentIntent.status !== "succeeded") {
            return res
                .status(400)
                .json({message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
                })
        }
        //Adding all those if statement is a good practice coz it helps us 
        //catch any edge cases and places where things can go wrong
        

        //now we assume the payment intent was successful
        //Now, let's create the booking
        const newBooking: BookingType = {
            ...req.body,
            userId: req.userId,
        }

        //after having the booking, we need to get the hotel and update it
        //this is gonna find the hotel based on the hotelId that we got in the request
        //and then it's gonna push the booking object that we just created up
        //into the booking array of that hotel
        const hotel = await Hotel.findOneAndUpdate(
            {_id: req.params.hotelId},
            {$push: {bookings: newBooking}}
        );

        if (!hotel) {
            return res.status(400).json({ message: "hotel not found" });
        }

        await hotel.save();
        res.status(200).send();

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
  }
);

//WORKING ON THE FILTER SECTION 
//adding the filters to construct search query function
const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    if (queryParams.destination) {
        constructedQuery.$or = [
            {city: new RegExp(queryParams.destination, "i")},
            {country: new RegExp(queryParams.destination, "i")},
        ];
    }

    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    }

    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
    }

    //if we receive a facilites query param, 
    //then we wanna add this to our constructed query
    if (queryParams.facilities){
        //this code is gonna find all the hotels that have all of the facilites 
        //that were received in the query params because the user can select
        //more than one depending on if they select one or if they send more than one 
        //then we're gonna receive the facilities as either a string or an array of strings
        constructedQuery.facilities = {
          // $all a mongoose filter
          //to say that we wanna get all
          $all: Array.isArray(queryParams.facilities)
            ? queryParams.facilities
            : [queryParams.facilities],
        };
    }

    //for hotel types
    if (queryParams.types) {

        //we're gonna use $in : this is because a hotel can only have one type
        //but the user can select many types in the filter, so we might receive more than one type
        //what this in is gonna do is saying return any hotels that have any of the types 
        //in their type property
        constructedQuery.type = {
          $in: Array.isArray(queryParams.types)
            ? queryParams.types
            : [queryParams.types],
        };
    }

    //handle star ratings
    if (queryParams.stars) {
        //we're checking if the stars that we get as part of the query params is an array
        const starRatings = Array.isArray(queryParams.stars) 
            //if it's an array then we need to convert the array of strings to the array of numbers
            ? queryParams.stars.map((star: string) => parseInt(star))
            //if we haven't got an array of stars and we just have a single star, so we still need to convert this to an integer
            : parseInt(queryParams.stars);
        
        //then we can pass this to our constructed query
        constructedQuery.starRating = { $in: starRatings }
    }

    //handle price per night 
    if (queryParams.maxPrice) {
        //this is going to get all the hotels where the max price or price per night 
        //is less than or equal to the max price we received in the query params 
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        };
    }

    //adding this to constructed query in the /api/hotels/search API
    //so in our search point, when we call construct search query, all
    //those if statement will kick in, and the results will get assigned to
    //the query parameter or to the query variable


    return constructedQuery;

};

export default router;


