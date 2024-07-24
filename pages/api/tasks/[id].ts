import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { verifyToken, getTokenCookie } from "@/services/auth";

/**
 * Handles API requests for task management including fetching, updating, and deleting tasks.
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

  let decodedToken;
  try {
    decodedToken = verifyToken(token);
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid token" });
  }

  if (typeof decodedToken === "string") {
    return res.status(401).json({ message: "Invalid token" });
  }

  const userId = decodedToken.userId;
  const id = Number(req.query.id);

  try {
    switch (req.method) {
      case "GET": {
        const task = await prisma.tasks.findUnique({
          where: { id },
        });

        if (!task || task.userId !== userId) {
          return res.status(404).json({ message: "Task not found" });
        }

        return res.status(200).json(task);
      }

      case "PUT": {
        const { name, description, priority } = req.body;

        if (!name || !description || !priority) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        const updatedTask = await prisma.tasks.update({
          where: { id, userId },
          data: {
            name,
            description,
            priority,
          },
        });

        if (!updatedTask) {
          return res.status(404).json({ message: "Task not found" });
        }

        return res.status(200).json(updatedTask);
      }

      case "DELETE": {
        const deleteResult = await prisma.tasks.deleteMany({
          where: { id, userId },
        });

        if (deleteResult.count === 0) {
          return res.status(404).json({ message: "Task not found" });
        }

        return res.status(204).end();
      }

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
