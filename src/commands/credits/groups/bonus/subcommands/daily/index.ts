import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import deferReply from "../../../../../../helpers/deferReply";
import { setInteraction } from "../../../../../../helpers/setCooldown";
import economy from "../../../../../../modules/credits";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command.setName("daily").setDescription("Get daily bonus.");
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

  const dailyBonus = 25; // Daily bonus amount
  await economy.give(guild, user, dailyBonus);

  const embed = new EmbedBuilder()
    .setColor(process.env.EMBED_COLOR_SUCCESS)
    .setDescription(
      `🎉 You claimed your daily bonus of **${dailyBonus} credits**!`
    )
    .setAuthor({
      name: "Daily Bonus Claimed",
    })
    .setTimestamp()
    .setFooter({
      text: `Claimed by ${user.username}`,
      iconURL: user.displayAvatarURL() || "",
    });

  await interaction.editReply({ embeds: [embed] });

  setInteraction(interaction, 24 * 60 * 60); // Set cooldown for 24 hours
};
