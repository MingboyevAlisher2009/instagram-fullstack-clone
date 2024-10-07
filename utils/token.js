import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

export const generateToken = (userId) => {
  try {
    const token = sign({ userId }, process.env.JWT_SECKRET, {
      expiresIn: "15d",
    });

    return token;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const verifyToken = (token) => {
  try {
    const userId = verify(token, process.env.JWT_SECKRET);
    return userId;
  } catch (error) {
    throw new Error(error);
  }
};
