import { ChannelType, Message } from "discord.js";
import checkCooldown from "../../../helpers/checkCooldown";
import { generateMessage } from "../../../helpers/generateCooldownName";
import { setMessage } from "../../../helpers/setCooldown";
import economy from "../../../modules/credits";

export default async (message: Message) => {
  const { guild, author, channel } = message;

  if (!guild) return;
  if (author.bot) return;
  if (channel.type !== ChannelType.GuildText) return;

  const cooldownActive = await checkCooldown(
    message,
    await generateMessage(message, "credits", false)
  );

  if (cooldownActive) {
    await message.reply("Credits is on cooldown.");
    return;
  }

  await economy.give(guild, author, 1);

  await setMessage(message, "credits", false, 5);
};
