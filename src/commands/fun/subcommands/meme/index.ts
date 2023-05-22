import axios from "axios";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
  TextChannel,
} from "discord.js";
import deferReply from "../../../../helpers/deferReply";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command.setName("meme").setDescription("Random memes from r/memes");
};

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  await deferReply(interaction, false);

  const { guild, user, channel } = interaction;
  if (!guild) throw new Error("Server unavailable");
  if (!user) throw new Error("User unavailable");

  try {
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
      .setColor("#895aed");

    await interaction.editReply({ embeds: [embed], components: [buttons] });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setTitle("Error")
      .setDescription(
        "Sorry, we couldn't fetch a meme at the moment. Please try again later."
      )
      .setColor("#ff0000");

    await interaction.editReply({ embeds: [errorEmbed] });
  }
};
