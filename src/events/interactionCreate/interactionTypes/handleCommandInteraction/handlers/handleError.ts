import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  codeBlock,
} from "discord.js";
import logger from "../../../../../utils/logger";
import sendResponse from "../../../../../utils/sendResponse";

export default async function handleError(
  interaction: CommandInteraction,
  commandName: string,
  error: unknown
) {
  if (error instanceof Error) {
    await handleCommandError(error);
  } else {
    handleUnknownError();
  }

  async function handleCommandError(error: Error) {
    logger.error(`Error occurred in command '${commandName}':`, error);

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Report Problem")
        .setStyle(ButtonStyle.Link)
        .setEmoji("✏️")
        .setURL("https://discord.zyner.org")
    );

    const errorDetailsValue =
      process.env.NODE_ENV === "development" && error.stack !== undefined
        ? `${codeBlock(error.stack)}`
        : `${codeBlock(error.message ?? "Unknown error")}`;

    const errorEmbed = new EmbedBuilder()
      .setAuthor({ name: "⚠️ | Request Failed" })
      .setDescription(
        "An error occurred while processing your request. Please try again later."
      )
      .addFields({
        name: "Error Details",
        value: errorDetailsValue,
      })
      .setColor("#FFCC66")
      .setTimestamp();

    const response = {
      embeds: [errorEmbed],
      components: [buttons],
    };

    await sendResponse(interaction, response);
  }

  function handleUnknownError() {
    logger.error(`Unknown error occurred in command '${commandName}'`);
    // Handle the case when the error is not an instance of Error
    // For example, you can log a generic error message or take appropriate action
    // Rest of the error handling logic...
  }
}
