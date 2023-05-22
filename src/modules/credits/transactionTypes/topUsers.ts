import { Guild } from "discord.js";
import prisma from "../../../handlers/prisma";

export default async (guild: Guild, userAmount: number) => {
  return await prisma.$transaction(async (tx) => {
    const topUsers = await prisma.guildMemberCredit.findMany({
      where: {
        guildId: guild.id,
      },
      orderBy: {
        balance: "desc",
      },
      take: userAmount,
    });

    // 2. Verify that there are some top users.
    if (!topUsers) throw new Error("No top users found");

    // 3. Return top users.
    return topUsers;
  });
};
