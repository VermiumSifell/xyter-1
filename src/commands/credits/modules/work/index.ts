import Chance from "chance";
import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";

import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import { success as BaseEmbedSuccess } from "../../../../helpers/baseEmbeds";
import creditsGive from "../../../../helpers/credits/give";
import cooldown from "../../../../middlewares/cooldown";
import logger from "../../../../middlewares/logger";

// 1. Export a builder function.
export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command.setName("work").setDescription(`Work to earn credits`);
};

// 2. Export an execute function.
export const execute = async (interaction: CommandInteraction) => {
  // 1. Defer reply as ephemeral.
  await deferReply(interaction, true);

  // 2. Destructure interaction object.
  const { guild, user, commandId } = interaction;
  if (!guild) throw new Error("Guild not found");
  if (!user) throw new Error("User not found");

  // 3. Create base embeds.
  const EmbedSuccess = await BaseEmbedSuccess(guild, "[:dollar:] Work");

  // 4. Create new Chance instance.
  const chance = new Chance();

  // 5. Upsert the guild in the database.
  const createGuild = await prisma.guild.upsert({
    where: {
      id: guild.id,
    },
    update: {},
    create: {
      id: guild.id,
    },
  });
  logger.silly(createGuild);
  if (!createGuild) throw new Error("Guild not found");

  // 6. Create a cooldown for the user.
  await cooldown(guild, user, commandId, createGuild.creditsWorkTimeout);

  // 6. Generate a random number between 0 and creditsWorkRate.
  const creditsEarned = chance.integer({
    min: 0,
    max: createGuild.creditsWorkRate,
  });

  const upsertGuildMember = await creditsGive(guild, user, creditsEarned);

  // 8. Send embed.
  await interaction.editReply({
    embeds: [
      EmbedSuccess.setDescription(
        `You worked and earned **${creditsEarned}** credits! You now have **${upsertGuildMember.creditsEarned}** credits. :tada:`
      ),
    ],
  });
};
