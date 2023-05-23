import { ChannelType, Message } from "discord.js";
import checkCooldown from "../../../helpers/checkCooldown";
import { generateMessage } from "../../../helpers/generateCooldownName";
import { setMessage } from "../../../helpers/setCooldown";
import logger from "../../../middlewares/logger";
import economy from "../../../modules/credits";

const MINIMUM_LENGTH = 5;

export default async (message: Message) => {
  const { guild, author, channel, content } = message;

  if (!guild) return;
  if (author.bot) return;
  if (channel.type !== ChannelType.GuildText) return;

  if (content.length < MINIMUM_LENGTH) return;

  const cooldownActive = await checkCooldown(
    message,
    await generateMessage(message, "credits", false)
  );

  if (cooldownActive) {
    logger.verbose(`Credits is on cooldown. User: ${author.id}`);
    return;
  }

  await economy.give(guild, author, 1).catch((error: any) => {
    logger.error(
      `Failed giving user (${author.username} credits when sending message: ${error.message}`
    );
  });

  await setMessage(message, "credits", false, 5);
};
