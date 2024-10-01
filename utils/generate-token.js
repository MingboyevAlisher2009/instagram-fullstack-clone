import { sign } from "jsonwebtoken";

export const generateToken = (userId) => {
  try {
    const token = sign({ userId }, process.env.JWT_SECKRET, {
      expiresIn: 30 * 24 * 60 * 60 * 1000,
    });
    return token;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
