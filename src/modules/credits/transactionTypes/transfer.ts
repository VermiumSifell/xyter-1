import { Guild, User } from "discord.js";
import prisma from "../../../handlers/prisma";
import upsertGuildMember from "../../../helpers/upsertGuildMember";
import logger from "../../../middlewares/logger";
import validateTransaction from "../validateTransaction";

export default async (
  guild: Guild,
  fromUser: User,
  toUser: User,
  amount: number
) => {
  if (fromUser.id === toUser.id) {
    throw new Error("The sender and receiver cannot be the same user.");
  }

  try {
    const fromTransaction = await prisma.guildMemberCredit.findFirst({
      where: {
        guildId: guild.id,
        userId: fromUser.id,
      },
    });

    if (!fromTransaction) {
      throw new Error("Failed to fetch the sender's transaction record.");
    }

    const toTransaction = await prisma.guildMemberCredit.findUnique({
      where: {
        guildId_userId: {
          guildId: guild.id,
          userId: toUser.id,
        },
      },
    });

    if (!toTransaction) {
      console.log({ guildId: guild.id, userId: toUser.id });

      // Create a new transaction record for the recipient with initial balance of 0

      await upsertGuildMember(guild, toUser);
      prisma.guildMemberCredit.create({
        data: {
          guildId: guild.id,
          userId: toUser.id,
          balance: 0,
        },
      });
    }

    const remainingBalance = 2147483647 - amount;

    if (fromTransaction.balance < amount) {
      throw new Error("The sender does not have enough credits.");
    }

    await validateTransaction(guild, toUser, amount);

    let adjustedAmount = amount;
    let overflowAmount = 0;

    if (toTransaction && toTransaction.balance + amount > 2147483647) {
      adjustedAmount = 2147483647 - toTransaction.balance;
      overflowAmount = amount - adjustedAmount;
    }

    await prisma.$transaction(async (tx) => {
      await tx.guildMemberCredit.update({
        where: {
          guildId_userId: {
            guildId: guild.id,
            userId: fromUser.id,
          },
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      if (adjustedAmount > 0) {
        await tx.guildMemberCredit.upsert({
          where: {
            guildId_userId: {
              guildId: guild.id,
              userId: toUser.id,
            },
          },
          create: {
            guildId: guild.id,
            userId: toUser.id,
            balance: adjustedAmount,
          },
          update: {
            balance: {
              increment: adjustedAmount,
            },
          },
        });
      }

      if (overflowAmount > 0) {
        await tx.guildMemberCredit.update({
          where: {
            guildId_userId: {
              guildId: guild.id,
              userId: fromUser.id,
            },
          },
          data: {
            balance: {
              increment: overflowAmount,
            },
          },
        });
      }
    });

    const updatedFromTransaction = await prisma.guildMemberCredit.findFirst({
      where: {
        guildId: guild.id,
        userId: fromUser.id,
      },
    });

    const updatedToTransaction = await prisma.guildMemberCredit.findFirst({
      where: {
        guildId: guild.id,
        userId: toUser.id,
      },
    });

    if (!updatedFromTransaction) {
      throw new Error(
        "Failed to fetch the updated sender's transaction record."
      );
    }

    if (!updatedToTransaction) {
      throw new Error(
        "Failed to fetch the updated recipient's transaction record."
      );
    }

    const transferredAmount = adjustedAmount;

    return {
      transferredAmount,
      fromTransaction: updatedFromTransaction,
      toTransaction: updatedToTransaction,
    };
  } catch (error: any) {
    logger.error(
      `Error in transaction for guild: ${guild.id}, sender: ${fromUser.id}, recipient: ${toUser.id}: ${error.message}`
    );
    throw error;
  }
};
