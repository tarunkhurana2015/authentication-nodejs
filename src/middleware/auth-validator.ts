import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

type TokenPayload = {
  email: String;
  userId: String;
};

const authValidator = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");

  if (authHeader === undefined) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  // Bearer <token>
  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as TokenPayload;
    if (decodedToken === null) {
      res.status(401).json({ message: "Unathorized user" });
      return;
    }

    res.locals.userId = decodedToken.userId;
    console.log(`middleware userId: ${res.locals.userId}`);
    next();
  } catch (error) {
    res.status(401).json({ message: "Unathorized user" });
    return;
  }
};

export default authValidator;
