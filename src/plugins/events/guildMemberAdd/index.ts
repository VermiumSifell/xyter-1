// 3rd party dependencies
import { GuildMember } from "discord.js";

// Dependencies
import fetchUser from "../../../helpers/fetchUser";
import updatePresence from "../../../helpers/updatePresence";
import logger from "../../../middlewares/logger";

import audits from "./audits";
import joinMessage from "./joinMessage";

import { IEventOptions } from "../../../interfaces/EventOptions";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (member: GuildMember) => {
  const { client, user, guild } = member;

  logger.silly(
    `New member: ${user.tag} (${user.id}) added to guild: ${guild.name} (${guild.id})`
  );

  await audits.execute(member);
  await joinMessage.execute(member);
  await fetchUser(user, guild);
  await updatePresence(client);
};
