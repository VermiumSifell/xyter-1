const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema(
  {
    guildId: {
      type: mongoose.SchemaTypes.Decimal128,
      required: true,
      unique: true,
      index: true,
    },
    credits: {
      status: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
      },
      url: {
        type: mongoose.SchemaTypes.String,
      },
      token: {
        type: mongoose.SchemaTypes.String,
      },
      rate: {
        type: mongoose.SchemaTypes.Number,
        default: 1,
      },
      minimumLength: {
        type: mongoose.SchemaTypes.Number,
        default: 5,
      },
      timeout: {
        type: mongoose.SchemaTypes.Number,
        default: 5000,
      },
      workRate: {
        type: mongoose.SchemaTypes.Number,
        default: 15,
      },
      workTimeout: {
        type: mongoose.SchemaTypes.Number,
        default: 900000,
      },
    },
    shop: {
      roles: {
        pricePerHour: {
          type: mongoose.SchemaTypes.Number,
          default: 5,
        },
      },
    },
    points: {
      status: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
      },
      url: {
        type: mongoose.SchemaTypes.String,
      },
      token: {
        type: mongoose.SchemaTypes.String,
      },
      rate: {
        type: mongoose.SchemaTypes.Number,
        default: 1,
      },
      minimumLength: {
        type: mongoose.SchemaTypes.Number,
        default: 5,
      },
      timeout: {
        type: mongoose.SchemaTypes.Number,
        default: 5000,
      },
      workRate: {
        type: mongoose.SchemaTypes.Number,
        default: 15,
      },
      workTimeout: {
        type: mongoose.SchemaTypes.Number,
        default: 900000,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('guild', guildSchema);
