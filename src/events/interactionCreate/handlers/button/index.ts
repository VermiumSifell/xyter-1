import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import getEmbedData from "../../../../helpers/getEmbedConfig";

export default async (interaction: ButtonInteraction) => {
  const { errorColor, footerText, footerIcon } = await getEmbedData(
    interaction.guild
  );
  const { customId } = interaction;

  const currentButton = await import(`../../../buttons/${customId}`);

  if (!currentButton) {
    throw new Error(`Unknown button ${customId}`);
  }

  try {
    await currentButton.execute(interaction);
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
