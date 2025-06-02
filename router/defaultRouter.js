import express from "express"
import { getSchol } from "../controller/defaultController.js";

const defRouter = express.Router();

defRouter.get("/", getSchol);

export default defRouter;