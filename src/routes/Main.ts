import { Request, Response } from "express";

export async function MainController(
  _: Request,
  res: Response
): Promise<Response | void> {
  res.send("<h3>hello</h3>");
}
