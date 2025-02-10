import express from "express";
import AuthRoute from "./routes/auth.routes.js";
import FilterRoute from "./routes/all-filters.routes.js";
import PublicationRoute from "./routes/publications.routes.js";
import HistoryRoute from "./routes/story.routes.js";
import { config } from "dotenv";
import MongoDB from "./db/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/publications", express.static("uploads/publications"));
app.use("/uploads/storys", express.static("uploads/storys"));

const PORT = process.env.PORT || 4000;

app.use("/api/auth", AuthRoute);
app.use("/api/filter", FilterRoute);
app.use("/api/publication", PublicationRoute);
app.use("/api/story", HistoryRoute);

app.listen(PORT, () => {
  MongoDB();
  console.log(`Server run on port: http://localhost:${PORT}`);
});
