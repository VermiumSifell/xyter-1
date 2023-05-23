import { formatDistanceToNow } from "date-fns";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  codeBlock,
} from "discord.js";
import { generateInteraction } from "../../../../helpers/generateCooldownName";
import CooldownManager from "../../../../managers/cooldown";
import logger from "../../../../middlewares/logger";

const cooldownManager = new CooldownManager();

export default async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const { client, commandName, user, guild } = interaction;

  const currentCommand = client.commands.get(commandName);
  if (!currentCommand) {
    throw new Error("Command unavailable");
  }

  try {
    const cooldownItem = await generateInteraction(interaction);
    const guildId = guild?.id;
    const userId = user.id;

    const guildCooldown = guildId
      ? await cooldownManager.checkGuildCooldown(cooldownItem, guildId)
      : null;
    const userCooldown = await cooldownManager.checkUserCooldown(
      cooldownItem,
      userId
    );
    const guildMemberCooldown = guildId
      ? await cooldownManager.checkGuildMemberCooldown(
          cooldownItem,
          guildId,
          userId
        )
      : null;

    if (guildCooldown || userCooldown || guildMemberCooldown) {
      logger.verbose(
        `Guild: ${guildId} User: ${userId} Name: ${cooldownItem} User is on cooldown`
      );

      const cooldown = guildCooldown || userCooldown || guildMemberCooldown;
      if (!cooldown || !cooldown.expiresAt) return;
      const timeLeft = formatDistanceToNow(cooldown.expiresAt, {
        includeSeconds: true,
      });

      const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Report Problem")
          .setStyle(ButtonStyle.Link)
          .setEmoji("✏️")
          .setURL("https://discord.zyner.org")
      );

      const cooldownEmbed = new EmbedBuilder()
        .setAuthor({ name: "⚠️ | Request Failed" })
        .setDescription(
          `Sorry, but you're currently on cooldown. Please try again later.\n\nRemaining cooldown time: ${timeLeft}`
        )
        .setColor("#FF6699")
        .setTimestamp()
        .setFooter({ text: `Cooldown ID: ${cooldown.id}` });

      await interaction.reply({
        embeds: [cooldownEmbed],
        components: [buttons],
      });
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
