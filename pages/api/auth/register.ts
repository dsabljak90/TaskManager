import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { hashPassword } from "@/services/auth";
import * as yup from "yup";

const userSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(4).required(),
  name: yup.string().required(),
});

/**
 * Validates the input data against the defined schema.
 *
 * @param {Object} body - The request body to validate.
 * @returns {Promise<object>} An object indicating whether the input is valid and any validation errors.
 */
const validateInput = async (body: any) => {
  try {
    await userSchema.validate(body);
    return { valid: true, errors: null };
  } catch (error) {
    return { valid: false, error };
  }
};
/**
 * Creates a new user in the database.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} name - The user's name.
 * @returns {Promise<Object>} The created user object.
 */
const createUser = async (
  email: string,
  password: string,
  name: string
): Promise<Object> => {
  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create the user
  return await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
};

/**
 * The main handler for the API endpoint to create a new user.
 *
 * @param {NextApiRequest} req - The API request object.
 * @param {NextApiResponse} res - The API response object.
 * @returns {Promise<void>} A promise that resolves when the request handling is complete.
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  const { email, password, name } = req.body;

  const { valid, errors } = await validateInput(req.body);
  if (!valid) {
    return res.status(400).json({ message: "Invalid input", errors });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await createUser(email, password, name);

    return res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default handler;
