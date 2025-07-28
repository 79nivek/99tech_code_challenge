import express from "express";
import { body, param, validationResult } from "express-validator";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  TaskCreateInput,
  TaskUpdateInput,
  updateTask,
} from "../../services/task";
import { PRIORITY } from "@prisma/client";

export const taskRouter = express.Router();

taskRouter.get("/", async (req, res) => {
  try {
    const tasks = await getTasks();
    res.success(tasks);
  } catch (error) {
    res.error("Failed to get tasks", 500, error);
  }
});

taskRouter.get(
  "/:id",
  param("id").isInt().withMessage("ID must be an integer"),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const task = await getTask(Number(req.params?.id));

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.success(task);
    } catch (error) {
      res.error("Failed to get task", 500, error);
    }
  }
);

taskRouter.post(
  "/",
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("Title is required"),
  body("description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description is required"),
  body("completed")
    .isBoolean()
    .withMessage("Completed must be a boolean")
    .optional(),
  body("priority")
    .isIn(Object.values(PRIORITY))
    .withMessage("Priority must be a valid priority")
    .optional(),
  body("dueDate").isDate().withMessage("Due date must be a date").optional(),
  body("tags").isArray().withMessage("Tags must be an array").optional(),
  async (req, res) => {
    try {
      const payload: TaskCreateInput = {
        title: req.body.title || "",
        description: req.body.description || "",
        completed: req.body.completed || false,
        priority: req.body.priority,
        dueDate: req.body.dueDate || new Date(),
        tags: req.body.tags || [],
      };

      const task = await createTask(payload);
      res.success(task, "Task created successfully", 201);
    } catch (error) {
      res.error("Failed to create task", 500, error);
    }
  }
);

taskRouter.put(
  "/:id",
  param("id").isInt().withMessage("ID must be an integer"),
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("Title is required")
    .optional(),
  body("description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description is required")
    .optional(),
  body("priority")
    .isString()
    .withMessage("Priority must be a string")
    .optional(),
  body("dueDate")
    .isString()
    .withMessage("Due date must be a string")
    .optional(),
  body("tags")
    .isArray()
    .withMessage("Tags must be an array")
    .optional()
    .custom((tags) => {
      return tags.every((tag: string) => typeof tag === "string");
    }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = Number(req.params?.id);
    const { title, description, priority, dueDate, tags } = req.body;
    try {
      const payload: TaskUpdateInput = {
        title,
        description,
        priority,
        dueDate,
        tags,
      };
      const task = await updateTask(Number(id), payload);
      res.success(task, "Task updated successfully", 200);
    } catch (error) {
      res.error("Failed to update task", 500, error);
    }
  }
);

taskRouter.delete(
  "/:id",
  param("id").isInt().withMessage("ID must be an integer"),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const task = await deleteTask(Number(req.params?.id));
      res.success(task, "Task deleted successfully", 200);
    } catch (error) {
      res.error("Failed to delete task", 500, error);
    }
  }
);

export default taskRouter;
