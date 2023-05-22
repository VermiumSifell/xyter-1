import { Guild, User } from "discord.js";
import prisma from "../../../handlers/prisma";

export default async (guild: Guild, user: User) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Make the transaction.
    const recipient = await tx.guildMemberCredit.upsert({
      update: {},
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
      },
      where: {
        guildId_userId: {
          guildId: guild.id,
          userId: user.id,
        },
      },
    });

    // 2. Verify that the recipient actually is created.
    if (!recipient) throw new Error("No recipient available");

    // 3. Return the recipient.
    return recipient;
  });
};
