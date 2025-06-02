import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dropRouter from "./router/dropdownRouter.js";
import defRouter from "./router/defaultRouter.js";

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.port;

app.use("/dropdown", dropRouter);

app.get("/", defRouter);

app.listen(port , () => {
    console.log(`Server running on port ${port}`);
});

