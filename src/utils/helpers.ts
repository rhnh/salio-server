import { Request, Response, NextFunction, RequestHandler } from "express";
import { ISalioResponse, RHParams } from "../types";

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
