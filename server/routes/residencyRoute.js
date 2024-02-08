import express from "express";
import { createResidency, getAllResidencies, getResidency } from "../controllers/resdCntrl.js";
import { verifyPass } from "../middleware/jwt.js";

const router = express.Router()

router.post("/create", verifyPass(true), createResidency)
router.get("/allresd", getAllResidencies)
router.get("/:id", getResidency)


export { router as residencyRoute }