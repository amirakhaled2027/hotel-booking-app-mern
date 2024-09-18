// the reason we're putting the login endpoint and the auth route not as part of the user route
// is the we aren't interacting directly wit the user entity like we did with the register functionality 
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 8600000,
      });
      res.status(200).json({ userId: user._id })
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
);

//since our frontend react code can't actually access the cookie (coz it's extremely secure) to get a hold of all of the token
//then how are we supposed if the user is logged in or not in our code?
//A: Since the server is able to read the cookie, we can make a request from our frontend
//to a new end point called validate token and this endpoint will return whether the token is valid or not
//and based on that what we can do whatever we want on our frontend
//this is gonna be a get request, we're not creating anything, we're just getting some information 
//what this endpoint will do is whenever we make a request to validate token endpoint, it's gonna run some middleware which will check the HTTP cookie that was sent to us by the frontend in the request 
//depending on if that check passes or not.
//is it does pass the middleware, we'll forward the request onto this function and then and then we're saying:
//OK, the token was valid so i'm gonna send back a 200 response to say everything is ok
//and i'm also gonna pass in the user ID which we get from the token and it was added from the request 
router.get('/validate-token', verifyToken, (req: Request, res: Response) => {
  res.status(200).send({userId: req.userId})
  //nest we'll add the verified token middleware to our backend by creating a new folder called middleware 
})

//handling the sign out functionality

router.post('/logout', (req: Request, res: Response) => {
  res.cookie('auth_token', '', {
    //this line create an empty off token, and also says this token has expired at the time of creation 
    //so this means that the token is completely invalid and it can't be used again from this point on after the log out function has been called
    expires: new Date(0)
  });
  //for sending a response back to be successful in the network console 
  res.status(200).send({ message: "Logged out successfully" });
  // res.send();
})



export default router

