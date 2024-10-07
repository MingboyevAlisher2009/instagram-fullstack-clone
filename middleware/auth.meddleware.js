import { verifyToken } from "../utils/token.js";

const AuthMiddleware = (req, res, next) => {
  try {
    const brToken = req.headers;

    if (!brToken) {
      return res.status(401).json({ error: "Authorization header is missing" });
    }

    const token = brToken.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const { userId } = verifyToken(token);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.userId = userId;

    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

export default AuthMiddleware;
