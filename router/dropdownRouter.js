import express from "express"
import { getScholar, 
    getDept,
    getSchool} from "../controller/dropdownController.js";

const dropRouter = express.Router();

dropRouter.get("/school/department/:scholar", getScholar);

dropRouter.get("/school/:department", getDept)

dropRouter.get("/:school", getSchool)

export default dropRouter;