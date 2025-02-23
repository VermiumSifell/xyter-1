import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import checkPermission from "../../../../helpers/checkPermission";
import getEmbedConfig from "../../../../helpers/getEmbedData";
import logger from "../../../../middlewares/logger";

export default {
  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("welcome")
      .setDescription("Welcome")
      .addBooleanOption((option) =>
        option
          .setName("status")
          .setDescription("Should welcome be enabled?")
          .setRequired(true)
      )
      .addChannelOption((option) =>
        option
          .setName("join-channel")
          .setDescription("Channel for join messages.")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )

      .addChannelOption((option) =>
        option
          .setName("leave-channel")
          .setDescription("Channel for leave messages.")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )

      .addStringOption((option) =>
        option
          .setName("leave-message")
          .setDescription("Message for leave messages.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("join-message")
          .setDescription("Message for join messages.")
          .setRequired(true)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    await deferReply(interaction, true);

    checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );
    const { options, guild } = interaction;

    const status = options?.getBoolean("status");
    const joinChannel = options?.getChannel("join-channel");
    const leaveChannel = options?.getChannel("leave-channel");
    const joinChannelMessage = options?.getString("join-message");
    const leaveChannelMessage = options?.getString("leave-message");

    if (!guild) throw new Error("Guild not found");
    if (status === null) throw new Error("Status not specified");
    if (!joinChannel) throw new Error("Join channel not specified");
    if (!joinChannelMessage)
      throw new Error("Join channel message not specified");
    if (!leaveChannel) throw new Error("Leave channel not specified");
    if (!leaveChannelMessage)
      throw new Error("Leave channel message not specified");

    const createGuild = await prisma.guild.upsert({
      where: {
        id: guild.id,
      },
      update: {
        welcomeEnabled: status,
        welcomeJoinChannelId: joinChannel.id,
        welcomeJoinChannelMessage: joinChannelMessage,
        welcomeLeaveChannelId: leaveChannel.id,
        welcomeLeaveChannelMessage: leaveChannelMessage,
      },
      create: {
        id: guild.id,
        welcomeEnabled: status,
        welcomeJoinChannelId: joinChannel.id,
        welcomeJoinChannelMessage: joinChannelMessage,
        welcomeLeaveChannelId: leaveChannel.id,
        welcomeLeaveChannelMessage: leaveChannelMessage,
      },
    });

    logger.silly(createGuild);

    const interactionEmbedDisabled = new EmbedBuilder()
      .setTitle("[:tools:] Welcome")
      .setDescription(
        "This module is currently disabled, please enable it to continue."
      )
      .setColor(successColor)
      .setTimestamp()
      .setFooter({
        iconURL: footerIcon,
        text: footerText,
      });

    if (!createGuild.welcomeEnabled) {
      return interaction?.editReply({
        embeds: [interactionEmbedDisabled],
      });
    }

    const interactionEmbed = new EmbedBuilder()
      .setTitle("[:tools:] Welcome")
      .setDescription(
        `The following configuration will be used.

        [👋] **Welcome**

        ㅤ**Channel**: <#${createGuild.welcomeJoinChannelId}>
        ㅤ**Message**: ${createGuild.welcomeJoinChannelMessage}

        [🚪] **Leave**

        ㅤ**Channel**: <#${createGuild.welcomeLeaveChannelId}>
        ㅤ**Message**: ${createGuild.welcomeLeaveChannelMessage}`
      )
      .setColor(successColor)
      .setTimestamp()
      .setFooter({
        iconURL: footerIcon,
        text: footerText,
      });

    await interaction?.editReply({
      embeds: [interactionEmbed],
    });
    return true;
  },
};
