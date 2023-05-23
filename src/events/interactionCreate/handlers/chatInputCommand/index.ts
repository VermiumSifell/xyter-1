import { formatDistanceToNow } from "date-fns";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  codeBlock,
} from "discord.js";
import checkCooldown from "../../../../helpers/checkCooldown";
import { generateInteraction } from "../../../../helpers/generateCooldownName";
import logger from "../../../../middlewares/logger";

export default async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const { client, commandName, user, guild } = interaction;

  const currentCommand = client.commands.get(commandName);
  if (!currentCommand) {
    throw new Error("Command unavailable");
  }

  try {
    const cooldownActive = await checkCooldown(
      interaction,
      await generateInteraction(interaction)
    );

    logger.verbose(
      `Guild: ${guild?.id} User: ${user.id} Name: ${await generateInteraction(
        interaction
      )} User is on cooldown`
    );

    if (cooldownActive) {
      const timeLeft = formatDistanceToNow(cooldownActive.expiresAt, {
        includeSeconds: true,
      });

      const cooldownEmbed = new EmbedBuilder()
        .setAuthor({ name: "⚠️ | Request Failed" })
        .setDescription(
          `Sorry, but you're currently on cooldown. Please try again later.\n\nRemaining cooldown time: ${timeLeft}`
        )
        .setColor("#FF6699")
        .setTimestamp()
        .setFooter({ text: `Cooldown ID: ${cooldownActive.id}` });
      await interaction.reply({ embeds: [cooldownEmbed] });
      return;
    }

    await currentCommand.execute(interaction);
  } catch (error: any) {
    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Report Problem")
        .setStyle(ButtonStyle.Link)
        .setEmoji("✏️")
        .setURL("https://discord.zyner.org")
    );

    const errorEmbed = new EmbedBuilder()
      .setAuthor({ name: "⚠️ | Request Failed" })
      .setDescription(
        `An error occurred while processing your request. Please try again later.`
      )
      .addFields({
        name: "Error Details",
        value: `${codeBlock(error.message)}`,
      })
      .setColor("#FFCC66")
      .setTimestamp();

    return interaction.editReply({
      embeds: [errorEmbed],
      components: [buttons],
    });
  }
};
