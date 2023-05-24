import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import sendResponse from "../../../../utils/sendResponse";

export default async function handleButtonInteraction(
  interaction: ButtonInteraction
) {
  const { customId } = interaction;

  const currentButton = await import(`../../../buttons/${customId}`);

  if (!currentButton) {
    throw new Error(`Unknown button ${customId}`);
  }

  try {
    await currentButton.execute(interaction);
  } catch (error) {
    await handleButtonError(interaction, error);
  }
}

async function handleButtonError(interaction: ButtonInteraction, error: any) {
  const buttons = createButtons();

  const errorEmbed = createErrorEmbed(error.message);

  await sendResponse(interaction, {
    embeds: [errorEmbed],
    components: [buttons],
  });
}

function createButtons() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("Report Problem")
      .setStyle(ButtonStyle.Link)
      .setEmoji("✏️")
      .setURL("https://discord.zyner.org")
  );
}

function createErrorEmbed(errorMessage: string) {
  return new EmbedBuilder()
    .setAuthor({ name: "⚠️ | Request Failed" })
    .setDescription(
      "An error occurred while processing your request. Please try again later."
    )
    .addFields({ name: "Error Details", value: `\`${errorMessage}\`` })
    .setColor(process.env.EMBED_COLOR_SUCCESS)
    .setTimestamp();
}
