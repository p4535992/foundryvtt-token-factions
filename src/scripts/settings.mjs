import { debug, log, warn, i18n } from "./lib/lib.mjs";
import CONSTANTS from "./constants.mjs";

export const registerSettings = function () {
  game.settings.registerMenu(CONSTANTS.MODULE_ID, "resetAllSettings", {
    name: `${CONSTANTS.MODULE_ID}.setting.reset.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.reset.hint`,
    icon: "fas fa-coins",
    type: ResetSettingsDialog,
    restricted: true,
  });

  // =====================================================================

  // ==========================
  // TOKEN FACTIONS
  // ==========================

  game.settings.register(CONSTANTS.MODULE_ID, "tokenFactionsEnabled", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.tokenFactionsEnabled.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.tokenFactionsEnabled.hint"),
    default: true,
    type: Boolean,
    scope: "world",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "color-from", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.color-from.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.color-from.hint"),
    scope: "world",
    config: true,
    default: "token-disposition",
    type: String,
    choices: {
      "token-disposition": i18n(CONSTANTS.MODULE_ID + ".setting.color-from.opt.token-disposition"),
      "actor-folder-color": i18n(CONSTANTS.MODULE_ID + ".setting.color-from.opt.actor-folder-color"),
      // "custom-disposition": i18n(CONSTANTS.MODULE_ID + ".setting.color-from.opt.custom-disposition")
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, "base-opacity", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.base-opacity.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.base-opacity.hint"),
    scope: "world",
    config: true,
    default: 0.5,
    type: Number,

    range: {
      min: 0,
      max: 1,
      step: 0.05,
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, "fillTexture", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.fillTexture.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.fillTexture.hint"),
    scope: "world",
    type: Boolean,
    default: true,
    config: true,
  });

  // game.settings.register(CONSTANTS.MODULE_ID, 'overrideBorderGraphic', {
  //   name: i18n(CONSTANTS.MODULE_ID + '.setting.overrideBorderGraphic.name'),
  //   hint: i18n(CONSTANTS.MODULE_ID + '.setting.overrideBorderGraphic.hint'),
  //   scope: 'world',
  //   type: Boolean,
  //   default: false,
  //   config: true,
  // });

  // ===============================
  // SUB FEATURE STANDARD
  // ===============================

  // game.settings.register(CONSTANTS.MODULE_ID, 'pixiFactionsEnabled', {
  //   name: i18n(CONSTANTS.MODULE_ID + '.setting.pixiFactionsEnabled.name'),
  //   hint: i18n(CONSTANTS.MODULE_ID + '.setting.pixiFactionsEnabled.hint'),
  //   scope: 'world',
  //   type: Boolean,
  //   default: false,
  //   config: true,
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, 'draw-frames-by-default', {
  //   name: i18n(CONSTANTS.MODULE_ID + '.setting.draw-frames-by-default.name'),
  //   hint: i18n(CONSTANTS.MODULE_ID + '.setting.draw-frames-by-default.hint'),
  //   scope: 'world',
  //   config: true,
  //   default: true,
  //   type: Boolean,
  // });

  game.settings.register(CONSTANTS.MODULE_ID, "frame-style", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.frame-style.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.frame-style.hint"),
    scope: "world",
    config: true,
    default: "flat",
    type: String,
    choices: {
      flat: i18n(CONSTANTS.MODULE_ID + ".setting.frame-style.opt.flat"),
      beveled: i18n(CONSTANTS.MODULE_ID + ".setting.frame-style.opt.beveled"),
      // border: i18n(CONSTANTS.MODULE_ID + '.setting.frame-style.opt.border'),
    },
  });

  // game.settings.register(CONSTANTS.MODULE_ID, 'frame-width', {
  //   name: i18n(CONSTANTS.MODULE_ID + '.setting.frame-width.name'),
  //   hint: i18n(CONSTANTS.MODULE_ID + '.setting.frame-width.hint'),
  //   scope: 'world',
  //   config: true,
  //   default: 7.5,
  //   type: Number,
  //
  //   range: {
  //     min: 0,
  //     max: 10,
  //     step: 0.5,
  //   },
  // });

  // TODO MOVE THIS FOR BOTH THE FEATURE ????
  game.settings.register(CONSTANTS.MODULE_ID, "frame-opacity", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.frame-opacity.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.frame-opacity.hint"),
    scope: "world",
    config: true,
    default: 1,
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

  // game.settings.register(CONSTANTS.MODULE_ID, 'borderFactionsEnabled', {
  //   name: i18n(CONSTANTS.MODULE_ID + '.setting.borderFactionsEnabled.name'),
  //   hint: i18n(CONSTANTS.MODULE_ID + '.setting.borderFactionsEnabled.hint'),
  //   scope: 'world',
  //   type: Boolean,
  //   default: true,
  //   config: true,
  // });

  game.settings.register(CONSTANTS.MODULE_ID, "removeBorders", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.removeBorders.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.removeBorders.hint"),
    scope: "world",
    type: String,
    choices: {
      0: "None",
      1: "Non Owned",
      2: "All",
    },
    default: "0",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "permanentBorder", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.permanentBorder.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.permanentBorder.hint"),
    default: false,
    type: Boolean,
    scope: "world",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "borderWidth", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.borderWidth.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.borderWidth.hint"),
    scope: "world",
    type: Number,
    default: 4,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "borderGridScale", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.borderGridScale.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.borderGridScale.hint"),
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "borderOffset", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.borderOffset.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.borderOffset.hint"),
    scope: "world",
    type: Number,
    default: 0,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "circleBorders", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.circleBorders.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.circleBorders.hint"),
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "scaleBorder", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.scaleBorder.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.scaleBorder.hint"),
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "hudEnable", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.hudEnable.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.hudEnable.hint"),
    scope: "world",
    type: Boolean,
    default: true,
    config: true,
  });

  /** Which column should the button be placed on */
  game.settings.register(CONSTANTS.MODULE_ID, "hudColumn", {
    name: i18n(`${CONSTANTS.MODULE_ID}.setting.hudColumn.name`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.setting.hudColumn.hint`),
    scope: "world",
    config: true,
    type: String,
    default: "Right",
    choices: {
      Left: "Left",
      Right: "Right",
    },
  });

  /** Whether the button should be placed on the top or bottom of the column */
  game.settings.register(CONSTANTS.MODULE_ID, "hudTopBottom", {
    name: i18n(`${CONSTANTS.MODULE_ID}.setting.hudTopBottom.name`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.setting.hudTopBottom.hint`),
    scope: "world",
    config: true,
    type: String,
    default: "Bottom",
    choices: {
      Top: "Top",
      Bottom: "Bottom",
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, "controlledColor", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.controlledColor.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.controlledColor.hint"),
    scope: "world",
    type: String,
    default: "#FF9829",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "controlledColorEx", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.controlledColorEx.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.controlledColorEx.hint"),
    scope: "world",
    type: String,
    default: "#000000",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "hostileColor", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.hostileColor.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.hostileColor.hint"),
    scope: "world",
    type: String,
    default: "#E72124",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "hostileColorEx", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.hostileColorEx.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.hostileColorEx.hint"),
    scope: "world",
    type: String,
    default: "#000000",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "friendlyColor", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.friendlyColor.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.friendlyColor.hint"),
    scope: "world",
    type: String,
    default: "#43DFDF",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "friendlyColorEx", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.friendlyColorEx.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.friendlyColorEx.hint"),
    scope: "world",
    type: String,
    default: "#000000",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "neutralColor", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.neutralColor.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.neutralColor.hint"),
    scope: "world",
    type: String,
    default: "#F1D836",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "neutralColorEx", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.neutralColorEx.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.neutralColorEx.hint"),
    scope: "world",
    type: String,
    default: "#000000",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "partyColor", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.partyColor.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.partyColor.hint"),
    scope: "world",
    type: String,
    default: "#33BC4E",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "partyColorEx", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.partyColorEx.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.partyColorEx.hint"),
    scope: "world",
    type: String,
    default: "#000000",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "actorFolderColorEx", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.actorFolderColorEx.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.actorFolderColorEx.hint"),
    scope: "world",
    type: String,
    default: "#000000",
    config: true,
  });

  // Setting off
  game.settings.register(CONSTANTS.MODULE_ID, "customDispositionColorEx", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.customDispositionColorEx.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.customDispositionColorEx.hint"),
    scope: "world",
    type: String,
    default: "#000000",
    config: false,
  });

  // ========================================================================

  game.settings.register(CONSTANTS.MODULE_ID, "debug", {
    name: `${CONSTANTS.MODULE_ID}.setting.debug.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.debug.hint`,
    scope: "client",
    config: true,
    default: false,
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
              console.log(`Reset setting '${setting.key}'`);
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
