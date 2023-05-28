import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  Guild,
  User,
} from "discord.js";
import fs from "fs";
import interactionErrorHandler from "../../../../handlers/interactionErrorHandler";
import prisma from "../../../../handlers/prisma";

async function handleReactions(
  interaction: ButtonInteraction,
  customId: string,
  user: User,
  guild: Guild
) {
  const [action, messageId, emoji, roleId] = customId.split(":");

  if (action === "toggle") {
    try {
      const message = await interaction.channel?.messages.fetch(messageId);
      const role = guild.roles.cache.get(roleId);

      if (!message || !role) {
        return interaction.reply("Invalid message or role.");
      }

      console.log(customId);

      const reactionRole = await prisma.guildReactionRole.findUnique({
        where: {
          guildId_messageId_roleId: { guildId: guild.id, messageId, roleId },
        },
      });

      if (!reactionRole || reactionRole.roleId !== roleId) {
        return interaction.reply("Invalid reaction role.");
      }

      const member = guild.members.cache.get(user.id);

      if (!member) {
        return interaction.reply("Failed to retrieve member information.");
      }

      if (member.roles.cache.has(roleId)) {
        await interaction.deferReply({ ephemeral: true });

        member.roles.remove(roleId);
        await interaction.editReply(
          `Role **${role.name}** removed successfully.`
        );
      } else {
        await interaction.deferReply({ ephemeral: true });

        member.roles.add(roleId);
        await interaction.editReply(
          `Role **${role.name}** added successfully.`
        );
      }

      const messageWithComponents = message as any;
      const row = messageWithComponents.components.find((component: any) =>
        component.components.some(
          (innerComponent: any) =>
            innerComponent.customId === customId &&
            innerComponent.type === ComponentType.Button
        )
      );

      if (row) {
        const buttonIndex = row.components.findIndex(
          (component: any) =>
            component.customId === customId &&
            component.type === ComponentType.Button
        );

        if (buttonIndex !== -1) {
          const oldButton = row.components[buttonIndex];
          const newButton = new ButtonBuilder()
            .setCustomId(customId)
            .setLabel(role.name)
            .setEmoji(emoji)
            .setStyle(ButtonStyle.Primary);

          row.components.splice(buttonIndex, 1, newButton);

          const newComponents = messageWithComponents.components.map(
            (component: any) => {
              if (component === row) {
                const newRow = new ActionRowBuilder().addComponents(
                  ...row.components
                );
                return newRow;
              }
              return component;
            }
          );

          await messageWithComponents.edit({
            content: "Click the button to toggle the role.",
            components: newComponents,
          });
        } else {
          await interaction.followUp("Failed to update button style.");
        }
      } else {
        await interaction.followUp("Failed to update button style.");
      }
    } catch (error) {
      console.error("Failed to toggle role:", error);
      interaction.reply("Failed to toggle role.");
    }
  }
}

export default async function handleButtonInteraction(
  interaction: ButtonInteraction
) {
  const { customId, user, guild } = interaction;

  const buttonPath = `../../../buttons/${customId}`;

  if (fs.existsSync(buttonPath)) {
    const currentButton = await import(buttonPath);
    try {
      await currentButton.execute(interaction);
    } catch (error) {
      await interactionErrorHandler(interaction, error);
    }
    // Rest of the code for existing button
  } else {
    if (!guild) return;
    handleReactions(interaction, customId, user, guild);
    // Rest of the code for unknown button
  }
}
