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
    .setName("give")
    .setDescription("Give credits to a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to give credits to.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription(`The amount of credits to give.`)
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

  const discordReceiver = options.getUser("user");
  const creditsAmount = options.getInteger("amount");

  if (!discordReceiver || typeof creditsAmount !== "number") {
    await interaction.editReply("Invalid user or credit amount provided.");
    return;
  }

  const embedSuccess = new EmbedBuilder()
    .setColor(process.env.EMBED_COLOR_SUCCESS) // Blue color for an administrative look
    .setAuthor({ name: "Administrative Action" }) // Update the author name
    .setDescription(
      `Successfully granted ${creditsAmount} credits to the user. This is an administrative action.`
    ) // Modify the description to convey authority
    .setFooter({
      text: `Action by ${user.username}`,
      iconURL: user.displayAvatarURL(),
    })
    .setTimestamp();

  await economy.give(guild, discordReceiver, creditsAmount);

  await interaction.editReply({ embeds: [embedSuccess] });
};
