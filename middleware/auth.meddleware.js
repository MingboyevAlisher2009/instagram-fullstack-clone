import { verifyToken } from "../utils/token.js";

const AuthMiddleware = (req, res, next) => {
  try {
    const accessToken = req.cookies.jwt;

    if (!accessToken) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const { userId } = verifyToken(accessToken);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.userId = userId;

    next();
  } catch (error) {
    if (!res.headersSent) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  }
};

export default AuthMiddleware;
