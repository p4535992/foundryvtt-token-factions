import CONSTANTS from "./constants.js";

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
    name: CONSTANTS.MODULE_ID + ".setting.tokenFactionsEnabled.name",
    hint: CONSTANTS.MODULE_ID + ".setting.tokenFactionsEnabled.hint",
    default: true,
    type: Boolean,
    scope: "world",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "color-from", {
    name: CONSTANTS.MODULE_ID + ".setting.color-from.name",
    hint: CONSTANTS.MODULE_ID + ".setting.color-from.hint",
    scope: "world",
    config: true,
    default: "token-disposition",
    type: String,
    choices: {
      "token-disposition": CONSTANTS.MODULE_ID + ".setting.color-from.opt.token-disposition",
      "actor-folder-color": CONSTANTS.MODULE_ID + ".setting.color-from.opt.actor-folder-color",
      // "custom-disposition": CONSTANTS.MODULE_ID + ".setting.color-from.opt.custom-disposition"
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, "base-opacity", {
    name: CONSTANTS.MODULE_ID + ".setting.base-opacity.name",
    hint: CONSTANTS.MODULE_ID + ".setting.base-opacity.hint",
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
    name: CONSTANTS.MODULE_ID + ".setting.fillTexture.name",
    hint: CONSTANTS.MODULE_ID + ".setting.fillTexture.hint",
    scope: "world",
    type: Boolean,
    default: true,
    config: true,
  });

  // game.settings.register(CONSTANTS.MODULE_ID, 'overrideBorderGraphic', {
  //   name: CONSTANTS.MODULE_ID + '.setting.overrideBorderGraphic.name',
  //   hint: CONSTANTS.MODULE_ID + '.setting.overrideBorderGraphic.hint',
  //   scope: 'world',
  //   type: Boolean,
  //   default: false,
  //   config: true,
  // });

  // ===============================
  // SUB FEATURE STANDARD
  // ===============================

  // game.settings.register(CONSTANTS.MODULE_ID, 'pixiFactionsEnabled', {
  //   name: CONSTANTS.MODULE_ID + '.setting.pixiFactionsEnabled.name',
  //   hint: CONSTANTS.MODULE_ID + '.setting.pixiFactionsEnabled.hint',
  //   scope: 'world',
  //   type: Boolean,
  //   default: false,
  //   config: true,
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, 'draw-frames-by-default', {
  //   name: CONSTANTS.MODULE_ID + '.setting.draw-frames-by-default.name',
  //   hint: CONSTANTS.MODULE_ID + '.setting.draw-frames-by-default.hint',
  //   scope: 'world',
  //   config: true,
  //   default: true,
  //   type: Boolean,
  // });

  game.settings.register(CONSTANTS.MODULE_ID, "frame-style", {
    name: CONSTANTS.MODULE_ID + ".setting.frame-style.name",
    hint: CONSTANTS.MODULE_ID + ".setting.frame-style.hint",
    scope: "world",
    config: true,
    default: "flat",
    type: String,
    choices: {
      flat: CONSTANTS.MODULE_ID + ".setting.frame-style.opt.flat",
      beveled: CONSTANTS.MODULE_ID + ".setting.frame-style.opt.beveled",
      // border: CONSTANTS.MODULE_ID + '.setting.frame-style.opt.border',
    },
  });

  // game.settings.register(CONSTANTS.MODULE_ID, 'frame-width', {
  //   name: CONSTANTS.MODULE_ID + '.setting.frame-width.name',
  //   hint: CONSTANTS.MODULE_ID + '.setting.frame-width.hint',
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
    name: CONSTANTS.MODULE_ID + ".setting.frame-opacity.name",
    hint: CONSTANTS.MODULE_ID + ".setting.frame-opacity.hint",
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
  //   name: CONSTANTS.MODULE_ID + '.setting.borderFactionsEnabled.name',
  //   hint: CONSTANTS.MODULE_ID + '.setting.borderFactionsEnabled.hint',
  //   scope: 'world',
  //   type: Boolean,
  //   default: true,
  //   config: true,
  // });

  game.settings.register(CONSTANTS.MODULE_ID, "removeBorders", {
    name: CONSTANTS.MODULE_ID + ".setting.removeBorders.name",
    hint: CONSTANTS.MODULE_ID + ".setting.removeBorders.hint",
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
    name: CONSTANTS.MODULE_ID + ".setting.permanentBorder.name",
    hint: CONSTANTS.MODULE_ID + ".setting.permanentBorder.hint",
    default: false,
    type: Boolean,
    scope: "world",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "borderWidth", {
    name: CONSTANTS.MODULE_ID + ".setting.borderWidth.name",
    hint: CONSTANTS.MODULE_ID + ".setting.borderWidth.hint",
    scope: "world",
    type: Number,
    default: 4,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "borderGridScale", {
    name: CONSTANTS.MODULE_ID + ".setting.borderGridScale.name",
    hint: CONSTANTS.MODULE_ID + ".setting.borderGridScale.hint",
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "borderOffset", {
    name: CONSTANTS.MODULE_ID + ".setting.borderOffset.name",
    hint: CONSTANTS.MODULE_ID + ".setting.borderOffset.hint",
    scope: "world",
    type: Number,
    default: 0,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "circleBorders", {
    name: CONSTANTS.MODULE_ID + ".setting.circleBorders.name",
    hint: CONSTANTS.MODULE_ID + ".setting.circleBorders.hint",
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "scaleBorder", {
    name: CONSTANTS.MODULE_ID + ".setting.scaleBorder.name",
    hint: CONSTANTS.MODULE_ID + ".setting.scaleBorder.hint",
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "hudEnable", {
    name: CONSTANTS.MODULE_ID + ".setting.hudEnable.name",
    hint: CONSTANTS.MODULE_ID + ".setting.hudEnable.hint",
    scope: "world",
    type: Boolean,
    default: true,
    config: true,
  });

  /** Which column should the button be placed on */
  game.settings.register(CONSTANTS.MODULE_ID, "hudColumn", {
    name: `${CONSTANTS.MODULE_ID}.setting.hudColumn.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.hudColumn.hint`,
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
    name: `${CONSTANTS.MODULE_ID}.setting.hudTopBottom.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.hudTopBottom.hint`,
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
    name: CONSTANTS.MODULE_ID + ".setting.controlledColor.name",
    hint: CONSTANTS.MODULE_ID + ".setting.controlledColor.hint",
    scope: "world",
    type: String,
    default: "#FF9829",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "controlledColorEx", {
    name: CONSTANTS.MODULE_ID + ".setting.controlledColorEx.name",
    hint: CONSTANTS.MODULE_ID + ".setting.controlledColorEx.hint",
    scope: "world",
    type: String,
    default: "#000000",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "hostileColor", {
    name: CONSTANTS.MODULE_ID + ".setting.hostileColor.name",
    hint: CONSTANTS.MODULE_ID + ".setting.hostileColor.hint",
    scope: "world",
    type: String,
    default: "#E72124",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "hostileColorEx", {
    name: CONSTANTS.MODULE_ID + ".setting.hostileColorEx.name",
    hint: CONSTANTS.MODULE_ID + ".setting.hostileColorEx.hint",
    scope: "world",
    type: String,
    default: "#000000",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "friendlyColor", {
    name: CONSTANTS.MODULE_ID + ".setting.friendlyColor.name",
    hint: CONSTANTS.MODULE_ID + ".setting.friendlyColor.hint",
    scope: "world",
    type: String,
    default: "#43DFDF",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "friendlyColorEx", {
    name: CONSTANTS.MODULE_ID + ".setting.friendlyColorEx.name",
    hint: CONSTANTS.MODULE_ID + ".setting.friendlyColorEx.hint",
    scope: "world",
    type: String,
    default: "#000000",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "neutralColor", {
    name: CONSTANTS.MODULE_ID + ".setting.neutralColor.name",
    hint: CONSTANTS.MODULE_ID + ".setting.neutralColor.hint",
    scope: "world",
    type: String,
    default: "#F1D836",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "neutralColorEx", {
    name: CONSTANTS.MODULE_ID + ".setting.neutralColorEx.name",
    hint: CONSTANTS.MODULE_ID + ".setting.neutralColorEx.hint",
    scope: "world",
    type: String,
    default: "#000000",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "partyColor", {
    name: CONSTANTS.MODULE_ID + ".setting.partyColor.name",
    hint: CONSTANTS.MODULE_ID + ".setting.partyColor.hint",
    scope: "world",
    type: String,
    default: "#33BC4E",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "partyColorEx", {
    name: CONSTANTS.MODULE_ID + ".setting.partyColorEx.name",
    hint: CONSTANTS.MODULE_ID + ".setting.partyColorEx.hint",
    scope: "world",
    type: String,
    default: "#000000",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "actorFolderColorEx", {
    name: CONSTANTS.MODULE_ID + ".setting.actorFolderColorEx.name",
    hint: CONSTANTS.MODULE_ID + ".setting.actorFolderColorEx.hint",
    scope: "world",
    type: String,
    default: "#000000",
    config: true,
  });

  // Setting off
  game.settings.register(CONSTANTS.MODULE_ID, "customDispositionColorEx", {
    name: CONSTANTS.MODULE_ID + ".setting.customDispositionColorEx.name",
    hint: CONSTANTS.MODULE_ID + ".setting.customDispositionColorEx.hint",
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
