import { Router } from "express";
import taskRouter from "./task.router";

const router = Router();

router.use("/tasks", taskRouter);

export default router;
