import * as dotenv from "dotenv";
import express, { Application } from "express";
import mongoose from "mongoose";

import authRouter from "./router/auth-router";

import os from "os";

const app: Application = express();
dotenv.config();

// MIDDLEWARE
// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log("first middleware");
//   next();
// });
// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log("second middleware");
//   next();
// });
const PORT = process.env.PORT;
async function databaseInit() {
  // connect to DB
  mongoose
    .connect(process.env.DB_CONNECTION!)
    .then(() => {
      console.log("mongoose DB connected");
      // Start the Server
      app.listen(PORT);
      console.log("Server started on port 8000");

      // Setup Express
      app.use(express.json());
      console.log("Express setup, ready!");

      // Setup routers
      app.get("/", (req, res) => {
        console.log("JWT Demo!");
        res.status(200).json({ message: "JWT Demo!" });
      });
      app.use("/auth", authRouter);
      console.log("Router setup, ready!");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
}

databaseInit();
console.log(os.cpus().length);

// GET localhost:8000/todo/todos
