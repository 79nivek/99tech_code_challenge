import { Request, Response, NextFunction } from "express";

// Extend Response interface to add custom methods
declare global {
  namespace Express {
    interface Response {
      success: (data?: any, message?: string, statusCode?: number) => void;
      error: (message?: string, statusCode?: number, errors?: any) => void;
    }
  }
}

export interface StandardResponse {
  success: boolean;
  data?: any;
  message?: string;
  requestId: string;
  timeExec: number;
  statusCode: number;
}

export const transformResponse = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Add success response method
  res.success = function (
    data?: any,
    message: string = "Success",
    statusCode: number = 200
  ) {
    const endTime = Date.now();
    const timeExec = endTime - startTime;

    const response: StandardResponse = {
      success: true,
      data,
      message,
      requestId: req.logData?.requestId || "unknown",
      timeExec,
      statusCode,
    };

    this.status(statusCode).json(response);
  };

  // Add error response method
  res.error = function (
    message: string = "Error",
    statusCode: number = 500,
    errors?: any
  ) {
    const endTime = Date.now();
    const timeExec = endTime - startTime;

    const response: StandardResponse = {
      success: false,
      data: errors || null,
      message,
      requestId: req.logData?.requestId || "unknown",
      timeExec,
      statusCode,
    };

    this.status(statusCode).json(response);
  };

  // Override the original json method to ensure consistent structure
  const originalJson = res.json;
  res.json = function (body: any) {
    // If the response is already using our custom methods, don't transform
    if (
      body &&
      typeof body === "object" &&
      "requestId" in body &&
      "timeExec" in body
    ) {
      return originalJson.call(this, body);
    }

    // Transform regular responses to standard format
    const endTime = Date.now();
    const timeExec = endTime - startTime;

    const response: StandardResponse = {
      success: res.statusCode < 400,
      data: body,
      message: res.statusCode < 400 ? "Success" : "Error",
      requestId: req.logData?.requestId || "unknown",
      timeExec,
      statusCode: res.statusCode,
    };

    return originalJson.call(this, response);
  };

  // Override the original send method to ensure consistent structure
  const originalSend = res.send;
  res.send = function (body: any) {
    // If the response is already using our custom methods, don't transform
    if (
      body &&
      typeof body === "object" &&
      "requestId" in body &&
      "timeExec" in body
    ) {
      return originalSend.call(this, body);
    }

    return originalSend.call(this, body);
  };

  next();
};
