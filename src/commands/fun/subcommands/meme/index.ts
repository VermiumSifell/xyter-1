import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
  TextChannel,
} from "discord.js";
import deferReply from "../../../../helpers/deferReply";
import CooldownManager from "../../../../managers/cooldown";
import logger from "../../../../middlewares/logger";

const cooldownManager = new CooldownManager();

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command.setName("meme").setDescription("Random memes from r/memes");
};

export const execute = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  await deferReply(interaction, false);

  const { channel, guild, user } = interaction;
  const cooldownItem = "meme";
  const cooldownDuration = 10 * 1000; // 10 seconds

  try {
    const cooldownActiveGuild = await cooldownManager.checkGuildMemberCooldown(
      cooldownItem,
      guild?.id ?? "",
      user.id
    );
    const cooldownActiveDM = await cooldownManager.checkUserCooldown(
      cooldownItem,
      user.id
    );

    if (cooldownActiveGuild !== null || cooldownActiveDM !== null) {
      logger.verbose(
        `Guild: ${guild?.id} User: ${user.id} Name: ${cooldownItem} User is on cooldown`
      );

      const timeLeft = formatDistanceToNow(
        (cooldownActiveGuild?.expiresAt || cooldownActiveDM?.expiresAt) ??
          new Date(),
        {
          includeSeconds: true,
        }
      );

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
        .setFooter({
          text: `Cooldown ID: ${
            cooldownActiveGuild?.id || cooldownActiveDM?.id
          }`,
        });

      await interaction.editReply({
        embeds: [cooldownEmbed],
        components: [buttons],
      });
      return;
    }

    const res = await axios.get("https://www.reddit.com/r/memes/random/.json");
    const response = res.data[0].data.children;
    const content = response[0].data;

    // Check if the channel is a text channel and if it's NSFW
    if (channel instanceof TextChannel && channel.nsfw && content.over_18) {
      return execute(interaction); // Fetch a new meme
    }

    const authorRes = await axios.get(
      `https://www.reddit.com/user/${content.author}/about.json`
    );
    const authorData = authorRes.data.data;

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("View post")
        .setStyle(ButtonStyle.Link)
        .setEmoji("🔗")
        .setURL(`https://reddit.com${content.permalink}`)
    );

    const embed = new EmbedBuilder()
      .setAuthor({ name: content.title })
      .setTimestamp()
      .setImage(content.url)
      .setFooter({
        text: `Meme by ${content.author} | 👍 ${content.ups}`,
        iconURL: authorData.icon_img.split("?").shift(),
      })
      .setColor(process.env.EMBED_COLOR_SUCCESS);

    await interaction.editReply({ embeds: [embed], components: [buttons] });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setTitle("Error")
      .setDescription(
        "Sorry, we couldn't fetch a meme at the moment. Please try again later."
      )
      .setColor("#ff0000");

    await interaction.editReply({ embeds: [errorEmbed], components: [] });
  }

  if (guild) {
    await cooldownManager.setGuildMemberCooldown(
      cooldownItem,
      guild.id,
      user.id,
      cooldownDuration
    );
  } else {
    await cooldownManager.setUserCooldown(
      cooldownItem,
      user.id,
      cooldownDuration
    );
  }
};
