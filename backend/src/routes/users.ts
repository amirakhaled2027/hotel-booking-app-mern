//creating the routes folder to organize roots ending on the entity that we are performing an action on 
//what i mean by that is if we're going to create a new user model, ti will have a user routes, 
// and when we come to create hotels, we'll have a hotel route and a hotel model
// so taking this approach means that it keeps our code organized on the backend
// and it gives us a structure to look to

import express, { Request, Response } from 'express'
import User from '../models/user';
const router = express.Router();
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import verifyToken from '../middleware/auth';

//CREATING A NEW ENDPOINT THAT LETS US FETCH THE CURRENT LOGGED IN USER
//the reason we use an endpoint called "/me", so the frontend doesn't need to 
//know the id of the current loggedIn user
//and he doesn't need to know coz it's in the HTTP cookie anyway
//so it's best to take the useID from the cookie which is more secure
//and makes it easier for any of our frontend clients that are using our APIs
router.get("/me", verifyToken, async(req: Request, res: Response) => {
    //the verifyToken function is gonna parse the HTTP cookie
    //that gets send to us from the browser that has the loggedIn users info init
    //and then it attached it onto the request and it get forwarded onto our function here
    const userId = req.userId;

    try {
        //this is gonna get the user and it won't include the password field 
        //in the response coz we don't need that would be a bit of a security risk
        //to display this on the frontend
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.send(400).json({ message: "User not found" });
        }
        //and if we do have a user:
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
})


//what is after: '/register'?
//we're adding some middleware to our endpoint handler
//the middle are is gonna check that the first name properly exists in the body of the request 
//and if it doesn't it's gonna return an error and it's also going to check if the first name is of type string
router.post('/register', [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({ min:6 })
] ,async (req: Request, res: Response) => {
    //get any errors that Express validator has picked
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    //we need to put our logic inside the catch block and if there's something wrong the catch block will handle it
    try {
        let user = await User.findOne({
            email: req.body.email,
        })

        if (user) {
            return res.status(400).json({ message: 'User already exist'})
        }

        //and if the user doesn't exist
        user = new User(req.body);
        //saving the user we created
        await user.save();


        //whenever sign the jwt, we use the jwt, we use the secret key
        const token = jwt.sign(
            {userId: user.id}, //this user id  is always stored in the http cookie token that gets send back and forward
            process.env.JWT_SECRET_KEY as string,
            {expiresIn: '1d'}
        );
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 8640000,
        });
        // return res.sendStatus(200); 
         //express is automatically adding the text 'ok' to the body of the response, and this is gonna cause an error in thr console  
         // what should do is to override that with our own object which has a message to it so then our code won't fall over
         return res.status(200).send({ message: "User register OK!"});

    } catch (error) {
        // the reason we wanna display unclear message is that the database could have sensitive information
        //like keys or tokens, addresses so we don't want to return these sensitive information to the frontend
        // as it can be quite useful for hackers to hack the servers so we'll just keep it generic
        res.status(500).send({ message : "Something went wrong!"});
        //we will console log the error, so only the developer will be able to see it
        console.log(error);
    }
});

export default router;


