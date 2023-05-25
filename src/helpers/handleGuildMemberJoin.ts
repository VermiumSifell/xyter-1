import { Guild, User } from "discord.js";
import logger from "../utils/logger";
import upsertGuildMember from "./upsertGuildMember";

const handleGuildMemberJoin = async (guild: Guild, user: User) => {
  try {
    // Create the user
    await upsertGuildMember(guild, user);

    // Example: Logging the guild member join event
    logger.info(`User ${user.tag} joined guild ${guild.name} (${guild.id}).`);
  } catch (error) {
    // Handle any errors that occur during the guild member join event handling
    logger.error(`Error handling guild member join: ${error}`);
  }
};

export default handleGuildMemberJoin;
