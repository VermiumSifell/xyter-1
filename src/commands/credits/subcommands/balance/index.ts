import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import deferReply from "../../../../helpers/deferReply";
import credits from "../../../../modules/credits";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("balance")
    .setDescription(`View account balance`)
    .addUserOption((option) =>
      option
        .setName("account")
        .setDescription(
          `Here you can enter the username of another user to check their balance`
        )
    );
};

export const execute = async (interaction: CommandInteraction) => {
  const { options, user, guild } = interaction;
  await deferReply(interaction, true);

  if (!guild) {
    throw new Error(
      "Apologies, but this command is restricted to guild environments only. ❌"
    );
  }

  const checkAccount = options.getUser("account") || user;
  const creditAccount = await credits.balance(guild, checkAccount);

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setTimestamp(new Date())
        .setAuthor({ name: "💳 Balance" })
        .setColor(process.env.EMBED_COLOR_SUCCESS)
        .setFooter({
          text: `Requested by ${user.username}`,
          iconURL: user.displayAvatarURL(),
        }).setDescription(`
   ${checkAccount.id !== user.id ? `${checkAccount} has` : `You have`} ${
        creditAccount.balance
      } credits. 💰`),
    ],
  });
};
