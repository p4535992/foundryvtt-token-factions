import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";

export const registerSettings = function () {
  game.settings.registerMenu(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.RESET, {
    name: `${CONSTANTS.MODULE_ID}.setting.reset.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.reset.hint`,
    icon: "fas fa-coins",
    type: ResetSettingsDialog,
    restricted: true,
  });

  // ==========================
  // TOKEN FACTIONS
  // ==========================

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.COLOR_FROM, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.COLOR_FROM}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.COLOR_FROM}.hint`,
    scope: "world",
    config: true,
    default: CONSTANTS.DEFAULTS.COLOR_FROM,
    type: String,
    choices: {
      "token-disposition": `${CONSTANTS.MODULE_ID}.setting.color-from.opt.token-disposition`,
      "actor-folder-color": `${CONSTANTS.MODULE_ID}.setting.color-from.opt.actor-folder-color`,
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BASE_OPACITY, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.BASE_OPACITY}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.BASE_OPACITY}.hint`,
    scope: "world",
    config: true,
    default: CONSTANTS.DEFAULTS.BASE_OPACITY,
    type: Number,
    range: {
      min: 0,
      max: 1,
      step: 0.05,
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FILL_TEXTURE, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FILL_TEXTURE}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FILL_TEXTURE}.hint`,
    scope: "world",
    type: Boolean,
    default: CONSTANTS.DEFAULTS.FILL_TEXTURE,
    config: true,
  });

  // ===============================
  // SUB FEATURE STANDARD
  // ===============================

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRAME_STYLE, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FRAME_STYLE}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FRAME_STYLE}.hint`,
    scope: "world",
    config: true,
    default: CONSTANTS.DEFAULTS.FRAME_STYLE,
    type: String,
    choices: {
      flat: `${CONSTANTS.MODULE_ID}.setting.frame-style.opt.flat`,
      beveled: `${CONSTANTS.MODULE_ID}.setting.frame-style.opt.beveled`,
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRAME_OPACITY, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FRAME_OPACITY}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FRAME_OPACITY}.hint`,
    scope: "world",
    config: true,
    default: CONSTANTS.DEFAULTS.FRAME_OPACITY,
    type: Number,
    range: {
      min: 0,
      max: 1,
      step: 0.05,
    },
  });

  // ===============================
  // SUB FEATURE ALTERNATIVE BORDER
  // ===============================

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.REMOVE_BORDERS, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.REMOVE_BORDERS}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.REMOVE_BORDERS}.hint`,
    scope: "world",
    type: String,
    choices: {
      0: "None",
      1: "Non Owned",
      2: "All",
    },
    default: CONSTANTS.DEFAULTS.REMOVE_BORDERS,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PERMANENT_BORDER, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.PERMANENT_BORDER}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.PERMANENT_BORDER}.hint`,
    default: CONSTANTS.DEFAULTS.PERMANENT_BORDER,
    type: Boolean,
    scope: "world",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BORDER_WIDTH, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.BORDER_WIDTH}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.BORDER_WIDTH}.hint`,
    scope: "world",
    type: Number,
    default: CONSTANTS.DEFAULTS.BORDER_WIDTH,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BORDER_GRID_SCALE, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.BORDER_GRID_SCALE}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.BORDER_GRID_SCALE}.hint`,
    scope: "world",
    type: Boolean,
    default: CONSTANTS.DEFAULTS.BORDER_GRID_SCALE,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BORDER_OFFSET, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.BORDER_OFFSET}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.BORDER_OFFSET}.hint`,
    scope: "world",
    type: Number,
    default: CONSTANTS.DEFAULTS.BORDER_OFFSET,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CIRCLE_BORDERS, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.CIRCLE_BORDERS}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.CIRCLE_BORDERS}.hint`,
    scope: "world",
    type: Boolean,
    default: CONSTANTS.DEFAULTS.CIRCLE_BORDERS,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.SCALE_BORDER, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.SCALE_BORDER}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.SCALE_BORDER}.hint`,
    scope: "world",
    type: Boolean,
    default: CONSTANTS.DEFAULTS.SCALE_BORDER,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HUD_ENABLE, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HUD_ENABLE}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HUD_ENABLE}.hint`,
    scope: "world",
    type: Boolean,
    default: CONSTANTS.DEFAULTS.HUD_ENABLE,
    config: true,
  });

  /** Which column should the button be placed on */
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HUD_COLUMN, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HUD_COLUMN}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HUD_COLUMN}.hint`,
    scope: "world",
    config: true,
    type: String,
    default: CONSTANTS.DEFAULTS.HUD_COLUMN,
    choices: {
      Left: "Left",
      Right: "Right",
    },
  });

  /** Whether the button should be placed on the top or bottom of the column */
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HUD_TOP_BOTTOM, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HUD_TOP_BOTTOM}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HUD_TOP_BOTTOM}.hint`,
    scope: "world",
    config: true,
    type: String,
    default: CONSTANTS.DEFAULTS.HUD_TOP_BOTTOM,
    choices: {
      Top: "Top",
      Bottom: "Bottom",
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.CONTROLLED_COLOR}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.CONTROLLED_COLOR}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.CONTROLLED_COLOR,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.CONTROLLED_COLOR_EX,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HOSTILE_COLOR}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HOSTILE_COLOR}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.HOSTILE_COLOR,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR_EX, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HOSTILE_COLOR_EX}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HOSTILE_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.HOSTILE_COLOR_EX,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FRIENDLY_COLOR}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FRIENDLY_COLOR}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.FRIENDLY_COLOR,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.FRIENDLY_COLOR_EX,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.NEUTRAL_COLOR}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.NEUTRAL_COLOR}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.NEUTRAL_COLOR,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.NEUTRAL_COLOR_EX,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.PARTY_COLOR}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.PARTY_COLOR}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.PARTY_COLOR,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR_EX, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.PARTY_COLOR_EX}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.PARTY_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.PARTY_COLOR_EX,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.ACTOR_FOLDER_COLOR_EX,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.DEBUG, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.DEBUG}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.DEBUG}.hint`,
    scope: "client",
    config: true,
    default: CONSTANTS.DEFAULTS.DEBUG,
    type: Boolean,
  });
};

class ResetSettingsDialog extends FormApplication {
  constructor(...args) {
    super(...args);

    return new Dialog({
      title: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.title`),
      content:
        '<p style="margin-bottom:1rem;">' +
        game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.content`) +
        "</p>",
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.confirm`),
          callback: async () => {
            const worldSettings = game.settings.storage
              ?.get("world")
              ?.filter((setting) => setting.key.startsWith(`${CONSTANTS.MODULE_ID}.`));
            for (let setting of worldSettings) {
              Logger.info(`Reset setting '${setting.key}'`);
              await setting.delete();
            }
            //window.location.reload();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.cancel`),
        },
      },
      default: "cancel",
    });
  }

  async _updateObject(event, formData = null) {
    // do nothing
  }
}
