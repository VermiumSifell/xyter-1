import { SlashCommandSubcommandGroupBuilder } from "discord.js";
import * as add from "./subcommands/add";
import * as create from "./subcommands/create";
import * as remove from "./subcommands/remove";
import * as trash from "./subcommands/trash";

export const builder = (group: SlashCommandSubcommandGroupBuilder) => {
  return group
    .setName("reaction")
    .setDescription("Manage the credits of a user.")
    .addSubcommand(add.builder) // Add role
    .addSubcommand(remove.builder) // Remove role
    .addSubcommand(create.builder) // New message
    .addSubcommand(trash.builder); // Remove message
};

export const subcommands = {
  add,
  remove,
  create,
  trash,
};
