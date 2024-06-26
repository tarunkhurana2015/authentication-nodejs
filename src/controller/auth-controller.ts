import { Request, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export const signupController = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const errorMessage = error.array()[0].msg;
    console.log(error);
    res.status(400).json({ message: errorMessage });
    return;
  }

  // decontruct Request { body }
  const { name, email, password } = req.body;

  // get the user with the email from the User DB
  try {
    const user = await User.find({ email: email });
    if (user.length != 0) {
      res.status(400).json({ message: "The email is already in use" });
      return;
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // store the use data in the database
  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
  });
  try {
    const savedUser = user.save();
  } catch (error) {
    res.status(400).json({ message: error });
  }

  // create JWt token using a secret key
  const token = jwt.sign(
    { email: email, userId: user._id },
    process.env.JWT_SECRET_KEY!,
    {
      expiresIn: "5h",
    }
  );

  console.log(`User ${user.email} created successfully!`);

  return res.status(200).json({ token: token, userId: user._id });
};

export const signinController = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const errorMessage = error.array()[0].msg;
    console.log(error);
    res.status(400).json({ message: errorMessage });
    return;
  }

  const { email, password } = req.body;

  // Find the user in the DB
  try {
    const user = await User.find({ email: email })
      .exec()
      .then((data) => {
        if (data.length === 0) {
          res.status(401).json({ message: `User email - ${email} not found` });
          return data[0];
        }
        return data[0];
      });

    // compare the password
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      res.status(401).json({ message: "Wroing passord, enter correct one." });
      return;
    }

    // Create the token
    const token = jwt.sign(
      { email: email, userId: user._id },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "1h",
      }
    );

    console.log(`User ${user.email} logged in successfully!`);
    return res
      .status(200)
      .json({ token: token, userId: user._id, username: user.name });
  } catch (error) {}
};

export const validTokenController = async (req: Request, res: Response) => {
  const userId = res.locals.userId;
  try {
    const user = await User.findById(userId);
    console.log("Validated the user " + userId);
    return res.status(200).json({ userId: user?._id });
  } catch (error) {}
};
