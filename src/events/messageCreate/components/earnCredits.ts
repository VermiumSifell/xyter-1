import { ChannelType, Message } from "discord.js";
import CooldownManager from "../../../managers/cooldown";
import logger from "../../../middlewares/logger";
import economy from "../../../modules/credits";

const MINIMUM_LENGTH = 5;

const cooldownManager = new CooldownManager();

export default async (message: Message) => {
  const { guild, author, channel, content } = message;

  if (!guild) return;
  if (author.bot) return;
  if (channel.type !== ChannelType.GuildText) return;

  if (content.length < MINIMUM_LENGTH) return;

  if (await isUserOnCooldown(guild.id, author.id)) {
    const guildName = guild.name;
    logger.verbose(
      `User ${author.username} is on cooldown in guild ${guildName}`
    );
    return;
  }

  try {
    await economy.give(guild, author, 1);
  } catch (error: any) {
    logger.error(
      `Failed to give credits to user ${author.username} in guild ${guild.name} when sending a message: ${error.message}`
    );
  }

  await setCooldown(guild.id, author.id);
};

async function isUserOnCooldown(
  guildId: string,
  authorId: string
): Promise<boolean> {
  const cooldownActive = await cooldownManager.checkGuildMemberCooldown(
    "credits",
    guildId,
    authorId
  );
  return cooldownActive !== null;
}

async function setCooldown(guildId: string, authorId: string) {
  await cooldownManager.setGuildMemberCooldown("credits", guildId, authorId, 5);
}
