import express, { Request, Response } from "express";
import User from "../models/user";
const router = express.Router();
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

//CREATING A NEW ENDPOINT THAT LETS ME FETCH THE CURRENT LOGGED IN USER
router.get("/me", verifyToken, async (req: Request, res: Response) => {
  //the verifyToken function is gonna parse the HTTP cookie
  //that gets send to me from the browser that has the loggedIn users info init
  //and then it attached it onto the request and it get forwarded onto the function here
  const userId = req.userId;

  try {
    //this is gonna get the user and it won't include the password field
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.send(400).json({ message: "User not found" });
    }
    //in case there's a user
    res.json(user);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    //get any errors that Express validator has picked
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res.status(400).json({ message: "User already exist" });
      }

      //if the user doesn't exist
      user = new User(req.body);
      //saving the user I created
      await user.save();

      //creating a JWT for authentication, including the user ID and setting a 1-day expiration.
      const token = jwt.sign(
        { userId: user.id }, //this user id  is always stored in the http cookie token that gets send back and forward
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 8640000,
      });

      return res.status(200).send({ message: "User register OK!" });

    } catch (error) {
      res.status(500).send({ message: "Something went wrong!" });
      //console logging the error, so the frontend developer will be able to see it
      console.log(error);
    }
  }
);

export default router;
