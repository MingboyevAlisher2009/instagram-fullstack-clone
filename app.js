import express from "express";
import AuthRoute from "./routes/auth.routes.js";
import "dotenv/config";
import MongoDB from "./db/index.js";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 2009;

app.use("/api/auth", AuthRoute);

app.listen(PORT, () => {
    MongoDB();
    console.log(`Server run on port: http://localhost:${PORT}`);
});
