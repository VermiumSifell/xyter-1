import { Client, Collection, GatewayIntentBits } from "discord.js"; // discord.js
import "dotenv/config";

import registerEvents from "./handlers/registerEvents";
import scheduleJobs from "./handlers/scheduleJobs";

(async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.commands = new Collection();

  await registerEvents(client);
  await scheduleJobs(client);

  await client.login(process.env.DISCORD_TOKEN);
})();
