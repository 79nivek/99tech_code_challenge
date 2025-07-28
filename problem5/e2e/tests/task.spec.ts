import { PRIORITY, Task } from "@prisma/client";
import { axiosInstance } from "../utils/axios";

describe("Tasks API E2E Tests", () => {
  let taskId: number | undefined;
  let taskId2: number | undefined;

  const task = {
    title: "Test Task",
    description: "Test Description",
    completed: false,
    priority: PRIORITY.NONE,
    dueDate: new Date(),
    tags: [],
  };

  const createTask = async () => {
    return axiosInstance.post("/tasks", task);
  };

  beforeAll(async () => {
    try {
      const { data: response } = await createTask();

      taskId = response.data.id;
    } catch (error) {
      console.error(error);
      expect(error).toThrow();
    }
  });

  afterAll(async () => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
    } catch (error) {
      console.error(error);
    }
  });

  it("should create a task and retrieve tasks", async () => {
    try {
      const { data: response } = await createTask();

      expect(response.statusCode).toBe(201);
      expect(response.data.title).toEqual("Test Task");
      expect(response.data.description).toEqual("Test Description");
      expect(response.data.completed).toEqual(false);
      expect(response.data.priority).toEqual(PRIORITY.NONE);
      expect(response.data.tags).toEqual([]);

      taskId2 = response.data.id;
    } catch (error) {
      console.error(error);
      expect(error).toThrow();
    }
  });

  it("should retrieve a task", async () => {
    try {
      const { data: response } = await axiosInstance.get(`/tasks/${taskId}`);

      expect(response.statusCode).toBe(200);
      expect(response.data.title).toEqual("Test Task");
    } catch (error) {
      console.error(error);
      expect(error).toThrow();
    }
  });

  it("should retrieve all tasks", async () => {
    try {
      const { data: response } = await axiosInstance.get("/tasks");

      expect(response.statusCode).toBe(200);
      expect(response.data.length).toBeGreaterThan(0);
      expect(
        response.data.find((task: Task) => task.id === taskId)
      ).toBeDefined();
    } catch (error) {
      console.error(error);
      expect(error).toThrow();
    }
  });

  it("should update a task", async () => {
    try {
      const { data: response } = await axiosInstance.put(`/tasks/${taskId}`, {
        title: "Updated Task",
      });

      expect(response.statusCode).toBe(200);
      expect(response.data.title).toEqual("Updated Task");
    } catch (error) {
      console.error(error);
      expect(error).toThrow();
    }
  });

  it("should delete a task", async () => {
    try {
      const { data: response } = await axiosInstance.delete(
        `/tasks/${taskId2}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.data.id).toEqual(taskId2);
    } catch (error) {
      console.error(error);
      expect(error).toThrow();
    }
  });
});
