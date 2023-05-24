import { ChatInputCommandInteraction } from "discord.js";
import logger from "../middlewares/logger";

export default async (
  interaction: ChatInputCommandInteraction,
  response: any
) => {
  try {
    if (interaction.deferred) {
      await interaction.editReply(response);
    } else {
      await interaction.reply(response);
    }
  } catch (error) {
    logger.error("Error occurred while sending the response:", error);
  }
};
