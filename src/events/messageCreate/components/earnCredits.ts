import { ChannelType, Message } from "discord.js";
import economy from "../../../modules/credits";

export default async (message: Message) => {
  const { guild, author, channel } = message;

  if (!guild) return;
  if (author.bot) return;
  if (channel.type !== ChannelType.GuildText) return;

  await economy.give(guild, author, 1);
};
