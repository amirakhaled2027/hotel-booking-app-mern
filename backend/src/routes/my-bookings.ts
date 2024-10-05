//we're going to take the same approach with this endpoint as wee did with
//my-hotel.ts endpoints that are related specifically to a user's booking 
//will go in this file

import express, {Request, Response} from 'express';
import verifyToken from '../middleware/auth';
import Hotel from '../models/hotels';
import { HotelType } from '../shared/types';

const router = express.Router();
router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        //this is gonna search all of the hotel documents that we have 
        const hotels = await Hotel.find({
            //and it's gonna check the bookings array 
            //and it's gonna return all the hotels that have a userId 
            //as part of a booking object in the bookings array
            bookings: { $elemMatch: { userId: req.userId }},
        });
            //it's gonna return all the bookings for that hotel
            //so even though its' found a booking with our userId in it,
            //it's gonna return the hotel and the entire bookings array
            //so that means we're gonna get all the bookings for that hotel 
            //which isn't what we want, so we've to change the data a bit by
            //filtering out all the bookings for the different users who have 
            //also booked this hotel
            const results = hotels.map((hotel) => {
                //only get the booking object from the bookings array
                //when the userId is equal to our userId in the request 
                const userBookings = hotel.bookings.filter(
                    (booking) => booking.userId === req.userId
                );
                //once we've got the user bookings for this hotel, we have to 
                //update the bookings array with the new array: userBookings
                const hotelWithUserBookings: HotelType = {
                    //this is gonna convert the add the mongoose hotel to plain js object
                    ...hotel.toObject(),
                    //then we're gonna update this object with the new bookings
                    bookings: userBookings,
                };

                return hotelWithUserBookings;
            });
            res.status(200).send(results);


    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Unable to fetch bookings!"});
    }
});

export default router;
