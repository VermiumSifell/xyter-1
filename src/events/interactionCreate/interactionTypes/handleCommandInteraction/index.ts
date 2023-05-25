import { CommandInteraction } from "discord.js";
import cooldown from "../../../../handlers/CooldownManager";
import generateCooldownName from "../../../../helpers/generateCooldownName";
import handleCooldown from "./handlers/handleCooldown";
import handleError from "./handlers/handleError";
import handleUnavailableCommand from "./handlers/handleUnavailableCommand";

export default async function handleCommandInteraction(
  interaction: CommandInteraction
) {
  if (!interaction.isCommand()) {
    return;
  }

  const { client, commandName, user, guild } = interaction;
  const currentCommand = client.commands.get(commandName);

  if (!currentCommand) {
    await handleUnavailableCommand(interaction, commandName);
    return;
  }

  try {
    const cooldownItem = await generateCooldownName(interaction);
    const { guildCooldown, userCooldown, guildMemberCooldown } =
      await cooldown.checkCooldowns(cooldownItem, guild, user);

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
  } catch (error) {
    await handleError(interaction, commandName, error);
  }
}
