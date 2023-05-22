import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

export default async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const { client, commandName } = interaction;

  const currentCommand = client.commands.get(commandName);
  if (!currentCommand) {
    throw new Error("Command unavailable");
  }

  try {
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
      .addFields({ name: "Error Details", value: `\`${error.message}\`` })
      .setColor("#895aed")
      .setTimestamp();

    return interaction.editReply({
      embeds: [errorEmbed],
      components: [buttons],
    });
  }
};
