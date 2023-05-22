// Dependencies
import { SlashCommandSubcommandGroupBuilder } from "discord.js";

// Modules
import * as add from "./subcommands/add";
import * as remove from "./subcommands/remove";

export const builder = (group: SlashCommandSubcommandGroupBuilder) => {
  return group
    .setName("counters")
    .setDescription("Manage guild counters.")
    .addSubcommand(add.builder)
    .addSubcommand(remove.builder);
};

export const subcommands = {
  add,
  remove,
};
