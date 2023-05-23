import { Cooldown } from "@prisma/client";
import { ChatInputCommandInteraction, Message } from "discord.js";
import prisma from "../handlers/prisma";

export default async (
  data: ChatInputCommandInteraction | Message,
  name: string
) => {
  const { guild, member } = data;

  let cooldown: Cooldown | null = null;

  if (guild) {
    cooldown = await prisma.cooldown.findFirst({
      where: {
        guildId: guild.id,
        name,
        expiresAt: {
          gte: new Date(),
        },
      },
    });
  }

  if (member?.user) {
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
  }

  return cooldown;
};
