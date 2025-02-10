import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

export const generateToken = (res, userId) => {
  try {
    const token = sign({ userId }, process.env.JWT_SECKRET, {
      expiresIn: "15d",
    });

    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
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
