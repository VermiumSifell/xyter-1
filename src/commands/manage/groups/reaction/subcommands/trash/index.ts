import {
  ChannelType,
  ChatInputCommandInteraction,
  GuildTextBasedChannel,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import sendResponse from "../../../../../../utils/sendResponse";

export const builder = (
  command: SlashCommandSubcommandBuilder
): SlashCommandSubcommandBuilder => {
  return command
    .setName("trash")
    .setDescription("Delete a message in a text channel.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to delete the message from")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("ID of the message to delete")
        .setRequired(true)
    );
};

export const execute = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  const channel = interaction.options.getChannel("channel");

  if (!channel || channel.type !== ChannelType.GuildText) {
    await sendResponse(
      interaction,
      "Invalid channel provided. Please select a valid text channel."
    );
    return;
  }

  const textChannel = channel as GuildTextBasedChannel;

  const messageId = interaction.options.getString("message");

  if (!messageId) {
    await sendResponse(interaction, "Please provide a message ID to delete.");
    return;
  }

  try {
    const message = await textChannel.messages.fetch(messageId);
    if (message) {
      await message.delete();
      await sendResponse(interaction, "Message deleted successfully.");
    } else {
      await sendResponse(
        interaction,
        "Message not found. Please provide a valid message ID."
      );
    }
  } catch (error) {
    console.error(`Error deleting message: ${error}`);
    await sendResponse(
      interaction,
      "An error occurred while deleting the message."
    );
  }
};
