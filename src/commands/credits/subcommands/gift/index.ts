import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import deferReply from "../../../../helpers/deferReply";
import upsertGuildMember from "../../../../helpers/upsertGuildMember";
import credits from "../../../../modules/credits";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("gift")
    .setDescription("Gift credits to an account")
    .addUserOption((option) =>
      option
        .setName("account")
        .setDescription("The account you want to gift to")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount you want to gift")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(2147483647)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Your personalized message to the account")
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, true);

  const { options, user, guild } = interaction;
  const recipient = options.getUser("account");
  const amount = options.getInteger("amount");
  const message = options.getString("message");

  if (!guild || !user || !recipient) {
    throw new Error("Invalid interaction data");
  }

  if (typeof amount !== "number" || amount < 1) {
    throw new Error("Please enter a valid number of credits to gift");
  }

  await upsertGuildMember(guild, user);

  await credits.transfer(guild, user, recipient, amount);

  const recipientAccount = await credits.balance(guild, recipient);
  const senderAccount = await credits.balance(guild, user);

  const recipientEmbed = new EmbedBuilder()
    .setTimestamp()
    .setTitle("🎉 You've Received a Special Gift! 🎁")
    .setColor(process.env.EMBED_COLOR_SUCCESS)
    .setDescription(`You've received a gift of ${amount} credits!`)
    .setFooter({
      text: `Sent by ${user.username}`,
      iconURL: user.displayAvatarURL(),
    });

  if (message) {
    recipientEmbed.addFields({ name: "Message", value: message });
  }

  await recipient.send({
    embeds: [
      recipientEmbed.addFields({
        name: "New Balance",
        value: `Your balance now contains ${recipientAccount.balance} credits!`,
      }),
    ],
  });

  const senderEmbed = new EmbedBuilder()
    .setTimestamp()
    .setTitle("🎁 You've Sent an Amazing Surprise Gift! 🎉")
    .setColor(process.env.EMBED_COLOR_SUCCESS)
    .setDescription(`Your gift has been sent.`)
    .setFooter({
      text: `Sent to ${recipient.username}`,
      iconURL: recipient.displayAvatarURL(),
    });

  if (message) {
    senderEmbed.addFields({ name: "Message", value: message });
  }

  await interaction.editReply({
    embeds: [
      senderEmbed.addFields({
        name: "New Balance",
        value: `Your balance now contains ${senderAccount.balance} credits!`,
      }),
    ],
  });
};
