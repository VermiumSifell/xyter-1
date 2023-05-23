import { ChatInputCommandInteraction, Message } from "discord.js";

export const generateInteraction = async (
  interaction: ChatInputCommandInteraction
) => {
  const { commandName, options } = interaction;
  const subcommandGroup = options.getSubcommandGroup();
  const subcommand = options.getSubcommand();
  return `${commandName}-${subcommandGroup}-${subcommand}`;
};

export const generateMessage = async (
  message: Message,
  name: string,
  channelSpecific?: boolean
) => {
  const { channelId } = message;
  return channelSpecific ? `${channelId}-${name}` : `${name}`;
};
