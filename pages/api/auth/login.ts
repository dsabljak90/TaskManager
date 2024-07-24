import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import prisma from "../../../lib/prisma";
import {
  comparePassword,
  generateToken,
  setTokenCookie,
} from "@/services/auth";

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

/**
 * Validates the input data against the defined schema.
 *
 * @param {Object} body - The request body to validate.
 * @returns {Promise<object>} An object indicating whether the input is valid and any validation errors.
 */
const validateInput = async (body: any) => {
  try {
    await validationSchema.validate(body);
    return { valid: true, errors: null };
  } catch (error) {
    return { valid: false, error };
  }
};
/**
 * Handles the POST request for user authentication.
 *
 * @param {NextApiRequest} req - The API request object.
 * @param {NextApiResponse} res - The API response object.
 * @returns {Promise<void>} A promise that resolves when the request handling is complete.
 */
const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { email, password } = req.body;

  const { valid, errors } = await validateInput(req.body);
  if (!valid) {
    return res.status(400).json({ message: "Invalid input", errors });
  }

  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id);
    setTokenCookie(res, token);
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * The main handler for the API endpoint.
 *
 * @param {NextApiRequest} req - The API request object.
 * @param {NextApiResponse} res - The API response object.
 * @returns {Promise<void>} A promise that resolves when the request handling is complete.
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === "POST") {
    await handlePost(req, res);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
