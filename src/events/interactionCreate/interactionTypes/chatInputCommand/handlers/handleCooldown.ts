import { Cooldown } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import sendResponse from "../../../../../utils/sendResponse";

export default async function handleCooldown(
  interaction: ChatInputCommandInteraction,
  guildCooldown: Cooldown | null,
  userCooldown: Cooldown | null,
  guildMemberCooldown: Cooldown | null
) {
  const cooldown = guildCooldown || userCooldown || guildMemberCooldown;

  if (!cooldown || !cooldown.expiresAt) {
    return;
  }

  const timeLeft = formatDistanceToNow(cooldown.expiresAt, {
    includeSeconds: true,
  });

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("Report Problem")
      .setStyle(ButtonStyle.Link)
      .setEmoji("✏️")
      .setURL("https://discord.zyner.org")
  );

  const cooldownEmbed = new EmbedBuilder()
    .setAuthor({ name: "⚠️ | Request Failed" })
    .setDescription(
      `Sorry, but you're currently on cooldown. Please try again later.\n\nRemaining cooldown time: ${timeLeft}`
    )
    .setColor("#FF6699")
    .setTimestamp()
    .setFooter({ text: `Cooldown ID: ${cooldown.id}` });

  const response = {
    embeds: [cooldownEmbed],
    components: [buttons],
  };

  await sendResponse(interaction, response);
}
