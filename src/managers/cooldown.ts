import { Cooldown, PrismaClient } from "@prisma/client";
import { Guild, User } from "discord.js";
import logger from "../utils/logger";

const prisma = new PrismaClient();

class CooldownManager {
  async setGuildCooldown(
    cooldownItem: string,
    guild: Guild,
    cooldownSeconds: number
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + cooldownSeconds * 1000);

    await prisma.cooldown.create({
      data: {
        cooldownItem,
        expiresAt,
        guild: { connect: { id: guild.id } },
      },
    });

    logger.verbose(`Set guild cooldown: ${cooldownItem} in guild ${guild.id}`);
  }

  async setUserCooldown(
    cooldownItem: string,
    user: User,
    cooldownSeconds: number
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + cooldownSeconds * 1000);

    await prisma.cooldown.create({
      data: {
        cooldownItem,
        expiresAt,
        user: { connect: { id: user.id } },
      },
    });

    logger.verbose(`Set user cooldown: ${cooldownItem} for user ${user.id}`);
  }

  async setGuildMemberCooldown(
    cooldownItem: string,
    guild: Guild,
    user: User,
    cooldownSeconds: number
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + cooldownSeconds * 1000);

    await prisma.cooldown.create({
      data: {
        cooldownItem,
        expiresAt,
        guild: { connect: { id: guild.id } },
        user: { connect: { id: user.id } },
      },
    });

    logger.verbose(
      `Set guild member cooldown: ${cooldownItem} in guild ${guild.id} for user ${user.id}`
    );
  }

  async checkGuildCooldown(
    cooldownItem: string,
    guild: Guild
  ): Promise<Cooldown | null> {
    const start = Date.now();
    const cooldown = await prisma.cooldown.findFirst({
      where: {
        cooldownItem,
        guild: { id: guild.id },
        user: null,
        expiresAt: {
          gte: new Date(),
        },
      },
    });
    const duration = Date.now() - start;

    logger.verbose(
      `Checked guild cooldown: ${cooldownItem} in guild ${guild.id}. Duration: ${duration}ms`
    );

    return cooldown;
  }

  async checkUserCooldown(
    cooldownItem: string,
    user: User
  ): Promise<Cooldown | null> {
    const start = Date.now();
    const cooldown = await prisma.cooldown.findFirst({
      where: {
        cooldownItem,
        user: { id: user.id },
        guild: null,
        expiresAt: {
          gte: new Date(),
        },
      },
    });
    const duration = Date.now() - start;

    logger.verbose(
      `Checked user cooldown: ${cooldownItem} for user ${user.id}. Duration: ${duration}ms`
    );

    return cooldown;
  }

  async checkGuildMemberCooldown(
    cooldownItem: string,
    guild: Guild,
    user: User
  ): Promise<Cooldown | null> {
    const start = Date.now();
    const cooldown = await prisma.cooldown.findFirst({
      where: {
        cooldownItem,
        guild: { id: guild.id },
        user: { id: user.id },
        expiresAt: {
          gte: new Date(),
        },
      },
    });
    const duration = Date.now() - start;

    logger.verbose(
      `Checked guild member cooldown: ${cooldownItem} in guild ${guild.id} for user ${user.id}. Duration: ${duration}ms`
    );

    return cooldown;
  }

  async checkCooldowns(cooldownItem: string, guild: Guild | null, user: User) {
    const guildCooldown = guild
      ? await this.checkGuildCooldown(cooldownItem, guild)
      : null;
    const userCooldown = await this.checkUserCooldown(cooldownItem, user);
    const guildMemberCooldown = guild
      ? await this.checkGuildMemberCooldown(cooldownItem, guild, user)
      : null;

    return { guildCooldown, userCooldown, guildMemberCooldown };
  }
}

export default new CooldownManager();
