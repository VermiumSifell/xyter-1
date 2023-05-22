import { User } from "discord.js";
import prisma from "../../handlers/prisma";

export const check = async (user: User) => {
  const userReputation = await prisma.userReputation.upsert({
    where: { id: user.id },
    update: {},
    create: { id: user.id },
  });
  return {
    total: userReputation.positive - userReputation.negative,
    positive: userReputation.positive,
    negative: userReputation.negative,
  };
};

export const repute = async (user: User, type: "positive" | "negative") => {
  console.log(type);
  let userReputation = {};
  if (type === "positive") {
    userReputation = await prisma.userReputation.upsert({
      where: { id: user.id },
      update: { positive: { increment: 1 } },
      create: { id: user.id },
    });
  }
  if (type === "negative") {
    userReputation = await prisma.userReputation.upsert({
      where: { id: user.id },
      update: { negative: { increment: 1 } },
      create: { id: user.id },
    });
  }

  return userReputation;
};
