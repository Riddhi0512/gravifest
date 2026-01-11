import { Router } from "express";
import { getRegistrations } from "../controllers/registrationController";

const router = Router();

router.get("/", getRegistrations);

export default router;
