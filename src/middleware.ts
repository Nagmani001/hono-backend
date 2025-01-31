import { verify } from "hono/jwt";

export const authenticate = async (c: any, next: any) => {
  const token = c.req.header("Authorization");
  console.log(token);
  if (!token || !token.startsWith("Bearer ")) {
    return c.json({
      msg: "invalid auth header"
    });
  }
  try {
    const actualToken = token.split(" ")[1];
    const decoded = await verify(actualToken, "nagmani");
    //@ts-ignore
    c.set("userId", decoded.id);
    await next()

  } catch (err) {
    return c.json({
      msg: "incorrect jwt"
    })
  }
}
