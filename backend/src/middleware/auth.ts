//anything auth related that we a need a middleware for, we will go in here

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

//we need to create the function that we defined in auth.ts routes folder 
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    //probably cookies doesn't exist on type request; that's because we need to install the cookie parser package 
    const token = req.cookies["auth_token"];

    if(!token) {
        //if the token is empty, undefined, pr whatever, return early from the middleware and return unauthorized message
        return res.status(401). json({ message: "unauthorized" });
        }
        
        //if we have a token, the next thing we wanna do is to verify the token is good
        //by using the jwt secret key we defined in our environments file 
        try {
            //this line is a proof that this token was actually created by us and not created by someone else
            //and it does this by decoding the coding with the secret key that was used to create the token in the first place 
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
            req.userId = (decoded as JwtPayload).useId;
            next();
        } catch (error) {
            return res.status(401). json({ message: "unauthorized" });
        }


}

export default verifyToken;