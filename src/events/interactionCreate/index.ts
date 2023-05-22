import { BaseInteraction, InteractionType } from "discord.js";
import upsertGuildMember from "../../helpers/upsertGuildMember";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../middlewares/logger";
import button from "./handlers/button";
import chatInputCommand from "./handlers/chatInputCommand";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (interaction: BaseInteraction) => {
  const { guild, user } = interaction;

  logger.verbose({
    message: `New interaction created: ${interaction.id} by: ${user.tag} (${user.id})`,
    interactionId: interaction.id,
    userId: user.id,
    guildId: guild?.id,
  });

  if (guild) {
    await upsertGuildMember(guild, user);
  }

  switch (interaction.type) {
    case InteractionType.ApplicationCommand: {
      if (interaction.isChatInputCommand()) {
        await chatInputCommand(interaction);
      } else if (interaction.isButton()) {
        await button(interaction);
      } else {
        const errorMessage = "Unknown interaction type";
        logger.error({
          message: errorMessage,
          error: new Error(errorMessage),
          interactionId: interaction.id,
          userId: user.id,
          guildId: guild?.id,
        });
        throw new Error(errorMessage);
      }
      break;
    }
    default: {
      const errorMessage = "Unknown interaction type";
      logger.error({
        message: errorMessage,
        error: new Error(errorMessage),
        interactionId: interaction.id,
        userId: user.id,
        guildId: guild?.id,
      });
      throw new Error(errorMessage);
    }
  }

  //  await sendAuditEntry(interaction);
};
