import { verifyToken } from "../utils/token.js";

const AuthMiddleware = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({ error: "Authorization header is missing" });
    }

    const accessToken = authorization.split(" ")[1];

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
