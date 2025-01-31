import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { protectedRoute } from "./routes/protectedRouted";
import { authenticate } from "./middleware";

const app = new Hono();

app.use("/api/protectedRoutes/*", authenticate);
app.route("/api/auth/", userRouter);
app.route("/api/protectedRoutes", protectedRoute);

export default app;
