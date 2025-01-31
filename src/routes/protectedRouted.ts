import { Hono } from "hono";

export const protectedRoute = new Hono();

protectedRoute.get("/first", (c) => {
  return c.json({
    msg: "this is a protected route ",
  })
})
