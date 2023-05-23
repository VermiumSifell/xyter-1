import { Cooldown } from "@prisma/client";
import { ChatInputCommandInteraction, Message } from "discord.js";
import prisma from "../handlers/prisma";
import { generateInteraction, generateMessage } from "./generateCooldownName";

const setCooldown = async (
  userId: string,
  guildId: string | null,
  generatedName: string,
  expiresAt: Date
) => {
  let cooldown: Cooldown | null = null;

  const upsertData = {
    where: {
      OR: [
        { userId: { equals: userId }, name: { equals: generatedName } },
        { guildId: { equals: guildId }, name: { equals: generatedName } },
        {
          userId: { equals: userId },
          guildId: { equals: guildId },
          name: { equals: generatedName },
        },
      ],
    },
    update: { expiresAt },
    create: { userId, guildId, name: generatedName, expiresAt },
  };

  const existingCooldown = await prisma.cooldown.findFirst({
    where: upsertData.where,
  });

  if (existingCooldown) {
    cooldown = await prisma.cooldown.update({
      where: { id: existingCooldown.id },
      data: upsertData.update,
    });
  } else {
    cooldown = await prisma.cooldown.create({
      data: upsertData.create,
    });
  }

  return cooldown;
};

export const setInteraction = async (
  interaction: ChatInputCommandInteraction,
  cooldownDuration: number
) => {
  const { user, guild } = interaction;
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + cooldownDuration);
  const generatedName = await generateInteraction(interaction);

  return setCooldown(
    user.id,
    guild ? guild.id : null,
    generatedName,
    expiresAt
  );
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

  return setCooldown(
    author.id,
    guild ? guild.id : null,
    generatedName,
    expiresAt
  );
};
