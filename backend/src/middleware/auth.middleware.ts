import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


interface JwtPayload {
  userId: string;
  role: "user" | "admin";
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const token = authHeader.split(" ")[1];
    const verifyJwt =jwt.verify(
        token,
        process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user = {
    userId: verifyJwt.userId,
    role: verifyJwt.role,
};
    next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
