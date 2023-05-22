import { BaseInteraction, EmbedBuilder } from "discord.js";

export default async (interaction: BaseInteraction, ephemeral: boolean) => {
  if (!interaction.isRepliable()) {
    throw new Error("Failed to reply to your request.");
  }

  await interaction.deferReply({ ephemeral });

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setTimestamp(new Date())
        .setTitle("🎉︱Hold on tight!")
        .setDescription(
          "We're working our magic. This might take a while, so prepare to be amazed! ✨"
        ),
    ],
  });
};
