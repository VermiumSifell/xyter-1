import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import deferReply from "../../../../../../helpers/deferReply";
import generateCooldownName from "../../../../../../helpers/generateCooldownName";
import CooldownManager from "../../../../../../managers/cooldown";
import economy from "../../../../../../modules/credits";

const cooldownManager = new CooldownManager();

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command.setName("monthly").setDescription("Get monthly bonus.");
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { guild, user } = interaction;

  await deferReply(interaction, false);

  if (!guild) {
    throw new Error(
      "Oops! It seems like you're not part of a guild. Join a guild to use this command!"
    );
  }

  if (!user) {
    throw new Error(
      "Oops! It looks like we couldn't find your user information. Please try again or contact support for assistance."
    );
  }

  const monthlyBonus = 150; // Monthly bonus amount
  await economy.give(guild, user, monthlyBonus);

  const embed = new EmbedBuilder()
    .setColor(process.env.EMBED_COLOR_SUCCESS)
    .setDescription(
      `🎉 You claimed your monthly bonus of **${monthlyBonus} credits**!`
    )
    .setAuthor({
      name: "Monthly Bonus Claimed",
    })
    .setTimestamp()
    .setFooter({
      text: `Claimed by ${user.username}`,
      iconURL: user.displayAvatarURL() || "",
    });

  await interaction.editReply({ embeds: [embed] });

  await cooldownManager.setGuildMemberCooldown(
    await generateCooldownName(interaction),
    guild,
    user,
    30 * 24 * 60 * 60
  ); // Set cooldown for 30 days
};
