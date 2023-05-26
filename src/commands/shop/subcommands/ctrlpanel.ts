import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Message,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { v4 as uuidv4 } from "uuid";
import credits from "../../../modules/credits";
import CtrlPanelAPI from "../../../services/CtrlPanelAPI";
import deferReply from "../../../utils/deferReply";
import sendResponse from "../../../utils/sendResponse";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("ctrlpanel")
    .setDescription("Buy cpgg power.")
    .addIntegerOption((option) =>
      option
        .setName("withdraw")
        .setDescription("How much credits you want to withdraw.")
        .setRequired(true)
        .setMinValue(100)
        .setMaxValue(999999)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options, guild, user, client } = interaction;
  await deferReply(interaction, true);
  if (!guild) throw new Error("This command can only be executed in a guild");

  const ctrlPanelAPI = new CtrlPanelAPI(guild);

  const successColor = "#FFFFFF"; // Replace with the actual success color
  const footerText = "YOUR_FOOTER_TEXT"; // Replace with the actual footer text
  const footerIcon = "YOUR_FOOTER_ICON_URL"; // Replace with the actual footer icon URL

  const withdrawAmount = options.getInteger("withdraw");
  if (!withdrawAmount) throw new Error("You must specify a withdraw amount");

  // if (!apiCredentials) {
  //   throw new Error(
  //     "Please ask the server administrator to configure the API credentials for CtrlPanel.gg to enable this functionality."
  //   );
  // }

  const userDM = await client.users.fetch(user.id);
  const code = uuidv4();
  const { redeemUrl } = await ctrlPanelAPI.generateVoucher(
    code,
    withdrawAmount,
    1
  );

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("Redeem it here")
      .setStyle(ButtonStyle.Link)
      .setEmoji("🏦")
      .setURL(`${redeemUrl}`)
  );

  await credits.take(guild, user, withdrawAmount);

  const dmEmbed = new EmbedBuilder()
    .setTitle(":shopping_cart:︱CPGG")
    .setDescription(`This voucher was generated in guild: **${guild.name}**.`)
    .setTimestamp()
    .addFields({
      name: "💶 Credits",
      value: `${withdrawAmount}`,
      inline: true,
    })
    .setColor(successColor)
    .setFooter({ text: footerText, iconURL: footerIcon });

  await userDM
    .send({
      embeds: [dmEmbed],
      components: [buttons],
    })
    .then(async (msg: Message) => {
      const interactionEmbed = new EmbedBuilder()
        .setTitle(":shopping_cart:︱CPGG")
        .setDescription(`I have sent you the code in [DM](${msg.url})!`)
        .setTimestamp()
        .setColor(successColor)
        .setFooter({ text: footerText, iconURL: footerIcon });

      await sendResponse(interaction, { embeds: [interactionEmbed] });
    });

  return true;
};
