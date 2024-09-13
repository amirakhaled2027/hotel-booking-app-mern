import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";  // the path package is part of node (used for rendering )

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

app.listen(3000, () => {
  console.log("server running on localhost:3000!");
});
