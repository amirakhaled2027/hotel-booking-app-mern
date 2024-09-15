import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";  // the path package is part of node (used for rendering )
import { v2 as cloudinary } from 'cloudinary'
import myHotelRoutes from './routes/my-hotels'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,  
})

//CONNECT TO THE DATABASE
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => // remove it at the end of the project, coz you don't want your console to be exposed when rendering
    console.log("Connected to MongoDB")
  )
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(cookieParser()); // we need to tell use cookie parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


//RENDERING THE PROJECT
//This will post our frontend static assets for us
//what this is doing is it's saying: go to the frontend dist folder which has our compiled frontend static assets
//and serve those static assets on the root of our URL that the backend runs on
//just like Express can serve an pi request, we can also serve static assets 
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes)

//making sure that all the requests that aren't API requests go to 
//our index.html file that lives in the frontend dist folder  

//this means to pass on any requests to our url that aren't api endpoints 
//and to let the react-router-dom package handle the routing of this request for us

//The reason we have to this: is that some of our roots are behind conditional logic 
//and won't be part of the static files (app.use(...)) coz they're generated at request time
//so because our /add-hotel route is behind conditional logic and is a protected root,
//it doesn't exist in the static files that we deploy at deploy time
//so the code gets a bit confused and thinks an it's api route
//so we have to specify explicitly for all requests that aren't api routes go to the index.html of the frontend 
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
})

app.listen(3000, () => {
  console.log("server running on localhost:3000!");
});
