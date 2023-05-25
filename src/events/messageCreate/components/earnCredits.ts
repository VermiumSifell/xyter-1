import { Channel, ChannelType, Guild, Message, User } from "discord.js";
import cooldown from "../../../handlers/CooldownManager";
import economy from "../../../modules/credits";
import logger from "../../../utils/logger";

const MINIMUM_LENGTH = 5;

const cooldownName = "earnCredits";

export default async (message: Message) => {
  const { guild, author, channel, content } = message;

  if (!guild || !isMessageValid(guild, author, channel, content)) {
    return;
  }

  if (await isUserOnCooldown(guild, author)) {
    logger.verbose(
      `User "${author.username}" is on cooldown for "${cooldownName}" in guild "${guild.name}"`
    );
    return;
  }

  try {
    await economy.give(guild, author, 1);
  } catch (error: unknown) {
    logger.error(
      `Failed to give credits to user ${author.username} in guild ${
        guild.name
      } when sending a message: ${String(error)}`
    );
  }

  await setCooldown(guild, author);
};

function isMessageValid(
  guild: Guild,
  author: User,
  channel: Channel,
  content: string
): boolean {
  return (
    !author.bot &&
    channel.type === ChannelType.GuildText &&
    content.length >= MINIMUM_LENGTH
  );
}

async function isUserOnCooldown(guild: Guild, author: User): Promise<boolean> {
  const cooldownActive = await cooldown.checkGuildMemberCooldown(
    cooldownName,
    guild,
    author
  );
  return cooldownActive !== null;
}

async function setCooldown(guild: Guild, user: User) {
  await cooldown.setGuildMemberCooldown(cooldownName, guild, user, 5);
}
