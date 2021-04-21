import { Request, Response, NextFunction, RequestHandler } from "express";

import { ISalioResponse } from "../types";

/**
 * Basic http status code
 * @public
 */
export enum httpStatus {
  ok = 200,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  conflict = 409,
  error = 500,
}
interface RHParams {
  code: httpStatus;
  message: string;
  status: boolean;
}
export function responseHandler(param: RHParams): RHParams {
  return param;
}

export function messageFn<T>({
  methodName,
  data,
  message,
  done,
}: ISalioResponse<T>): ISalioResponse<T> {
  return {
    message: message || "",
    methodName: methodName || "",
    done: done || false,
    data: data || null,
  };
}

export function salioResponse<T>({
  data,
  methodName,
  message,
}: ISalioResponse<T>): ISalioResponse<T> {
  return messageFn<T>({ methodName, data, message, done: false });
}

export const asyncFn = (fn: RequestHandler) => (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
