import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize, parse } from "cookie";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// Hash a password
export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Unable to hash password");
  }
};

// Compare a plain password with a hashed password
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error("Error comparing password:", error);
    throw new Error("Unable to compare passwords");
  }
};

// Generate a JWT token
export const generateToken = (userId: number): string => {
  try {
    return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Unable to generate token");
  }
};

// Verify a JWT token
export const verifyToken = (token: string): jwt.JwtPayload | string => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid or expired token");
  }
};

// Set a token cookie
export const setTokenCookie = (res: NextApiResponse, token: string): void => {
  try {
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600,
        path: "/",
      })
    );
  } catch (error) {
    console.error("Error setting token cookie:", error);
    throw new Error("Unable to set token cookie");
  }
};

// Delete a token cookie
export const deleteCookie = (res: NextApiResponse): void => {
  try {
    res.setHeader(
      "Set-Cookie",
      serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: -1,
        path: "/",
      })
    );
  } catch (error) {
    console.error("Error deleting token cookie:", error);
    throw new Error("Unable to delete token cookie");
  }
};

// Get a token from the cookies
export const getTokenCookie = (req: NextApiRequest): string | undefined => {
  try {
    const cookies = parse(req.headers.cookie || "");
    return cookies.token;
  } catch (error) {
    console.error("Error parsing cookies:", error);
    throw new Error("Unable to retrieve token from cookies");
  }
};
