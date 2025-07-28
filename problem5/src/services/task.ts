import { Prisma, PrismaClient, PRIORITY } from "@prisma/client";
import { generateSlug } from "../utils/string.utils";

export type TaskCreateInput = Omit<Prisma.TaskCreateInput, "priority" | "slug"> & {
  priority?: PRIORITY;
};

export type TaskUpdateInput = Omit<Prisma.TaskUpdateInput, "priority" | "slug"> & {
  priority?: PRIORITY;
};

const prisma = new PrismaClient();

export const getTasks = async () => {
  const tasks = await prisma.task.findMany();
  return tasks;
};

export const getTask = async (id: number) => {
  if (!id) {
    throw new Error("Task ID is required");
  }

  const task = await prisma.task.findUnique({
    where: {
      id,
    },
  });
  return task;
};

export const createTask = async (task: TaskCreateInput) => {
  if (!task) {
    throw new Error("Task is required");
  }

  const newTask = await prisma.task.create({
    data: {
      slug: generateSlug(task.title),
      title: task.title || "",
      description: task.description || "",
      completed: task.completed || false,
      priority: task.priority || PRIORITY.NONE,
      dueDate: task.dueDate || new Date(),
      tags: task.tags || [],
    },
  });
  return newTask;
};



export const updateTask = async (id: number, task: TaskUpdateInput) => {
  if (!id || !task) {
    throw new Error("Task ID and task are required");
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: task,
  });
  return updatedTask;
};

export const deleteTask = async (id: number) => {
  if (!id) {
    throw new Error("Task ID is required");
  }

  const deletedTask = await prisma.task.delete({
    where: { id },
  });
  return deletedTask;
};
