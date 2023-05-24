import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import deferReply from "../../../../helpers/deferReply";
import credits from "../../../../modules/credits";
import sendResponse from "../../../../utils/sendResponse";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("balance")
    .setDescription(`View account balance`)
    .addUserOption((option) =>
      option
        .setName("account")
        .setDescription(
          "Enter the username of another user to check their balance"
        )
    );
};

export const execute = async (interaction: CommandInteraction) => {
  const { options, user, guild } = interaction;
  await deferReply(interaction, true);

  if (!guild) {
    throw new Error("This command can only be used in guild environments. ❌");
  }

  const checkAccount = options.getUser("account") || user;
  const creditAccount = await credits.balance(guild, checkAccount);

  let description = `${
    checkAccount.id !== user.id
      ? `${checkAccount} currently has`
      : "You currently have"
  } ${creditAccount.balance} credits. 💰\n\n`;

  if (creditAccount.balance === 0) {
    description += `${
      checkAccount.id !== user.id ? "Their" : "Your"
    } wallet is empty. Encourage ${
      checkAccount.id !== user.id ? "them" : "yourself"
    } to start earning credits by participating in community events and challenges!`;
  } else if (creditAccount.balance < 100) {
    description += `${
      checkAccount.id !== user.id ? "They're" : "You're"
    } making progress! Keep earning credits and unlock exciting rewards.`;
  } else if (creditAccount.balance < 500) {
    description += `${
      checkAccount.id !== user.id ? "Great job! Their" : "Great job! Your"
    } account balance is growing. ${
      checkAccount.id !== user.id ? "They're" : "You're"
    } on ${
      checkAccount.id !== user.id ? "their" : "your"
    } way to becoming a credit millionaire!`;
  } else {
    description += `${
      checkAccount.id !== user.id ? "Wow! They're" : "Wow! You're"
    } a credit master with a substantial account balance. Enjoy the perks and exclusive benefits!`;
  }

  await sendResponse(interaction, {
    embeds: [
      new EmbedBuilder()
        .setColor("#FDD835")
        .setAuthor({ name: "💳 Account Balance" })
        .setDescription(description)
        .setThumbnail(checkAccount.displayAvatarURL())
        .setFooter({
          text: `${
            checkAccount.id !== user.id ? "Their" : "Your"
          } credit balance reflects ${
            checkAccount.id !== user.id ? "their" : "your"
          } community engagement!`,
        })
        .setTimestamp(),
    ],
  });
};
