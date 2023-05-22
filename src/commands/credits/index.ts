import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
  SubcommandHandlers,
  executeSubcommand,
} from "../../handlers/executeSubcommand";
import * as balance from "./subcommands/balance";
import * as gift from "./subcommands/gift";
import * as top from "./subcommands/top";
import * as work from "./subcommands/work";

const subcommandHandlers: SubcommandHandlers = {
  balance: balance.execute,
  gift: gift.execute,
  top: top.execute,
  work: work.execute,
};

export const builder = new SlashCommandBuilder()
  .setName("credits")
  .setDescription("Manage your credits.")
  .setDMPermission(false)
  .addSubcommand(balance.builder)
  .addSubcommand(gift.builder)
  .addSubcommand(top.builder)
  .addSubcommand(work.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await executeSubcommand(interaction, subcommandHandlers);
};
