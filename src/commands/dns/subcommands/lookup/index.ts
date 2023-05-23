import axios from "axios";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import dns from "node:dns";
import deferReply from "../../../../helpers/deferReply";
import { setInteraction } from "../../../../helpers/setCooldown";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("lookup")
    .setDescription("Lookup a domain or ip.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The query you want to look up.")
        .setRequired(true)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, false);

  const { options, user } = interaction;

  const query = options.getString("query", true);

  dns.lookup(query, async (err, address, family) => {
    await axios.get(`https://ipinfo.io/${address}`).then(async (response) => {
      const { data } = response;

      await interaction.editReply({
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
    });
  });
  await setInteraction(interaction, 15);
};
