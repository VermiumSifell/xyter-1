import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import logger from "../../../../../middlewares/logger";
import sendResponse from "../../../../../utils/sendResponse";

export default async function handleUnavailableCommand(
  interaction: ChatInputCommandInteraction,
  commandName: string
) {
  logger.error(`Command '${commandName}' is unavailable`);

  const errorEmbed = new EmbedBuilder()
    .setAuthor({ name: "⚠️ | Request Failed" })
    .setDescription("Sorry, the command is currently unavailable.")
    .setColor("#FFCC66")
    .setTimestamp();

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("Report Problem")
      .setStyle(ButtonStyle.Link)
      .setEmoji("✏️")
      .setURL("https://discord.zyner.org")
  );

  const response = {
    embeds: [errorEmbed],
    components: [buttons],
  };

  await sendResponse(interaction, response);
}
