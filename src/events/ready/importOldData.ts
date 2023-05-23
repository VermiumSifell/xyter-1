/* eslint-disable no-loops/no-loops */
import { ChannelType, Client } from "discord.js";
import logger from "../../middlewares/logger";
import set from "../../modules/credits/transactionTypes/set";

export default async (client: Client) => {
  try {
    // Fetch all guilds the bot is a member of
    const guilds = client.guilds.cache.values();

    for await (const guild of guilds) {
      // Fetch all channels in the guild
      const channels = guild.channels.cache.filter(
        (channel) => channel.type === ChannelType.GuildText
      );

      // Object to store message counts per user
      const messageCounts: unknown = {};

      for await (const [, channel] of channels) {
        if (channel.type !== ChannelType.GuildText) continue;

        let beforeMessageID = null;
        let messagesFetched = 0;

        while (true) {
          const fetchOptions: never = { limit: 100, before: beforeMessageID };

          try {
            const messages = await channel.messages.fetch(fetchOptions);

            for await (const [, message] of messages) {
              const userId = message.author.id;

              logger.debug(message.id);

              if (message.author.bot) continue;

              // Increment message count for the user
              if (!messageCounts[userId]) {
                messageCounts[userId] = 1;
              } else {
                messageCounts[userId]++;
                logger.silly(
                  `Guild: ${message.guild.name} User: ${message.author.username} => ${messageCounts[userId]}`
                );
              }
            }

            messagesFetched += messages.size;

            if (messages.size < 100) {
              break;
            }

            beforeMessageID = messages.last()?.id;
          } catch (error) {
            console.error(`Error fetching messages in ${channel.name}:`, error);
            // Handle rate limit here if needed
            // You can use the error object to determine the type of error and handle it accordingly
            // For example, you can check if the error is a rate limit error and implement a delay before retrying
          }
        }
      }

      // Log message counts for the guild
      logger.info(`Message Counts for Guild: ${guild.name}`);
      for (const userId in messageCounts) {
        if (messageCounts.hasOwnProperty(userId)) {
          try {
            const member = await guild.members.fetch(userId);
            if (!member) continue; // Skip unknown members

            await set(member.guild, member.user, messageCounts[userId]);

            logger.info(
              `${member?.user.username}: ${messageCounts[userId]} messages`
            );
          } catch (error: unknown) {
            if (error.code === 429) {
              logger.error("RATE LIMIT");
              // Rate limit hit, wait for the specified duration and retry
              const retryAfter = error.retryAfter;
              logger.warn(`Rate limited. Retrying in ${retryAfter}ms...`);
              console.log(retryAfter);
              await new Promise((resolve) => setTimeout(resolve, retryAfter));
              continue; // Retry the fetch
            }

            if (error.code === 10013) continue;
            logger.error(error.code);
          }
          10007;
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
