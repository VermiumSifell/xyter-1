import { ChatInputCommandInteraction } from "discord.js";

export default async (interaction: ChatInputCommandInteraction) => {
  const { commandName, options } = interaction;
  const subcommandGroup = options.getSubcommandGroup();
  const subcommand = options.getSubcommand();
  return `${commandName}-${subcommandGroup}-${subcommand}`;
};
