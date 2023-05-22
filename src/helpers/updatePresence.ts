// Dependencies
import { ActivitiesOptions, ActivityType, Client } from "discord.js";
import logger from "../middlewares/logger";

// Function
export default (client: Client) => {
  // 1. Destructure the client.
  const { guilds, user } = client;
  if (!user) throw new Error("No user found");

  // 2. Get the total number of guilds and members.
  const memberCount = guilds.cache.reduce(
    (acc, guild) => acc + guild.memberCount ?? 0,
    0
  );
  const guildCount = guilds.cache.size;

  const activities: ActivitiesOptions[] = [
    {
      name: `${memberCount} users`,
      type: ActivityType.Watching,
    },
    {
      name: `${guildCount} servers`,
      type: ActivityType.Watching,
    },
  ];

  // Function to shuffle an array in-place
  function shuffleArray<T>(array: T[]): void {
    // eslint-disable-next-line no-loops/no-loops
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Shuffle the activities array
  shuffleArray(activities);

  // Select the first activity from the shuffled array
  const activity = activities[0];

  // 3. Set the presence.
  user.setActivity(activity);

  // 4. Log the presence.
  return logger.debug({
    guildCount,
    memberCount,
    message: `Presence updated`,
    activity,
  });
};
