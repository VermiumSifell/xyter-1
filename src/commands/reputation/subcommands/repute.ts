import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import cooldown from "../../../handlers/CooldownManager";
import reputation from "../../../handlers/ReputationManager";
import deferReply from "../../../helpers/deferReply";
import generateCooldownName from "../../../helpers/generateCooldownName";
import sendResponse from "../../../utils/sendResponse";

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

  if (!guild) {
    throw new Error("This command can only be used in guilds");
  }

  const targetUser = options.getUser("user", true);
  const reputationType = options.getString("type", true);

  if (!targetUser) {
    throw new Error(
      "Sorry, we were unable to find the user you are trying to give reputation to."
    );
  }

  if (reputationType !== "positive" && reputationType !== "negative") {
    throw new Error("Invalid reputation type");
  }

  if (user.id === targetUser.id) {
    throw new Error("It is not possible to give yourself reputation.");
  }

  await reputation.repute(targetUser, reputationType);

  const emoji = reputationType === "positive" ? "😊" : "😔";

  const interactionMessage = `You have successfully given ${emoji} ${reputationType} reputation to ${targetUser}!`;

  const interactionEmbed = new EmbedBuilder()
    .setAuthor({
      name: `Reputing ${targetUser.username}`,
      iconURL: targetUser.displayAvatarURL(),
    })
    .setDescription(interactionMessage)
    .setTimestamp()
    .setColor(process.env.EMBED_COLOR_SUCCESS);

  await sendResponse(interaction, {
    embeds: [interactionEmbed],
  });

  await cooldown.setGuildMemberCooldown(
    await generateCooldownName(interaction),
    guild,
    user,
    24 * 60 * 60
  );
};
