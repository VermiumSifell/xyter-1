import { Cooldown } from "@prisma/client";
import { ChatInputCommandInteraction, Message } from "discord.js";
import prisma from "../handlers/prisma";
import { generateInteraction, generateMessage } from "./generateCooldownName";

export const setInteraction = async (
  interaction: ChatInputCommandInteraction,
  cooldownDuration: number
) => {
  const { user, guild } = interaction;

  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + cooldownDuration);

  const generatedName = await generateInteraction(interaction);

  let cooldown: Cooldown | null = null;

  if (!guild) {
    cooldown = await prisma.cooldown.upsert({
      where: {
        userId_name: {
          userId: user.id,
          name: generatedName,
        },
      },
      update: {
        expiresAt,
      },
      create: {
        userId: user.id,
        name: generatedName,
        expiresAt,
      },
    });
    return cooldown;
  }

  if (!user) {
    cooldown = await prisma.cooldown.upsert({
      where: {
        guildId_name: {
          guildId: guild.id,
          name: generatedName,
        },
      },
      update: {
        expiresAt,
      },
      create: {
        guildId: guild.id,
        name: generatedName,
        expiresAt,
      },
    });
    return cooldown;
  } else {
    cooldown = await prisma.cooldown.upsert({
      where: {
        guildId_userId_name: {
          guildId: guild.id,
          userId: user.id,
          name: generatedName,
        },
      },
      update: {
        expiresAt,
      },
      create: {
        userId: user.id,
        guildId: guild.id,
        name: generatedName,
        expiresAt,
      },
    });
    return cooldown;
  }

  return cooldown;
};

export const setMessage = async (
  message: Message,
  name: string,
  channelSpecific: boolean,
  cooldownDuration: number
) => {
  const { author, guild } = message;

  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + cooldownDuration);

  const generatedName = await generateMessage(message, name, channelSpecific);

  const userId = author.id;

  let cooldown: Cooldown | null = null;

  if (!guild) {
    cooldown = await prisma.cooldown.upsert({
      where: {
        userId_name: {
          userId,
          name: generatedName,
        },
      },
      update: {
        expiresAt,
      },
      create: {
        userId,
        name: generatedName,
        expiresAt,
      },
    });
    return cooldown;
  } else {
    cooldown = await prisma.cooldown.upsert({
      where: {
        guildId_userId_name: {
          guildId: guild.id,
          userId,
          name: generatedName,
        },
      },
      update: {
        expiresAt,
      },
      create: {
        userId,
        guildId: guild.id,
        name: generatedName,
        expiresAt,
      },
    });
    return cooldown;
  }

  return cooldown;
};
