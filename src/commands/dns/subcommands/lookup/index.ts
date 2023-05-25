import axios from "axios";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import dns from "node:dns";
import { promisify } from "util";
import cooldown from "../../../../handlers/CooldownManager";
import deferReply from "../../../../helpers/deferReply";
import generateCooldownName from "../../../../helpers/generateCooldownName";
import sendResponse from "../../../../utils/sendResponse";

const dnsLookup = promisify(dns.lookup);

export const builder = (
  command: SlashCommandSubcommandBuilder
): SlashCommandSubcommandBuilder => {
  return command
    .setName("lookup")
    .setDescription("Lookup a domain or IP.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The query you want to look up.")
        .setRequired(true)
    );
};

export const execute = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  await deferReply(interaction, false);

  const { user, guild, options } = interaction;
  const query = options.getString("query", true);

  try {
    const { address } = await dnsLookup(query);

    const { data } = await axios.get(`https://ipinfo.io/${address}`);

    await sendResponse(interaction, {
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: `Powered using IPinfo.io`,
            url: "https://ipinfo.io",
            iconURL: "https://ipinfo.io/static/favicon-96x96.png?v3",
          })
          .setColor(process.env.EMBED_COLOR_SUCCESS)
          .setFooter({
            text: `Requested by ${user.username}`,
            iconURL: user.displayAvatarURL(),
          })
          .setTimestamp().setDescription(`
            **IP**: ${data.ip}
            **Hostname**: ${data.hostname}
            **Organization**: ${data.org}
            **Anycast**: ${data.anycast ? "Yes" : "No"}
            **City**: ${data.city}
            **Region**: ${data.region}
            **Country**: ${data.country}
            **Location**: ${data.loc}
            **Postal**: ${data.postal}
            **Timezone**: ${data.timezone}
          `),
      ],
    });

    const cooldownName = await generateCooldownName(interaction);
    const cooldownDuration = 5;

    if (guild) {
      await cooldown.setGuildMemberCooldown(
        cooldownName,
        guild,
        user,
        cooldownDuration
      );
    } else {
      await cooldown.setUserCooldown(cooldownName, user, cooldownDuration);
    }
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOTFOUND") {
      throw new Error(
        `Sorry, we couldn't find the address for the requested query: ${query}.`
      );
    } else {
      throw error;
    }
  }
};
