import { Client } from "discord.js";
import checkDirectory from "../helpers/readDirectory";
import { IEvent } from "../interfaces/Event";
import logger from "../middlewares/logger";

export default async (client: Client) => {
  const profiler = logger.startTimer();

  const eventNames = await checkDirectory("events");

  const importEvent = async (name: string) => {
    const event = (await import(`../events/${name}`)) as IEvent;

    const eventExecutor = async (...args: Promise<void>[]) => {
      await event.execute(...args);
    };

    switch (event.options.type) {
      case "once":
        client.once(name, eventExecutor);
        break;
      case "on":
        client.on(name, eventExecutor);
        break;
      default:
        throw new Error(`Unknown event type: ${event.options.type}`);
    }

    logger.debug({
      eventName: name,
      type: event.options.type,
      message: `Listening to event '${name}'`,
    });

    return event;
  };

  await Promise.all(eventNames.map(importEvent));

  return profiler.done({
    message: "Successfully listening to all events!",
  });
};
