import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import deferReply from "../../../helpers/deferReply";
import * as reputation from "../../../modules/reputation";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("repute")
    .setDescription("Repute a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you repute")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type of reputation")
        .setRequired(true)
        .addChoices(
          { name: "Positive", value: "positive" },
          { name: "Negative", value: "negative" }
        )
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options, user, guild } = interaction;
  await deferReply(interaction, true);
  if (!guild) throw new Error("This command can only be used in guilds");

  const reputationUser = options.getUser("user");
  const reputationType = options.getString("type", true);

  if (!reputationUser) {
    throw new Error(
      "Sorry, we were unable to find the user you are trying to give reputation to."
    );
  }

  if (!(reputationType === "positive" || reputationType === "negative")) {
    throw new Error("Invalid reputation type");
  }

  if (user.id === reputationUser.id) {
    throw new Error("It is not possible to give yourself reputation.");
  }

  await reputation.repute(reputationUser, reputationType);

  let emoji = "";
  if (reputationType === "positive") {
    emoji = "😊";
  } else if (reputationType === "negative") {
    emoji = "😔";
  }

  const interactionMessage = `You have successfully given ${emoji} ${reputationType} reputation to ${reputationUser}!`;

  const interactionEmbed = new EmbedBuilder()
    .setAuthor({
      name: `Reputing ${reputationUser.username}`,
      iconURL: reputationUser.displayAvatarURL(),
    })
    .setDescription(interactionMessage)
    .setTimestamp()
    .setColor("#895aed");

  await interaction.editReply({ embeds: [interactionEmbed] });
};
