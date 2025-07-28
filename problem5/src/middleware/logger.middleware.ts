import { Request, Response, NextFunction } from 'express';
import { v4 } from 'uuid';

export interface LogData {
  requestId: string;
  timestamp: string;
  method: string;
  url: string;
  statusCode?: number;
  responseTime?: number;
  userAgent?: string;
  ip?: string;
  requestBody?: string;
}

declare global {
  namespace Express {
    interface Request {
      logData?: LogData;
    }
  }
}

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId = v4();
  
  // Capture request data
  const logData: LogData = {
    requestId,
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress || 'unknown',
    requestBody: JSON.stringify(req.body) || 'No body',
    statusCode: undefined,
    responseTime: undefined,
  };

  // Log request
  console.log(`[${logData.timestamp}] Start request ${logData.requestId} >>> ${logData.method} >>> ${logData.url} >>> ${logData.ip} >>> ${logData.requestBody}`);

  // Override res.end to capture response data
  const originalEnd = res.end;

  req.logData = logData;

  res.end = function(chunk?: any, encoding?: any, cb?: any) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Update log data with response info
    logData.statusCode = res.statusCode;
    logData.responseTime = responseTime;

    // Log response
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : res.statusCode >= 300 ? '\x1b[33m' : '\x1b[32m';
    const resetColor = '\x1b[0m';
    
    console.log(
      `${statusColor}[${logData.timestamp}] End request ${logData.requestId} >>> ${logData.method} >>> ${logData.url} >>> ${logData.ip} >>> ${logData.requestBody} >>> ${logData.statusCode} >>> ${logData.responseTime}ms${resetColor}`
    );

    // Call original end method
    return originalEnd.call(this, chunk, encoding, cb);
  };

  next();
}; 