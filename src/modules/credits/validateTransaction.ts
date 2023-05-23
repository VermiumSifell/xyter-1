import { Guild, User } from "discord.js";

export default async (guild: Guild, user: User, amount: number) => {
  if (!guild) {
    throw new Error("Credits are only available for guilds.");
  }

  if (amount <= 0) {
    throw new Error("You cannot make a transaction below 1 credit.");
  }

  if (amount > 2147483647) {
    throw new Error("The maximum allowed credits is 2,147,483,647.");
  }

  if (user.bot) {
    throw new Error("Bots cannot participate in transactions.");
  }
};
