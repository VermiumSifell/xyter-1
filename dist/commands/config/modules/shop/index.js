"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const database_1 = __importDefault(require("../../../../handlers/database"));
const deferReply_1 = __importDefault(
  require("../../../../handlers/deferReply")
);
const checkPermission_1 = __importDefault(
  require("../../../../helpers/checkPermission")
);
const getEmbedData_1 = __importDefault(
  require("../../../../helpers/getEmbedData")
);
const logger_1 = __importDefault(require("../../../../middlewares/logger"));
exports.default = {
  builder: (command) => {
    return command
      .setName("shop")
      .setDescription("Shop")
      .addBooleanOption((option) =>
        option
          .setName("roles-status")
          .setDescription("Should roles be enabled?")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("roles-price-per-hour")
          .setDescription("Price per hour for roles.")
          .setRequired(true)
      );
  },
  execute: (interaction) =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield (0, deferReply_1.default)(interaction, true);
      (0,
      checkPermission_1.default)(interaction, discord_js_1.PermissionsBitField.Flags.ManageGuild);
      const { successColor, footerText, footerIcon } = yield (0,
      getEmbedData_1.default)(interaction.guild);
      const { options, guild } = interaction;
      const rolesStatus =
        options === null || options === void 0
          ? void 0
          : options.getBoolean("roles-status");
      const rolesPricePerHour =
        options === null || options === void 0
          ? void 0
          : options.getNumber("roles-price-per-hour");
      if (!guild) throw new Error("Guild not found");
      if (rolesStatus === null) throw new Error("Status must be provided");
      if (!rolesPricePerHour)
        throw new Error("Roles price per hour must be provided");
      const createGuild = yield database_1.default.guild.upsert({
        where: {
          id: guild.id,
        },
        update: {
          shopRolesEnabled: rolesStatus,
          shopRolesPricePerHour: rolesPricePerHour,
        },
        create: {
          id: guild.id,
          shopRolesEnabled: rolesStatus,
          shopRolesPricePerHour: rolesPricePerHour,
        },
      });
      logger_1.default.silly(createGuild);
      const interactionEmbed = new discord_js_1.EmbedBuilder()
        .setTitle("[:tools:] Shop")
        .setDescription("Shop settings updated")
        .setColor(successColor)
        .addFields(
          {
            name: "🤖 Roles Status",
            value: `${createGuild.shopRolesEnabled}`,
            inline: true,
          },
          {
            name: "🌊 Roles Price Per Hour",
            value: `${createGuild.shopRolesPricePerHour}`,
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter({
          iconURL: footerIcon,
          text: footerText,
        });
      yield interaction === null || interaction === void 0
        ? void 0
        : interaction.editReply({
            embeds: [interactionEmbed],
          });
      return;
    }),
};
