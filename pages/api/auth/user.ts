import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { verifyToken, getTokenCookie } from "@/services/auth";
import { isError } from "@/utils/helpers";
import { JwtPayload } from "jsonwebtoken";

/**
 * Authenticates the user by verifying the JWT token from the request cookies.
 *
 * @param {NextApiRequest} req - The API request object.
 * @returns {JwtPayload} The decoded JWT payload if the token is valid.
 * @throws {Error} If the token is missing or invalid.
 */
const authenticateUser = (req: NextApiRequest): JwtPayload => {
  const token = getTokenCookie(req);
  if (!token) {
    throw new Error("Not authenticated");
  }

  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    throw new Error("Invalid token");
  }

  return decodedToken as JwtPayload;
};

/**
 * Handler function for fetching the authenticated user's data.
 *
 * @param {NextApiRequest} req - The API request object.
 * @param {NextApiResponse} res - The API response object.
 * @returns {Promise<void>} A promise that resolves when the request handling is complete.
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const decodedToken = authenticateUser(req);

    const user = await prisma.users.findUnique({
      where: { id: decodedToken.userId },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({ userData });
  } catch (error) {
    if (isError(error)) {
      console.error("Error:", error.message);
      if (
        error.message === "Not authenticated" ||
        error.message === "Invalid token"
      ) {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

export default handler;
