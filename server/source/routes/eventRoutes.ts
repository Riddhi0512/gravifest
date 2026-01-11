import { Router } from "express";
import { createEvent, getEvents, deleteEvent } from "../controllers/eventController";

const router = Router();

router.get("/", getEvents);
router.post("/", createEvent);
router.delete("/:id", deleteEvent);

export default router;
