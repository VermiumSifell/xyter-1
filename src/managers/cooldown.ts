import { Cooldown, PrismaClient } from "@prisma/client";
import logger from "../middlewares/logger";

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

    logger.verbose(`Set guild cooldown: ${cooldownItem} in guild ${guildId}`);
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

    logger.verbose(`Set user cooldown: ${cooldownItem} for user ${userId}`);
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

    logger.verbose(
      `Set guild member cooldown: ${cooldownItem} in guild ${guildId} for user ${userId}`
    );
  }

  async checkGuildCooldown(
    cooldownItem: string,
    guildId: string
  ): Promise<Cooldown | null> {
    const start = Date.now();
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
    const duration = Date.now() - start;

    logger.verbose(
      `Checked guild cooldown: ${cooldownItem} in guild ${guildId}. Duration: ${duration}ms`
    );

    return cooldown;
  }

  async checkUserCooldown(
    cooldownItem: string,
    userId: string
  ): Promise<Cooldown | null> {
    const start = Date.now();
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
    const duration = Date.now() - start;

    logger.verbose(
      `Checked user cooldown: ${cooldownItem} for user ${userId}. Duration: ${duration}ms`
    );

    return cooldown;
  }

  async checkGuildMemberCooldown(
    cooldownItem: string,
    guildId: string,
    userId: string
  ): Promise<Cooldown | null> {
    const start = Date.now();
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
    const duration = Date.now() - start;

    logger.verbose(
      `Checked guild member cooldown: ${cooldownItem} in guild ${guildId} for user ${userId}. Duration: ${duration}ms`
    );

    return cooldown;
  }
}

export default CooldownManager;
