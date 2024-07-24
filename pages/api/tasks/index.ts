import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { verifyToken, getTokenCookie } from "@/services/auth";
import { JwtPayload } from "jsonwebtoken";

/**
 * Verifies the JWT token and returns the user ID if valid.
 *
 * @param {string} token - The JWT token to verify.
 * @returns {number | null} The user ID if the token is valid; otherwise, null.
 */
const getUserIdFromToken = (token: string): number | null => {
  try {
    const decodedToken = verifyToken(token);
    if (typeof decodedToken === "object" && "userId" in decodedToken) {
      return (decodedToken as JwtPayload).userId;
    }
  } catch (error) {
    console.error("Error verifying token:", error);
  }
  return null;
};

/**
 * API handler for managing tasks. Supports GET and POST methods.
 *
 * - **GET**: Fetches tasks for the authenticated user.
 * - **POST**: Creates a new task for the authenticated user.
 *
 * @param {NextApiRequest} req - The API request object.
 * @param {NextApiResponse} res - The API response object.
 * @returns {Promise<void | any>} A promise that resolves when the request handling is complete.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | any> {
  const token = getTokenCookie(req);
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  switch (req.method) {
    case "GET": {
      try {
        const tasks = await prisma.tasks.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        });
        return res.status(200).json(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    case "POST": {
      const { name, description, priority } = req.body;

      if (!name || !description || !priority) {
        return res
          .status(400)
          .json({ message: "Name, description, and priority are required" });
      }

      try {
        const newTask = await prisma.tasks.create({
          data: {
            name,
            description,
            priority,
            userId,
          },
        });
        return res.status(201).json(newTask);
      } catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
