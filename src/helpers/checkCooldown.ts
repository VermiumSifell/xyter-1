import { Cooldown } from "@prisma/client";
import { ChatInputCommandInteraction, Message } from "discord.js";
import prisma from "../handlers/prisma";

export default async function getCooldown(
  data: ChatInputCommandInteraction | Message,
  name: string
): Promise<Cooldown | null> {
  const { member, guild } = data;

  let cooldown: Cooldown | null = null;

  cooldown = await prisma.cooldown.findFirst({
    where: {
      OR: [
        { guildId: guild?.id, userId: member?.user.id, name },
        { guildId: guild?.id, name },
        { userId: member?.user.id, name },
      ],
      expiresAt: { gte: new Date() },
    },
  });

  return cooldown;
}
