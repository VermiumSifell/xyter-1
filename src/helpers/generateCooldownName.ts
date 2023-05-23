import { ChatInputCommandInteraction, Message } from "discord.js";

export const generateInteraction = async (
  interaction: ChatInputCommandInteraction
) => {
  return `${
    interaction.commandName
  }-${interaction.options.getSubcommandGroup()}-${interaction.options.getSubcommand()}`;
};

export const generateMessage = async (
  message: Message,
  name: string,
  channelSpecific?: boolean
) => {
  return channelSpecific ? `${message.channelId}-${name}` : `${name}`;
};
