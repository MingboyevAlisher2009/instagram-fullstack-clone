import express from "express";
import AuthRoute from "./routes/auth.routes.js";
import FilterRoute from "./routes/all-filters.routes.js";
import PublicationRoute from "./routes/publications.routes.js";
import "dotenv/config";
import MongoDB from "./db/index.js";

const app = express();

app.use(express.json());

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/publications", express.static("uploads/publications"));

const PORT = process.env.PORT || 2009; 

app.use("/api/auth", AuthRoute);
app.use("/api/filter", FilterRoute);
app.use("/api/publication", PublicationRoute);

app.listen(PORT, () => {
  MongoDB();
  console.log(`Server run on port: http://localhost:${PORT}`);
});
