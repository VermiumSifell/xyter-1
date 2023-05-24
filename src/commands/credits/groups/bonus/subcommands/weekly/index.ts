import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import prisma from "../../../../../../handlers/prisma";
import deferReply from "../../../../../../helpers/deferReply";
import generateCooldownName from "../../../../../../helpers/generateCooldownName";
import cooldown from "../../../../../../managers/cooldown";
import economy from "../../../../../../modules/credits";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("weekly")
    .setDescription("Claim your weekly treasure!");
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { guild, user } = interaction;

  await deferReply(interaction, false);

  if (!guild) {
    throw new Error(
      "Oops! It looks like you're not part of a guild. Join a guild to embark on this adventure!"
    );
  }

  if (!user) {
    throw new Error(
      "Oops! We couldn't find your user information. Please try again or contact support for assistance."
    );
  }

  const guildCreditsSettings = await prisma.guildCreditsSettings.upsert({
    where: { id: guild.id },
    update: {},
    create: { id: guild.id },
  });

  const weeklyBonusAmount = guildCreditsSettings.weeklyBonusAmount;
  const userEconomy = await economy.give(guild, user, weeklyBonusAmount);

  const embed = new EmbedBuilder()
    .setColor(process.env.EMBED_COLOR_SUCCESS)
    .setAuthor({
      name: "🌟 Weekly Treasure Claimed",
    })
    .setThumbnail(user.displayAvatarURL())
    .setDescription(
      `You've just claimed your weekly treasure of **${weeklyBonusAmount} credits**! 🎉\nEmbark on an epic adventure and spend your riches wisely.\n\n💰 **Your balance**: ${userEconomy.balance} credits`
    )
    .setFooter({
      text: `Claimed by ${user.username}`,
      iconURL: user.displayAvatarURL() || "",
    })
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });

  const cooldownDuration = 24 * 60 * 60; // 24 hours in seconds
  const cooldownName = await generateCooldownName(interaction);
  await cooldown.setGuildMemberCooldown(
    cooldownName,
    guild,
    user,
    cooldownDuration
  );
};
