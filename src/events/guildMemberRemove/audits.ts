import { ChannelType, EmbedBuilder, GuildMember } from "discord.js";
import getEmbedConfig from "../../helpers/getEmbedData";
import logger from "../../middlewares/logger";
import guildSchema from "../../models/guild";

export default {
  execute: async (member: GuildMember) => {
    const { client, guild } = member;

    const guildData = await guildSchema.findOne({ guildId: member.guild.id });
    if (!guildData) {
      throw new Error("Could not find guild");
    }
    if (guildData.audits.status !== true) return;
    if (!guildData.audits.channelId) {
      throw new Error("Channel not found");
    }

    const embedConfig = await getEmbedConfig(guild);

    const channel = client.channels.cache.get(guildData.audits.channelId);
    if (channel?.type !== ChannelType.GuildText) {
      throw new Error("Channel must be a text channel");
    }

    const embed = new EmbedBuilder()
      .setTimestamp(new Date())
      .setAuthor({
        name: "Member Left",
        iconURL: client.user?.displayAvatarURL(),
      })
      .setFooter({
        text: embedConfig.footerText,
        iconURL: embedConfig.footerIcon,
      });

    channel
      .send({
        embeds: [
          embed
            .setColor(embedConfig.errorColor)
            .setDescription(`${member.user} - (${member.user.tag})`)
            .addFields([
              {
                name: "Account Age",
                value: `${member.user.createdAt}`,
              },
            ]),
        ],
      })
      .then(() => {
        logger.debug(`Audit log sent for event guildMemberRemove.`);
      })
      .catch(() => {
        throw new Error("Audit log failed to send");
      });
  },
};
