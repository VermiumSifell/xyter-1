/* eslint-disable no-loops/no-loops */
import { Client } from "discord.js";
import registerCommands from "../../handlers/registerCommands";
import updatePresence from "../../helpers/updatePresence";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../middlewares/logger";

export const options: IEventOptions = {
  type: "once",
};

export const execute = async (client: Client) => {
  if (!client.user) {
    logger.error("Client user unavailable");
    throw new Error("Client user unavailable");
  }

  logger.info("Connected to Discord!");

  updatePresence(client);
  await registerCommands(client);

  //  await importOldData(client);
};
