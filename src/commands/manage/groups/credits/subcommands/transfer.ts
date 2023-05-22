import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import checkPermission from "../../../../../helpers/checkPermission";
import deferReply from "../../../../../helpers/deferReply";
import economy from "../../../../../modules/credits";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("transfer")
    .setDescription("Transfer credits from a user to another.")
    .addUserOption((option) =>
      option
        .setName("from-user")
        .setDescription("The user to take credits from.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("to-user")
        .setDescription("The user to give credits to.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription(`The amount of credits to set.`)
        .setRequired(true)
    );
};

export const execute = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  const { guild, options, user } = interaction;

  await deferReply(interaction, false);
  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

  if (!guild) {
    throw new Error("We could not get the current guild from Discord.");
  }

  const fromUser = options.getUser("from-user");
  const toUser = options.getUser("to-user");
  const creditsAmount = options.getInteger("amount");

  if (!fromUser || !toUser || typeof creditsAmount !== "number") {
    throw new Error("Invalid user(s) or credit amount provided.");
  }

  const embedSuccess = new EmbedBuilder()
    .setColor("#895aed") // Blue color for an administrative look
    .setAuthor({ name: "Administrative Action" }) // Update the author name
    .setDescription(
      `Successfully transferred ${creditsAmount} credits from ${fromUser.username} to ${toUser.username}. This is an administrative action.`
    ) // Modify the description to convey authority
    .setFooter({
      text: `Action by ${user.username}`,
      iconURL: user.displayAvatarURL(),
    })
    .setTimestamp();

  await economy.transfer(guild, fromUser, toUser, creditsAmount);

  await interaction.editReply({ embeds: [embedSuccess] });
};
