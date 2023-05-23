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

  const whereCondition = guildId
    ? { guildId_userId_name: { guildId, userId, name: generatedName } }
    : { userId_name: { userId, name: generatedName } };

  const upsertData = {
    update: { expiresAt },
    create: { userId, guildId, name: generatedName, expiresAt },
  };

  cooldown = await prisma.cooldown.upsert({
    where: whereCondition,
    ...upsertData,
  });

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
