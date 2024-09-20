//in the shared folder, it's where we put our shared [code]
//and in the types folder, it's where we put our shared [types]


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
};