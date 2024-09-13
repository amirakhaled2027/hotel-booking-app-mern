import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
//create a type that represent the user, and it's gonna be a typescript type
export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

//Now we have a type that represents a user, we have to create our user schema 
//so this schema is going to determine what properties gets stores against the user ins a given document
//then we need to pass an object for this schema inside the ({})
const userSchema = new mongoose.Schema({
    //the fields in here is gonna be very similar to the fields in our type, but we're gonna structure it in a different way
    //we don't need to add the id coz the schema is gonna add it for us in mongodb
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
});

//add functions that hook into the process of saving to a document 
//this is essential is a middleware for mongodb
//we will pass in a sting that indicates the action that we want to look into
//then we will pass an async function that will take a next parameter as an argument

//you're basically telling mongo is any updates to the document get saved, 
// check if the password has changed, then wen want to bcrypt to hash it, and then we just call the next function
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 8);
    }
    next();
  });

const User = mongoose.model<UserType>('User', userSchema);

export default User;


//QUESTION?
//How come we needed to create a type at the top as well as a schema when the properties are all the same?
//ANSWER:
// the first type means whenever we create a new user in the user schema, it will make it easier to add these properties
// coz thr intellisense will help us, so on the frontend when we come to this point, 
//we will import the user type and it will help us make sure that we have all the correct fields
// so anytime the user types change, typescript will give us an error to say that we're missing properties or we have incorrect properties




