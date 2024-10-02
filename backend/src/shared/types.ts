//in the shared folder, it's where we put our shared [code]
//and in the types folder, it's where we put our shared [types]
//keeping here all the mongoose stuff together, the response types, and other types


//create a type that represent the user, and it's gonna be a typescript type
export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};


//The reason we moved this type from hotels.ts to here:
//it's shared between the frontend and the backend
//and having it in the models folder can be a bit confusing 
export type HotelType = {
    // index: Key | null | undefined;
    _id: string;
    userId: string;
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    adultCount: number;
    childCount: number;
    facilities: string[];
    pricePerNight: number;
    starRating: number;
    imageUrls: string[];
    lastUpdated: Date;
    //creating a property called bookings and this will be an array of the 
    //BookingType that we've just created
    bookings: BookingType[];
};

//adding type for the booking
export type BookingType = {
    _id : string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number;
    childCount: number;
    checkIn: Date;
    checkOut: Date;
    //the reason we store the totalCost as part of each individual booing is that
    // if the price per night of that hotel changes then we don't want all
    //the bookings that have already been,
    //and it also makes it easier to retrieve these data since it's part of 
    //the document in the database
    totalCost: number;
}

//the types to the response in router/hotels.ts
export type HotelSearchResponse = {
    data: HotelType[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    }
};

//we wanna create a type for the stripe response in routes/hotels
//so that the UI knows what to expect in terms of the properties 
//that it's gonna get back  

export type PaymentIntentResponse = {
    paymentIntentId: string;
    clientSecret: string;
    totalCost: number;
}