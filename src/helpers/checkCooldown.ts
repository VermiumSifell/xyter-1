import { Cooldown } from "@prisma/client";
import { ChatInputCommandInteraction, Message } from "discord.js";
import prisma from "../handlers/prisma";

export default async function getCooldown(
  data: ChatInputCommandInteraction | Message,
  name: string
): Promise<Cooldown | null> {
  const { guild, member } = data;
  let cooldown: Cooldown | null = null;

  if (guild && member?.user) {
    cooldown = await prisma.cooldown.findFirst({
      where: {
        guildId: guild.id,
        userId: member.user.id,
        name,
        expiresAt: {
          gte: new Date(),
        },
      },
    });
  } else if (guild) {
    cooldown = await prisma.cooldown.findFirst({
      where: {
        guildId: guild.id,
        name,
        expiresAt: {
          gte: new Date(),
        },
      },
    });
  } else if (member?.user) {
    cooldown = await prisma.cooldown.findFirst({
      where: {
        userId: member.user.id,
        name,
        expiresAt: {
          gte: new Date(),
        },
      },
    });
  }

  return cooldown;
}
