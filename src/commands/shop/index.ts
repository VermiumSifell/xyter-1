import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import * as ctrlpanel from "./subcommands/ctrlpanel";

export const builder = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("Guild shop")
  .setDMPermission(false)
  .addSubcommand(ctrlpanel.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "ctrlpanel": {
      await ctrlpanel.execute(interaction);
      break;
    }
    default: {
      throw new Error("Unknown command");
    }
  }
};
