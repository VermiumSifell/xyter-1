import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
  SubcommandGroupHandlers,
  executeSubcommand,
} from "../../handlers/executeSubcommand";
import * as credits from "./groups/credits";
import * as reaction from "./groups/reaction";

const subcommandGroupHandlers: SubcommandGroupHandlers = {
  credits: {
    give: credits.subcommands.give.execute,
    giveaway: credits.subcommands.giveaway.execute,
    set: credits.subcommands.set.execute,
    take: credits.subcommands.take.execute,
    transfer: credits.subcommands.transfer.execute,
  },
  reaction: {
    add: reaction.subcommands.add.execute,
    remove: reaction.subcommands.remove.execute,
    create: reaction.subcommands.create.execute,
    trash: reaction.subcommands.trash.execute,
  },
};

export const builder = new SlashCommandBuilder()
  .setName("manage")
  .setDescription("Manage the bot.")
  .setDMPermission(false)
  .addSubcommandGroup(credits.builder)
  .addSubcommandGroup(reaction.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await executeSubcommand(interaction, {}, subcommandGroupHandlers);
};
