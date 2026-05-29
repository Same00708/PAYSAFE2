import { Router } from "express";
import { healthRouter } from "./health.js";
import { authRouter } from "./auth.js";
import { transactionsRouter } from "./transactions.js";
import { usersRouter } from "./users.js";
import { messagesRouter } from "./messages.js";
import { notificationsRouter } from "./notifications.js";
import { adminRouter } from "./admin.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/transactions", transactionsRouter);
apiRouter.use("/transactions/:transactionId/messages", messagesRouter);
apiRouter.use("/notifications", notificationsRouter);
apiRouter.use("/admin", adminRouter);
