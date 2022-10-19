import { Message } from "discord.js";
import { IEventOptions } from "../../../interfaces/EventOptions";
import modules from "../../events/messageCreate/modules";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (message: Message) => {
  await modules.credits.execute(message);
  await modules.points.execute(message);
  await modules.counters.execute(message);
};
