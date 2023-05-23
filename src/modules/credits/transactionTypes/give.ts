import { Guild, User } from "discord.js";
import prisma from "../../../handlers/prisma";
import logger from "../../../middlewares/logger";
import validateTransaction from "../validateTransaction";

export default async (guild: Guild, user: User, amount: number) => {
  try {
    logger.debug(
      `Starting transaction for guild: ${guild.id}, user: ${user.id}`
    );

    const recipient = await prisma.$transaction(async (tx) => {
      await validateTransaction(guild, user, amount);

      logger.debug(
        `Upserting guildMemberCredit for guild: ${guild.id}, user: ${user.id}`
      );

      const existingRecipient = await tx.guildMemberCredit.findUnique({
        where: {
          guildId_userId: {
            userId: user.id,
            guildId: guild.id,
          },
        },
      });

      if (existingRecipient && existingRecipient.balance >= 2147483647) {
        throw new Error(
          "Oops! That's more credits than the user can have. The maximum allowed is 2,147,483,647."
        );
      }

      const recipient = await tx.guildMemberCredit.upsert({
        update: {
          balance: {
            increment: amount,
          },
        },
        create: {
          GuildMember: {
            connectOrCreate: {
              create: {
                User: {
                  connectOrCreate: {
                    create: { id: user.id },
                    where: { id: user.id },
                  },
                },
                Guild: {
                  connectOrCreate: {
                    create: { id: guild.id },
                    where: { id: guild.id },
                  },
                },
              },
              where: { guildId_userId: { guildId: guild.id, userId: user.id } },
            },
          },
          balance: amount,
        },
        where: {
          guildId_userId: {
            userId: user.id,
            guildId: guild.id,
          },
        },
      });

      if (!recipient) {
        throw new Error("No recipient available.");
      }

      return recipient;
    });

    logger.debug(
      `Transaction completed for guild: ${guild.id}, user: ${user.id}`
    );
    return recipient;
  } catch (error: any) {
    logger.error(
      `Error in transaction for guild: ${guild.id}, user: ${user.id}: ${error.message}`
    );
    throw error;
  }
};
