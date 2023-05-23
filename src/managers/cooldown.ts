import { Cooldown, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class CooldownManager {
  async setGuildCooldown(
    cooldownItem: string,
    guildId: string,
    cooldownSeconds: number
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + cooldownSeconds * 1000);

    await prisma.cooldown.create({
      data: {
        cooldownItem,
        expiresAt,
        guild: { connect: { id: guildId } },
      },
    });
  }

  async setUserCooldown(
    cooldownItem: string,
    userId: string,
    cooldownSeconds: number
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + cooldownSeconds * 1000);

    await prisma.cooldown.create({
      data: {
        cooldownItem,
        expiresAt,
        user: { connect: { id: userId } },
      },
    });
  }

  async setGuildMemberCooldown(
    cooldownItem: string,
    guildId: string,
    userId: string,
    cooldownSeconds: number
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + cooldownSeconds * 1000);

    await prisma.cooldown.create({
      data: {
        cooldownItem,
        expiresAt,
        guild: { connect: { id: guildId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async checkGuildCooldown(
    cooldownItem: string,
    guildId: string
  ): Promise<Cooldown | null> {
    const cooldown = await prisma.cooldown.findFirst({
      where: {
        cooldownItem,
        guild: { id: guildId },
        user: null,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    return cooldown;
  }

  async checkUserCooldown(
    cooldownItem: string,
    userId: string
  ): Promise<Cooldown | null> {
    const cooldown = await prisma.cooldown.findFirst({
      where: {
        cooldownItem,
        user: { id: userId },
        guild: null,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    return cooldown;
  }

  async checkGuildMemberCooldown(
    cooldownItem: string,
    guildId: string,
    userId: string
  ): Promise<Cooldown | null> {
    const cooldown = await prisma.cooldown.findFirst({
      where: {
        cooldownItem,
        guild: { id: guildId },
        user: { id: userId },
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    return cooldown;
  }
}

export default CooldownManager;
