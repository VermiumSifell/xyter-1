import { ChatInputCommandInteraction } from "discord.js";
import generateCooldownName from "../../../../helpers/generateCooldownName";
import CooldownManager from "../../../../managers/cooldown";
import handleCooldown from "./handlers/handleCooldown";
import handleError from "./handlers/handleError";
import handleUnavailableCommand from "./handlers/handleUnavailableCommand";

const cooldownManager = new CooldownManager();

export default async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;

  const { client, commandName, user, guild } = interaction;
  const currentCommand = client.commands.get(commandName);

  if (!currentCommand) {
    await handleUnavailableCommand(interaction, commandName);
    return;
  }

  try {
    const cooldownItem = await generateCooldownName(interaction);
    const { guildCooldown, userCooldown, guildMemberCooldown } =
      await cooldownManager.checkCooldowns(cooldownItem, guild, user);

    if (guildCooldown || userCooldown || guildMemberCooldown) {
      await handleCooldown(
        interaction,
        guildCooldown,
        userCooldown,
        guildMemberCooldown
      );
    } else {
      await currentCommand.execute(interaction);
    }
  } catch (error: any) {
    await handleError(interaction, commandName, error);
  }
};
