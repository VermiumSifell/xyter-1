import axios from "axios";
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
import generateCooldownName from "../../../../helpers/generateCooldownName";
import CooldownManager from "../../../../managers/cooldown";

const cooldownManager = new CooldownManager();

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command.setName("meme").setDescription("Random memes from r/memes");
};

export const execute = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  await deferReply(interaction, false);

  const { channel, guild, user } = interaction;
  const cooldownItem = await generateCooldownName(interaction);
  const cooldownDuration = 15; // 10 seconds

  try {
    const content = await fetchRandomMeme();

    // Check if the channel is a text channel and if it's NSFW
    if (channel instanceof TextChannel && channel.nsfw && content.over_18) {
      return execute(interaction); // Fetch a new meme
    }

    const authorData = await fetchAuthorData(content.author);

    const buttons = createButtons(content.permalink);
    const embed = createEmbed(content, authorData);

    await interaction.editReply({ embeds: [embed], components: [buttons] });
  } catch (error) {
    throw new Error(
      "Sorry, we couldn't fetch a meme at the moment. Please try again later."
    );
  }

  if (guild) {
    await cooldownManager.setGuildMemberCooldown(
      cooldownItem,
      guild,
      user,
      cooldownDuration
    );
  } else {
    await cooldownManager.setUserCooldown(cooldownItem, user, cooldownDuration);
  }
};

async function fetchRandomMeme() {
  const res = await axios.get("https://www.reddit.com/r/memes/random/.json");
  const response = res.data[0].data.children;
  const content = response[0].data;
  return content;
}

async function fetchAuthorData(author: any) {
  const authorRes = await axios.get(
    `https://www.reddit.com/user/${author}/about.json`
  );
  const authorData = authorRes.data.data;
  return authorData;
}

function createButtons(permalink: string) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("View post")
      .setStyle(ButtonStyle.Link)
      .setEmoji("🔗")
      .setURL(`https://reddit.com${permalink}`)
  );
}

function createEmbed(content: any, authorData: any) {
  return new EmbedBuilder()
    .setAuthor({ name: content.title })
    .setTimestamp()
    .setImage(content.url)
    .setFooter({
      text: `Meme by ${content.author} | 👍 ${content.ups}`,
      iconURL: authorData.icon_img.split("?").shift(),
    })
    .setColor(process.env.EMBED_COLOR_SUCCESS);
}
