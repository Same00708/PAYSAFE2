import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../middleware/errorHandler.js";
import { authenticate } from "../middleware/auth.js";
import * as messagesRepo from "../repositories/messages.js";
import * as transactionsRepo from "../repositories/transactions.js";
import { notifyUser } from "../services/notifications.js";

export const messagesRouter = Router({ mergeParams: true });

messagesRouter.use(authenticate);

messagesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const transactionId = Number(req.params.transactionId);
    const allowed = await transactionsRepo.userCanAccessTransaction(
      transactionId,
      req.auth!.userId,
    );
    if (!allowed) {
      throw new AppError(403, "Accès refusé au chat de cette transaction");
    }

    await messagesRepo.markMessagesRead(transactionId, req.auth!.userId);
    const data = await messagesRepo.findMessagesByTransaction(transactionId);
    res.json({ data });
  }),
);

messagesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const transactionId = Number(req.params.transactionId);
    const { messageText, attachmentUrl } = req.body as {
      messageText?: string;
      attachmentUrl?: string;
    };

    if (!messageText?.trim()) {
      throw new AppError(400, "messageText requis");
    }

    const transaction = await transactionsRepo.findTransactionById(transactionId);
    if (!transaction) {
      throw new AppError(404, "Transaction introuvable");
    }

    const allowed = await transactionsRepo.userCanAccessTransaction(
      transactionId,
      req.auth!.userId,
    );
    if (!allowed) {
      throw new AppError(403, "Accès refusé");
    }

    const closed = ["COMPLETED", "RETURNED_TO_SELLER"].includes(transaction.status);
    if (closed) {
      throw new AppError(400, "Le chat est fermé pour cette transaction");
    }

    const message = await messagesRepo.createMessage({
      transactionId,
      senderId: req.auth!.userId,
      messageText: messageText.trim(),
      attachmentUrl,
    });

    const recipientId =
      req.auth!.userId === transaction.buyerId
        ? transaction.sellerId
        : transaction.buyerId;

    await notifyUser({
      userId: recipientId,
      transactionId,
      type: "NEW_MESSAGE",
      title: "Nouveau message",
      content: messageText.slice(0, 120),
    });

    res.status(201).json({ data: message });
  }),
);
