import {
  ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  MessageActionRowComponent,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import prisma from "../../../../../../handlers/prisma";
import logger from "../../../../../../utils/logger";
import sendResponse from "../../../../../../utils/sendResponse";

const MAX_BUTTONS_PER_MESSAGE = 5;

export const builder = (
  command: SlashCommandSubcommandBuilder
): SlashCommandSubcommandBuilder => {
  return command
    .setName("add")
    .setDescription("Add a reaction role to a message.")
    .addStringOption((option) =>
      option
        .setName("message-id")
        .setDescription("ID of the message to add the reaction role to")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("emoji")
        .setDescription("Emoji for the reaction role")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to assign")
        .setRequired(true)
    );
};

export const execute = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  const messageId = interaction.options.getString("message-id");
  const emoji = interaction.options.getString("emoji");
  const role = interaction.options.getRole("role");

  if (!messageId || !emoji || !role) {
    await sendResponse(
      interaction,
      "Please provide a valid message ID, emoji, and role."
    );
    return;
  }

  const channel = interaction.channel;
  if (!channel) {
    await sendResponse(interaction, "Channel not found.");
    return;
  }

  try {
    const message = await channel.messages.fetch(messageId);

    if (!message) {
      await sendResponse(
        interaction,
        "Message not found. Please provide a valid message ID."
      );
      return;
    }

    const existingRows = message.components.filter(
      (component) => component.type === ComponentType.ActionRow
    ) as ActionRow<MessageActionRowComponent>[];

    if (existingRows.length >= MAX_BUTTONS_PER_MESSAGE) {
      await sendResponse(
        interaction,
        "Maximum number of buttons reached for this message."
      );
      return;
    }

    const button = new ButtonBuilder()
      .setCustomId(`toggle:${message.id}:${role.id}`)
      .setLabel(role.name)
      .setEmoji(emoji)
      .setStyle(ButtonStyle.Primary);

    const newRow = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    const newComponents = [...message.components, newRow];

    await message.edit({ components: newComponents });

    if (!interaction.guild) return;

    await prisma.guildReactionRole.create({
      data: { guildId: interaction.guild.id, messageId, roleId: role.id },
    });

    await sendResponse(interaction, "Reaction role added successfully.");
  } catch (error) {
    logger.error("Failed to add reaction role:", error);
    await sendResponse(interaction, "Failed to add reaction role.");
  }
};
