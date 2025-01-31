import { Hono } from "hono";
import { signInSchema, signUpSchema } from "../types";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { sign } from "hono/jwt";

export const userRouter = new Hono();
userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  const parseBody = signUpSchema.safeParse(body);
  if (!parseBody.success) {
    c.status(403);
    return c.json({
      msg: "invalid data",
    })
  }
  const user = await db.select().from(usersTable).where(eq(usersTable.email, parseBody.data.email));
  const user1 = user[0];
  if (user1) {
    c.status(409);
    return c.json({
      msg: "user already exists"
    })
  }
  const insertUser = await db.insert(usersTable).values({
    name: parseBody.data.username,
    email: parseBody.data.email,
    password: parseBody.data.password
  })
    .returning({ id: usersTable.id });
  const token = await sign({ id: insertUser }, "nagmani");
  c.status(200);
  return c.json({
    token,
    msg: "succesful"
  })
});

userRouter.post("/signin", async (c) => {
  const body = await c.req.json();
  const parsedData = signInSchema.safeParse(body);
  if (!parsedData.success) {
    c.status(403);
    return c.json({
      msg: "invalid data"
    });
  }
  const checkCredentials = await db.select().from(usersTable).where(and(eq(usersTable.email, parsedData.data.email), eq(usersTable.password, parsedData.data.password))).limit(1);
  const user = checkCredentials[0];
  if (!user) {
    c.status(401);
    return c.json({
      msg: "invalid credentials"
    })
  }
  const token = await sign({ id: user.id }, "nagmani")
  c.status(200);
  return c.json({
    token,
    msg: "successful"
  })
});
