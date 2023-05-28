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
    .setName("create")
    .setDescription("Give credits to a user.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to send in")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Message it should say")
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

  const message = interaction.options.getString("message");

  if (!message) {
    await sendResponse(interaction, "Please provide a message to send.");
    return;
  }

  try {
    await textChannel.send(message);
    await sendResponse(interaction, "Message sent successfully.");
  } catch (error) {
    console.error(`Error sending message: ${error}`);
    await sendResponse(
      interaction,
      "An error occurred while sending the message."
    );
  }
};
