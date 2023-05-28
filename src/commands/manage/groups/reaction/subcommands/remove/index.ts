import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ComponentType,
  MessageActionRowComponentBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import prisma from "../../../../../../handlers/prisma";
import logger from "../../../../../../utils/logger";
import sendResponse from "../../../../../../utils/sendResponse";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("remove")
    .setDescription("Remove a reaction role from a message.")
    .addStringOption((option) =>
      option
        .setName("message-id")
        .setDescription("ID of the message to remove the reaction role from")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to assign")
        .setRequired(true)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const messageId = interaction.options.getString("message-id");
  const role = interaction.options.getRole("role");

  if (!messageId || !role) {
    await sendResponse(
      interaction,
      "Please provide a valid message ID and role."
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

    const existingRows =
      message.components?.filter(
        (component) => component.type === ComponentType.ActionRow
      ) || [];

    let found = false;
    // const updatedRows: (
    //   | JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>>
    //   | ActionRowData<
    //       MessageActionRowComponentData | MessageActionRowComponentBuilder
    //     >
    //   | APIActionRowComponent<APIMessageActionRowComponent>
    // )[] = [];

    const updatedRows =
      new ActionRowBuilder<MessageActionRowComponentBuilder>();

    logger.info({ existingRows });

    existingRows.forEach((oldRow) => {
      logger.debug({ oldRow });
      logger.silly({ oldRowComponents: oldRow.components[0] });
      const filteredComponents = oldRow.components.filter(
        (component) =>
          component.type === ComponentType.Button &&
          !component.customId?.startsWith(`toggle:${message.id}:${role.id}`)
      );

      if (filteredComponents.length > 0) {
        // const newRow = new ActionRowBuilder().addComponents(
        //   ...filteredComponents
        // );

        // const newRow = new ActionRowBuilder<MessageActionRowComponentBuilder>({
        //   components: filteredComponents,
        // });
        const newRow = new ActionRowBuilder();

        logger.debug({ newRow });
        console.log("newRow", newRow.components[0]);

        console.log("filteredComponents", filteredComponents);

        updatedRows.addComponents(filteredComponents);
      } else {
        found = true; // Set found to true if there are no buttons left in the row
        logger.error({ filteredComponents: filteredComponents });
      }
    });

    if (!found) {
      await sendResponse(
        interaction,
        "Reaction role not found for the specified emoji."
      );
      return;
    }

    console.log(updatedRows[0]);

    console.log("updatedRows", updatedRows);

    await message.edit({ components: updatedRows });

    if (!interaction.guild) return;

    await prisma.guildReactionRole.deleteMany({
      where: {
        guildId: interaction.guild.id,
        messageId,
        roleId: role.id,
      },
    });
  } catch (error: unknown) {
    // console.log(error.requestBody.json.components);
    console.log(error);
    throw error;
  }
};
