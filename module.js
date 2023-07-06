const CONSTANTS = {
  MODULE_NAME: "token-factions",
  PATH: `modules/token-factions/`
};
CONSTANTS.PATH = `modules/${CONSTANTS.MODULE_NAME}/`;
function debug(msg, args = "") {
  if (game.settings.get(CONSTANTS.MODULE_NAME, "debug")) {
    console.log(`DEBUG | ${CONSTANTS.MODULE_NAME} | ${msg}`, args);
  }
  return msg;
}
function warn(warning, notify = false) {
  warning = `${CONSTANTS.MODULE_NAME} | ${warning}`;
  if (notify)
    ui.notifications?.warn(warning);
  console.warn(warning.replace("<br>", "\n"));
  return warning;
}
function error(error2, notify = true) {
  error2 = `${CONSTANTS.MODULE_NAME} | ${error2}`;
  if (notify)
    ui.notifications?.error(error2);
  return new Error(error2.replace("<br>", "\n"));
}
const i18n = (key) => {
  return game.i18n.localize(key)?.trim();
};
function cleanUpString(stringToCleanUp) {
  const regex = /[^A-Za-z0-9]/g;
  if (stringToCleanUp) {
    return i18n(stringToCleanUp).replace(regex, "").toLowerCase();
  } else {
    return stringToCleanUp;
  }
}
function isStringEquals(stringToCheck1, stringToCheck2, startsWith = false) {
  if (stringToCheck1 && stringToCheck2) {
    const s1 = cleanUpString(stringToCheck1) ?? "";
    const s2 = cleanUpString(stringToCheck2) ?? "";
    if (startsWith) {
      return s1.startsWith(s2) || s2.startsWith(s1);
    } else {
      return s1 === s2;
    }
  } else {
    return stringToCheck1 === stringToCheck2;
  }
}
const registerSettings = function() {
  game.settings.registerMenu(CONSTANTS.MODULE_NAME, "resetAllSettings", {
    name: `${CONSTANTS.MODULE_NAME}.setting.reset.name`,
    hint: `${CONSTANTS.MODULE_NAME}.setting.reset.hint`,
    icon: "fas fa-coins",
    type: ResetSettingsDialog,
    restricted: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "tokenFactionsEnabled", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.tokenFactionsEnabled.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.tokenFactionsEnabled.hint"),
    default: true,
    type: Boolean,
    scope: "world",
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "color-from", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.color-from.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.color-from.hint"),
    scope: "world",
    config: true,
    default: "token-disposition",
    type: String,
    choices: {
      "token-disposition": i18n(CONSTANTS.MODULE_NAME + ".setting.color-from.opt.token-disposition"),
      "actor-folder-color": i18n(CONSTANTS.MODULE_NAME + ".setting.color-from.opt.actor-folder-color")
      // "custom-disposition": i18n(CONSTANTS.MODULE_NAME + ".setting.color-from.opt.custom-disposition")
    }
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "base-opacity", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.base-opacity.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.base-opacity.hint"),
    scope: "world",
    config: true,
    default: 0.5,
    type: Number,
    //@ts-ignore
    range: {
      min: 0,
      max: 1,
      step: 0.05
    }
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "fillTexture", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.fillTexture.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.fillTexture.hint"),
    scope: "world",
    type: Boolean,
    default: true,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "frame-style", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.frame-style.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.frame-style.hint"),
    scope: "world",
    config: true,
    default: "flat",
    type: String,
    choices: {
      flat: i18n(CONSTANTS.MODULE_NAME + ".setting.frame-style.opt.flat"),
      beveled: i18n(CONSTANTS.MODULE_NAME + ".setting.frame-style.opt.beveled")
      // border: i18n(CONSTANTS.MODULE_NAME + '.setting.frame-style.opt.border'),
    }
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "frame-opacity", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.frame-opacity.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.frame-opacity.hint"),
    scope: "world",
    config: true,
    default: 1,
    type: Number,
    //@ts-ignore
    range: {
      min: 0,
      max: 1,
      step: 0.05
    }
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "removeBorders", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.removeBorders.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.removeBorders.hint"),
    scope: "world",
    type: String,
    choices: {
      0: "None",
      1: "Non Owned",
      2: "All"
    },
    default: "0",
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "permanentBorder", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.permanentBorder.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.permanentBorder.hint"),
    default: false,
    type: Boolean,
    scope: "world",
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "borderWidth", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.borderWidth.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.borderWidth.hint"),
    scope: "world",
    type: Number,
    default: 4,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "borderGridScale", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.borderGridScale.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.borderGridScale.hint"),
    scope: "world",
    type: Boolean,
    default: false,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "borderOffset", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.borderOffset.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.borderOffset.hint"),
    scope: "world",
    type: Number,
    default: 0,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "circleBorders", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.circleBorders.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.circleBorders.hint"),
    scope: "world",
    type: Boolean,
    default: false,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "scaleBorder", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.scaleBorder.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.scaleBorder.hint"),
    scope: "world",
    type: Boolean,
    default: false,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "hudEnable", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.hudEnable.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.hudEnable.hint"),
    scope: "world",
    type: Boolean,
    default: true,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "hudColumn", {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudColumn.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudColumn.hint`),
    scope: "world",
    config: true,
    type: String,
    default: "Right",
    choices: {
      Left: "Left",
      Right: "Right"
    }
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "hudTopBottom", {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudTopBottom.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudTopBottom.hint`),
    scope: "world",
    config: true,
    type: String,
    default: "Bottom",
    choices: {
      Top: "Top",
      Bottom: "Bottom"
    }
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "controlledColor", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.controlledColor.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.controlledColor.hint"),
    scope: "world",
    type: String,
    default: "#FF9829",
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "controlledColorEx", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.controlledColorEx.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.controlledColorEx.hint"),
    scope: "world",
    type: String,
    default: "#000000",
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "hostileColor", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.hostileColor.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.hostileColor.hint"),
    scope: "world",
    type: String,
    default: "#E72124",
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "hostileColorEx", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.hostileColorEx.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.hostileColorEx.hint"),
    scope: "world",
    type: String,
    default: "#000000",
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "friendlyColor", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.friendlyColor.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.friendlyColor.hint"),
    scope: "world",
    type: String,
    default: "#43DFDF",
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "friendlyColorEx", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.friendlyColorEx.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.friendlyColorEx.hint"),
    scope: "world",
    type: String,
    default: "#000000",
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "neutralColor", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.neutralColor.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.neutralColor.hint"),
    scope: "world",
    type: String,
    default: "#F1D836",
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "neutralColorEx", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.neutralColorEx.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.neutralColorEx.hint"),
    scope: "world",
    type: String,
    default: "#000000",
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "partyColor", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.partyColor.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.partyColor.hint"),
    scope: "world",
    type: String,
    default: "#33BC4E",
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "partyColorEx", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.partyColorEx.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.partyColorEx.hint"),
    scope: "world",
    type: String,
    default: "#000000",
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "actorFolderColorEx", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.actorFolderColorEx.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.actorFolderColorEx.hint"),
    scope: "world",
    type: String,
    default: "#000000",
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "customDispositionColorEx", {
    name: i18n(CONSTANTS.MODULE_NAME + ".setting.customDispositionColorEx.name"),
    hint: i18n(CONSTANTS.MODULE_NAME + ".setting.customDispositionColorEx.hint"),
    scope: "world",
    type: String,
    default: "#000000",
    config: false
  });
  game.settings.register(CONSTANTS.MODULE_NAME, "debug", {
    name: `${CONSTANTS.MODULE_NAME}.setting.debug.name`,
    hint: `${CONSTANTS.MODULE_NAME}.setting.debug.hint`,
    scope: "client",
    config: true,
    default: false,
    type: Boolean
  });
};
class ResetSettingsDialog extends FormApplication {
  constructor(...args) {
    super(...args);
    return new Dialog({
      title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.title`),
      content: '<p style="margin-bottom:1rem;">' + game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.content`) + "</p>",
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.confirm`),
          callback: async () => {
            const worldSettings = game.settings.storage?.get("world")?.filter((setting) => setting.key.startsWith(`${CONSTANTS.MODULE_NAME}.`));
            for (let setting of worldSettings) {
              console.log(`Reset setting '${setting.key}'`);
              await setting.delete();
            }
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.cancel`)
        }
      },
      default: "cancel"
    });
  }
  async _updateObject(event, formData = null) {
  }
}
class FactionGraphic {
  INT = 0;
  EX = 0;
  ICON = "";
  TEXTURE_INT = PIXI.Texture.EMPTY;
  TEXTURE_EX = PIXI.Texture.EMPTY;
  INT_S = "";
  EX_S = "";
  constructor() {
    this.INT = 0;
    this.EX = 0;
    this.ICON = "";
    this.TEXTURE_INT = PIXI.Texture.EMPTY;
    this.TEXTURE_EX = PIXI.Texture.EMPTY;
    this.INT_S = "";
    this.EX_S = "";
  }
}
class TokenFactions {
  static TOKEN_FACTIONS_FLAGS = {
    FACTION_DRAW_FRAME: "factionDrawFrame",
    //'draw-frame',
    FACTION_DISABLE: "factionDisable",
    // 'disable'
    // FACTION_NO_BORDER: 'factionNoBorder', // noBorder
    FACTION_CUSTOM_COLOR_INT: "factionCustomColorInt",
    FACTION_CUSTOM_COLOR_EXT: "factionCustomColorExt",
    FACTION_CUSTOM_FRAME_OPACITY: "factionCustomFrameOpacity",
    FACTION_CUSTOM_BASE_OPACITY: "factionCustomBaseOpacity"
  };
  static TOKEN_FACTIONS_FRAME_STYLE = {
    FLAT: "flat",
    BELEVELED: "beveled",
    BORDER: "border"
  };
  static dispositionKey = (token) => {
    const dispositionValue = parseInt(String(token.document.disposition), 10);
    let disposition;
    if (token.actor && token.actor.hasPlayerOwner && token.actor.type === "character") {
      disposition = "party-member";
    } else if (token.actor && token.actor.hasPlayerOwner) {
      disposition = "party-npc";
    } else if (dispositionValue === 1) {
      disposition = "friendly-npc";
    } else if (dispositionValue === 0) {
      disposition = "neutral-npc";
    } else if (dispositionValue === -1) {
      disposition = "hostile-npc";
    }
    return disposition;
  };
  static bevelGradient;
  static bevelTexture;
  static defaultColors;
  static dispositions;
  static async onInit() {
    TokenFactions.defaultColors = {
      "party-member": game.settings.get(CONSTANTS.MODULE_NAME, "partyColor"),
      //'#33bc4e',
      "party-npc": game.settings.get(CONSTANTS.MODULE_NAME, "partyColor"),
      //'#33bc4e',
      "friendly-npc": game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColor"),
      //'#43dfdf',
      "neutral-npc": game.settings.get(CONSTANTS.MODULE_NAME, "neutralColor"),
      //'#f1d836',
      "hostile-npc": game.settings.get(CONSTANTS.MODULE_NAME, "hostileColor"),
      //'#e72124',
      "controlled-npc": game.settings.get(CONSTANTS.MODULE_NAME, "controlledColor"),
      "neutral-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "neutralColorEx"),
      "friendly-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColorEx"),
      "hostile-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "hostileColorEx"),
      "controlled-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "controlledColorEx"),
      "party-external-member": game.settings.get(CONSTANTS.MODULE_NAME, "partyColorEx"),
      "party-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "partyColorEx")
      //"target-npc": game.settings.get(CONSTANTS.MODULE_NAME, "targetColor"),
      //"target-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "targetColorEx")
    };
    TokenFactions.dispositions = Object.keys(TokenFactions.defaultColors);
    TokenFactions.bevelGradient = await loadTexture(`modules/${CONSTANTS.MODULE_NAME}/assets/bevel-gradient.jpg`);
    TokenFactions.bevelTexture = await loadTexture(`modules/${CONSTANTS.MODULE_NAME}/assets/bevel-texture.png`);
  }
  static renderTokenConfig = async function(config, html) {
    config.object;
    if (!game.user?.isGM) {
      return;
    }
    if (!html) {
      return;
    }
    const factionDisableValue = config.object.getFlag(
      CONSTANTS.MODULE_NAME,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE
    ) ? "checked" : "";
    const currentCustomColorTokenInt = config.object.getFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT) || "#000000";
    const currentCustomColorTokenExt = config.object.getFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT) || "#000000";
    const currentCustomColorTokenFrameOpacity = config.object.getFlag(
      CONSTANTS.MODULE_NAME,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY
    ) || 0.5;
    const currentCustomColorTokenBaseOpacity = config.object.getFlag(
      CONSTANTS.MODULE_NAME,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY
    ) || 0.5;
    config.position.width = 540;
    config.setPosition(config.position);
    const nav = html.find(`nav.sheet-tabs.tabs[data-group="main"]`);
    nav.append(
      $(`
			<a class="item" data-tab="factions">
        <i class="fas fa-user-circle"></i>
				${i18n("token-factions.label.factions")}
			</a>
		`)
    );
    const formConfig = `
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomDisable")}</label>
        <input type="checkbox"
          data-edit="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}"
          name="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}"
          data-dtype="Boolean" ${factionDisableValue}>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenInt")}</label>
        <input type="color"
          data-edit="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT}"
          name="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT}"
          data-dtype="String" value="${currentCustomColorTokenInt}"></input>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenExt")}</label>
        <input type="color"
          data-edit="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT}"
          name="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT}"
          data-dtype="String" value="${currentCustomColorTokenExt}"></input>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenFrameOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          data-edit="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY}"
          name="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY}"
          data-dtype="Number" value="${currentCustomColorTokenFrameOpacity}"></input>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenBaseOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          data-edit="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY}"
          name="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY}"
          data-dtype="Number" value="${currentCustomColorTokenBaseOpacity}"></input>
      </div>
    `;
    nav.parent().find("footer").before(
      $(`
			<div class="tab" data-tab="factions">
				${formConfig}
			</div>
		`)
    );
    nav.parent().find('.tab[data-tab="factions"] input[type="checkbox"][data-edit]').change(config._onChangeInput.bind(config));
  };
  // static _applyFactions = async function (document | Actor, updateData): Promise<void> {
  // 	// Set the disable flag
  // 	let propertyNameDisable = `flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`;
  // 	if (document instanceof Actor) {
  // 		propertyNameDisable = "token." + propertyNameDisable;
  // 	}
  // 	const factionDisableValue = getProperty(updateData, propertyNameDisable);
  // 	if (factionDisableValue !== undefined && factionDisableValue !== null) {
  // 		setProperty(updateData, propertyNameDisable, factionDisableValue);
  // 		if (!factionDisableValue) {
  // 			if (document instanceof Actor) {
  // 				const actor = <Actor>document;
  // 				//@ts-ignore
  // 				const token = actor.token?._object;
  // 				// token.refresh();
  // 				await TokenFactions.updateTokenDataFaction(token.document);
  // 				// token.draw();
  // 			} else {
  // 				const tokenDocument = document;
  // 				//@ts-ignore
  // 				const token = tokenDocument?._object;
  // 				// token.refresh();
  // 				await TokenFactions.updateTokenDataFaction(token.document);
  // 				// token.draw();
  // 			}
  // 		}
  // 	}
  // };
  static updateTokenDataFaction(tokenData) {
    let tokens;
    try {
      tokens = canvas.tokens?.placeables;
    } catch (e) {
      return;
    }
    if (tokenData?.id) {
      const token = canvas.tokens?.placeables.find((tokenPlaceable) => tokenPlaceable.id === tokenData.id);
      if (token) {
        tokens = [token];
      }
    }
    tokens.forEach((token) => {
      TokenFactions.updateTokenFaction(token);
    });
  }
  static updateTokenFaction(token) {
    if (!token) {
      return void 0;
    }
    if (token instanceof TokenDocument) {
      token = token?.object;
    }
    if (!token.id) {
      return token;
    }
    if (!token.document) {
      return token;
    }
    if (!(token instanceof Token)) {
      return token;
    }
    token.sortableChildren = true;
    if (!token.faction || token.faction.destroyed) {
      token.faction = token.addChildAt(new PIXI.Container(), 0);
    }
    token.faction.removeChildren().forEach((c) => c.destroy());
    let factionBorderContainer = token.faction;
    factionBorderContainer = TokenFactions._drawBorderFaction(token, factionBorderContainer);
    if (token.mesh) {
      if (token.border) {
        if (token.mesh.zIndex >= token.border.zIndex) {
          token.mesh.zIndex = token.border.zIndex - 1;
          if (token.faction.zIndex >= token.mesh.zIndex) {
            token.faction.zIndex = token.mesh.zIndex - 1;
          }
        }
        if (token.zIndex >= token.border.zIndex) {
          token.zIndex = token.border.zIndex - 1;
          if (token.faction.zIndex >= token.zIndex) {
            token.faction.zIndex = token.zIndex - 1;
          }
        }
        if (token.faction.zIndex >= token.border.zIndex) {
          token.faction.zIndex = token.border.zIndex - 1;
        }
      } else {
        if (token.faction.zIndex >= token.mesh.zIndex) {
          token.faction.zIndex = token.mesh.zIndex - 1;
        }
      }
    } else {
      if (token.border) {
        if (token.zIndex >= token.border.zIndex) {
          token.zIndex = token.border.zIndex - 1;
          if (token.faction.zIndex >= token.zIndex) {
            token.faction.zIndex = token.zIndex - 1;
          }
        }
      } else {
        if (token.faction.zIndex >= token.zIndex) {
          token.faction.zIndex = token.zIndex - 1;
        }
      }
    }
    return token;
  }
  // START NEW MANAGE
  static AddBorderToggle(app, html, data) {
    if (!game.user?.isGM) {
      return;
    }
    if (!game.settings.get(CONSTANTS.MODULE_NAME, "hudEnable")) {
      return;
    }
    if (!app?.object?.document) {
      return;
    }
    const factionDisableFlag = app.object.document.getFlag(
      CONSTANTS.MODULE_NAME,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE
    );
    const borderButton = `
    <div class="control-icon factionBorder
      ${factionDisableFlag ? "active" : ""}"
      title="Toggle Faction Border"> <i class="fas fa-angry"></i>
    </div>`;
    const settingHudColClass = game.settings.get(CONSTANTS.MODULE_NAME, "hudColumn") ?? "right";
    const settingHudTopBottomClass = game.settings.get(CONSTANTS.MODULE_NAME, "hudTopBottom") ?? "bottom";
    const buttonPos = "." + settingHudColClass.toLowerCase();
    const col = html.find(buttonPos);
    if (settingHudTopBottomClass.toLowerCase() === "top") {
      col.prepend(borderButton);
    } else {
      col.append(borderButton);
    }
    html.find(".factionBorder").click(this.ToggleBorder.bind(app));
    html.find(".factionBorder").contextmenu(this.ToggleCustomBorder.bind(app));
  }
  static async ToggleBorder(event) {
    const borderIsDisabled = this.object.document.getFlag(
      CONSTANTS.MODULE_NAME,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE
    );
    for (const token of canvas.tokens?.controlled) {
      await token.document.setFlag(
        CONSTANTS.MODULE_NAME,
        TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE,
        !borderIsDisabled
      );
    }
    event.currentTarget.classList.toggle("active", !borderIsDisabled);
  }
  static async ToggleCustomBorder(event) {
    const tokenTmp = this.object;
    const currentCustomColorTokenInt = tokenTmp.document.getFlag(
      CONSTANTS.MODULE_NAME,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT
    ) || "#000000";
    const currentCustomColorTokenExt = tokenTmp.document.getFlag(
      CONSTANTS.MODULE_NAME,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT
    ) || "#000000";
    const currentCustomColorTokenFrameOpacity = tokenTmp.document.getFlag(
      CONSTANTS.MODULE_NAME,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY
    ) || 0.5;
    const currentCustomColorTokenBaseOpacity = tokenTmp.document.getFlag(
      CONSTANTS.MODULE_NAME,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY
    ) || 0.5;
    const dialogContent = `
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenInt")}</label>
        <input type="color"
          value="${currentCustomColorTokenInt}"
          data-edit="token-factions.currentCustomColorTokenInt"></input>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenExt")}</label>
        <input type="color"
          value="${currentCustomColorTokenExt}"
          data-edit="token-factions.currentCustomColorTokenExt"></input>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenFrameOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          value="${currentCustomColorTokenFrameOpacity}"
          data-edit="token-factions.currentCustomColorTokenFrameOpacity"></input>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenBaseOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          value="${currentCustomColorTokenBaseOpacity}"
          data-edit="token-factions.currentCustomColorTokenBaseOpacity"></input>
      </div>
      `;
    const d = new Dialog({
      title: i18n("token-factions.label.chooseCustomColorToken"),
      content: dialogContent,
      buttons: {
        yes: {
          label: i18n("token-factions.label.applyCustomColor"),
          //@ts-ignore
          callback: async (html) => {
            const newCurrentCustomColorTokenInt = $(
              html.find(`input[data-edit='token-factions.currentCustomColorTokenInt']`)[0]
            ).val();
            const newCurrentCustomColorTokenExt = $(
              html.find(`input[data-edit='token-factions.currentCustomColorTokenExt']`)[0]
            ).val();
            const newCurrentCustomColorTokenFrameOpacity = $(
              html.find(
                `input[data-edit='token-factions.currentCustomColorTokenFrameOpacity']`
              )[0]
            ).val();
            const newCurrentCustomColorTokenBaseOpacity = $(
              html.find(`input[data-edit='token-factions.currentCustomColorTokenBaseOpacity']`)[0]
            ).val();
            for (const token of canvas.tokens?.controlled) {
              token.document.setFlag(
                CONSTANTS.MODULE_NAME,
                TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT,
                newCurrentCustomColorTokenInt
              );
              token.document.setFlag(
                CONSTANTS.MODULE_NAME,
                TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT,
                newCurrentCustomColorTokenExt
              );
              token.document.setFlag(
                CONSTANTS.MODULE_NAME,
                TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY,
                newCurrentCustomColorTokenFrameOpacity
              );
              token.document.setFlag(
                CONSTANTS.MODULE_NAME,
                TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY,
                newCurrentCustomColorTokenBaseOpacity
              );
            }
          }
        },
        no: {
          label: i18n("token-factions.label.doNothing"),
          callback: (html) => {
          }
        }
      },
      default: "no"
    });
    d.render(true);
  }
  static _clamp(value, max, min) {
    return Math.min(Math.max(value, min), max);
  }
  static _componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  static _rgbToHex(A) {
    if (A[0] === void 0 || A[1] === void 0 || A[2] === void 0)
      console.error("RGB color invalid");
    return "#" + TokenFactions._componentToHex(A[0]) + TokenFactions._componentToHex(A[1]) + TokenFactions._componentToHex(A[2]);
  }
  static _hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  static _interpolateColor(color1, color2, factor) {
    if (arguments.length < 3) {
      factor = 0.5;
    }
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
  }
  // My function to interpolate between two colors completely, returning an array
  static _interpolateColors(color1, color2, steps) {
    const stepFactor = 1 / (steps - 1);
    const interpolatedColorArray = [];
    color1 = color1.match(/\d+/g).map(Number);
    color2 = color2.match(/\d+/g).map(Number);
    for (let i = 0; i < steps; i++) {
      interpolatedColorArray.push(TokenFactions._interpolateColor(color1, color2, stepFactor * i));
    }
    return interpolatedColorArray;
  }
  // static refreshAll() {
  // 	canvas.tokens?.placeables.forEach((t) => t.draw());
  // }
  // ADDED
  static async updateTokensAll() {
    canvas.tokens?.placeables.forEach((tokenDoc) => {
      TokenFactions._updateTokensBorder(tokenDoc.document);
    });
  }
  static async _updateTokensBorder(tokenData) {
    const currentTokenID = tokenData?.id ? tokenData?.id : tokenData?._id;
    const tokens = [];
    const tokenDoc = canvas.tokens?.get(currentTokenID)?.document;
    if (!tokenDoc) {
      const actorID = currentTokenID;
      const scene = game.scenes?.get(game.user?.viewedScene);
      if (scene) {
        scene.tokens.forEach((tokenTmp) => {
          if (tokenTmp.actor && tokenTmp.actor.id === actorID) {
            tokens.push(tokenTmp);
          }
        });
      }
    } else {
      tokens.push(tokenDoc);
    }
    tokens.forEach((tokenDoc2) => {
      if (tokenDoc2) {
        const tokenID = tokenDoc2.id;
        const sceneID = (canvas.tokens?.get(tokenDoc2.id)).scene.id;
        const specifiedScene = game.scenes?.get(sceneID);
        if (specifiedScene) {
          if (!specifiedScene) {
            return;
          }
          tokenDoc2 = specifiedScene.tokens.find((tokenTmp) => {
            return tokenTmp.id === tokenID;
          });
        }
        if (!tokenDoc2) {
          let foundToken = null;
          game.scenes?.find((sceneTmp) => {
            if (!sceneTmp) {
              foundToken = null;
            }
            foundToken = sceneTmp.tokens.find((token2) => {
              return token2.id === tokenID;
            });
            return !!foundToken;
          });
          tokenDoc2 = foundToken;
        }
      }
      if (!tokenDoc2) {
        return;
      }
      const token = tokenDoc2._object;
      if (!token.id) {
        return;
      }
      token.sortableChildren = true;
      if (!token.faction || token.faction.destroyed) {
        token.faction = token.addChildAt(new PIXI.Container(), 0);
      }
      token.faction.removeChildren().forEach((c) => c.destroy());
      let factionBorderContainer = token.faction;
      factionBorderContainer = TokenFactions._drawBorderFaction(token, factionBorderContainer);
      if (token.mesh) {
        if (token.border) {
          if (token.mesh.zIndex >= token.border.zIndex) {
            token.mesh.zIndex = token.border.zIndex - 1;
            if (token.faction.zIndex >= token.mesh.zIndex) {
              token.faction.zIndex = token.mesh.zIndex - 1;
            }
          }
          if (token.zIndex >= token.border.zIndex) {
            token.zIndex = token.border.zIndex - 1;
            if (token.faction.zIndex >= token.zIndex) {
              token.faction.zIndex = token.zIndex - 1;
            }
          }
          if (token.faction.zIndex >= token.border.zIndex) {
            token.faction.zIndex = token.border.zIndex - 1;
          }
        } else {
          if (token.faction.zIndex >= token.mesh.zIndex) {
            token.faction.zIndex = token.mesh.zIndex - 1;
          }
        }
      } else {
        if (token.border) {
          if (token.zIndex >= token.border.zIndex) {
            token.zIndex = token.border.zIndex - 1;
            if (token.faction.zIndex >= token.zIndex) {
              token.faction.zIndex = token.zIndex - 1;
            }
          }
        } else {
          if (token.faction.zIndex >= token.zIndex) {
            token.faction.zIndex = token.zIndex - 1;
          }
        }
      }
    });
    return;
  }
  static colorBorderFaction(token) {
    if (!TokenFactions.defaultColors) {
      TokenFactions.onInit();
    }
    const colorFrom = game.settings.get(CONSTANTS.MODULE_NAME, "color-from");
    let color;
    let icon;
    if (colorFrom === "token-disposition") {
      const disposition = TokenFactions.dispositionKey(token);
      if (disposition) {
        color = TokenFactions.defaultColors[disposition];
      }
    } else if (colorFrom === "actor-folder-color") {
      if (token.actor && token.actor.folder && token.actor.folder) {
        color = token.actor.folder.color;
        icon = token.actor.folder.icon;
      }
    } else {
      const disposition = TokenFactions.dispositionKey(token);
      if (disposition) {
        color = game.settings.get(CONSTANTS.MODULE_NAME, `custom-${disposition}-color`);
      }
    }
    const currentCustomColorTokenInt = token.document.getFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT);
    const currentCustomColorTokenExt = token.document.getFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT);
    const overrides = {
      CONTROLLED: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "controlledColor")).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "controlledColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "controlledColor")),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "controlledColorEx"))
      },
      FRIENDLY: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColor")).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColor")),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColorEx"))
      },
      NEUTRAL: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "neutralColor")).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "neutralColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "neutralColor")),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "neutralColorEx"))
      },
      HOSTILE: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "hostileColor")).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "hostileColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "hostileColor")),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "hostileColorEx"))
      },
      PARTY: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "partyColor")).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "partyColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "partyColor")),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "partyColorEx"))
      },
      ACTOR_FOLDER_COLOR: {
        INT: parseInt(String(color).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "actorFolderColorEx")).substr(1), 16),
        ICON: icon ? String(icon) : "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(color),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "actorFolderColorEx"))
      },
      CUSTOM_DISPOSITION: {
        INT: parseInt(String(color).substr(1), 16),
        EX: parseInt(
          String(game.settings.get(CONSTANTS.MODULE_NAME, "customDispositionColorEx")).substr(1),
          16
        ),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(color),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "customDispositionColorEx"))
      }
    };
    let borderControlCustom = null;
    if (currentCustomColorTokenInt && currentCustomColorTokenInt != "#000000") {
      borderControlCustom = {
        INT: parseInt(String(currentCustomColorTokenInt).substr(1), 16),
        EX: parseInt(String(currentCustomColorTokenExt).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(currentCustomColorTokenInt),
        EX_S: String(currentCustomColorTokenExt)
      };
    }
    let borderColor = new FactionGraphic();
    if (borderControlCustom) {
      borderColor = borderControlCustom;
    } else if (colorFrom === "token-disposition") {
      const disPath = CONST.TOKEN_DISPOSITIONS;
      const d = parseInt(token.document.disposition);
      if (!game.user?.isGM && token.owner) {
        borderColor = overrides.CONTROLLED;
      } else if (token.actor?.hasPlayerOwner) {
        borderColor = overrides.PARTY;
      } else if (d === disPath.FRIENDLY) {
        borderColor = overrides.FRIENDLY;
      } else if (d === disPath.NEUTRAL) {
        borderColor = overrides.NEUTRAL;
      } else {
        borderColor = overrides.HOSTILE;
      }
    } else if (colorFrom === "actor-folder-color") {
      borderColor = overrides.ACTOR_FOLDER_COLOR;
    } else {
      borderColor = overrides.CUSTOM_DISPOSITION;
    }
    return borderColor;
  }
  static _drawBorderFaction(token, container) {
    if (!container && token.faction) {
      container = token.faction;
    }
    if (!container) {
      debug(`No container is founded or passed`);
      return;
    }
    if (!token) {
      debug(`No token is founded or passed`);
      return;
    }
    if (token.x === 0 && token.y === 0) {
      if (token.document.x === 0 && token.document.y === 0) {
        debug(`No token is founded or passed`);
        return;
      }
    }
    if (container.removeChildren) {
      container.children.forEach((c) => c.clear());
    } else if (token.removeChildren) {
      token.children.forEach((c) => {
        if (c.source === CONSTANTS.MODULE_NAME) {
          c.destroy();
        }
      });
    }
    const borderColor = TokenFactions.colorBorderFaction(token);
    if (!borderColor) {
      return;
    }
    if (!borderColor.INT || Number.isNaN(borderColor.INT)) {
      return;
    }
    switch (game.settings.get(CONSTANTS.MODULE_NAME, "removeBorders")) {
      case "0":
        break;
      case "1":
        if (!token.owner) {
          return;
        }
        break;
      case "2":
        return;
    }
    let skipDraw;
    try {
      skipDraw = getProperty(
        token.document,
        `flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`
      );
    } catch (e) {
      token.document.setFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE, false);
      skipDraw = token.document.getFlag(
        CONSTANTS.MODULE_NAME,
        TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE
      );
    }
    if (skipDraw) {
      return;
    }
    const frameStyle = String(game.settings.get(CONSTANTS.MODULE_NAME, "frame-style"));
    if (frameStyle == TokenFactions.TOKEN_FACTIONS_FRAME_STYLE.FLAT) {
      const fillTexture = game.settings.get(CONSTANTS.MODULE_NAME, "fillTexture");
      TokenFactions._drawBorder(token, borderColor, container, fillTexture);
    } else if (frameStyle == TokenFactions.TOKEN_FACTIONS_FRAME_STYLE.BELEVELED) {
      game.settings.get(CONSTANTS.MODULE_NAME, "fillTexture");
      const frameWidth = canvas.grid?.grid?.w * (game.settings.get(CONSTANTS.MODULE_NAME, "borderWidth") / 100);
      let t = game.settings.get(CONSTANTS.MODULE_NAME, "borderWidth") || CONFIG.Canvas.objectBorderThickness;
      game.settings.get(CONSTANTS.MODULE_NAME, "borderOffset");
      if (game.settings.get(CONSTANTS.MODULE_NAME, "permanentBorder") && token._controlled) {
        t = t * 2;
      }
      const sB = game.settings.get(CONSTANTS.MODULE_NAME, "scaleBorder");
      const bS = game.settings.get(CONSTANTS.MODULE_NAME, "borderGridScale");
      const nBS = bS ? canvas.dimensions?.size / 100 : 1;
      const sX = sB ? token.document.texture.scaleX : 1;
      const sY = sB ? token.document.texture.scaleY : 1;
      sB ? (token.w - token.w * sX) / 2 : 0;
      sB ? (token.h - token.h * sY) / 2 : 0;
      let frameOpacity = game.settings.get(CONSTANTS.MODULE_NAME, "frame-opacity") || 0.5;
      game.settings.get(CONSTANTS.MODULE_NAME, "base-opacity") || 0.5;
      const customFrameOpacity = token.document.getFlag(
        CONSTANTS.MODULE_NAME,
        TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY
      );
      token.document.getFlag(
        CONSTANTS.MODULE_NAME,
        TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY
      );
      if (customFrameOpacity && customFrameOpacity != 0.5) {
        frameOpacity = customFrameOpacity;
      }
      borderColor.TEXTURE_INT || PIXI.Texture.EMPTY;
      borderColor.TEXTURE_EX || PIXI.Texture.EMPTY;
      const h = Math.round(t / 2);
      const outerRing = TokenFactions._drawGradient(token, borderColor.INT, TokenFactions.bevelGradient);
      const innerRing = TokenFactions._drawGradient(token, borderColor.INT, TokenFactions.bevelGradient);
      const ringTexture = TokenFactions._drawTexture(token, borderColor.INT, TokenFactions.bevelTexture);
      const outerRingMask = new PIXI.Graphics();
      const innerRingMask = new PIXI.Graphics();
      const ringTextureMask = new PIXI.Graphics();
      outerRing.alpha = frameOpacity;
      innerRing.alpha = frameOpacity;
      ringTexture.alpha = frameOpacity;
      innerRing.pivot.set(1e3, 1e3);
      innerRing.angle = 180;
      outerRingMask.lineStyle(h * nBS, borderColor.EX, 1).beginFill(Color.from(16777215), 0).drawCircle(token.w / 2, token.h / 2, token.w / 2).endFill();
      innerRingMask.lineStyle(h * nBS, borderColor.EX, 1).beginFill(Color.from(16777215), 0).drawCircle(token.w / 2, token.h / 2, token.w / 2 - frameWidth / 2).endFill();
      ringTextureMask.lineStyle(h * nBS, borderColor.EX, 1).beginFill(Color.from(16777215), 0).drawCircle(token.w / 2, token.h / 2, token.w / 2).endFill();
      token.faction.addChild(outerRing);
      token.faction.addChild(outerRingMask);
      outerRing.mask = outerRingMask;
      token.faction.addChild(innerRing);
      token.faction.addChild(innerRingMask);
      innerRing.mask = innerRingMask;
      token.faction.addChild(ringTexture);
      token.faction.addChild(ringTextureMask);
      ringTexture.mask = ringTextureMask;
    } else {
      const fillTexture = game.settings.get(CONSTANTS.MODULE_NAME, "fillTexture");
      TokenFactions._drawBorder(token, borderColor, container, fillTexture);
    }
    return container;
  }
  static _drawBorder(token, borderColor, container, fillTexture) {
    const factionBorder = new PIXI.Graphics();
    if (container.addChild) {
      container.addChild(factionBorder);
    } else if (token.addChild) {
      factionBorder.source = CONSTANTS.MODULE_NAME;
      token.addChild(factionBorder);
    }
    if (canvas.interface.reverseMaskfilter) {
      factionBorder.filters = [canvas.interface.reverseMaskfilter];
    }
    let t = game.settings.get(CONSTANTS.MODULE_NAME, "borderWidth") || CONFIG.Canvas.objectBorderThickness;
    const p = game.settings.get(CONSTANTS.MODULE_NAME, "borderOffset");
    if (game.settings.get(CONSTANTS.MODULE_NAME, "permanentBorder") && token._controlled) {
      t = t * 2;
    }
    const sB = game.settings.get(CONSTANTS.MODULE_NAME, "scaleBorder");
    const bS = game.settings.get(CONSTANTS.MODULE_NAME, "borderGridScale");
    const nBS = bS ? canvas.dimensions?.size / 100 : 1;
    const sX = sB ? token.document.texture.scaleX : 1;
    const sY = sB ? token.document.texture.scaleY : 1;
    const sW = sB ? (token.w - token.w * sX) / 2 : 0;
    const sH = sB ? (token.h - token.h * sY) / 2 : 0;
    const s = sX;
    let frameOpacity = game.settings.get(CONSTANTS.MODULE_NAME, "frame-opacity") || 0.5;
    let baseOpacity = game.settings.get(CONSTANTS.MODULE_NAME, "base-opacity") || 0.5;
    const customFrameOpacity = token.document.getFlag(
      CONSTANTS.MODULE_NAME,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY
    );
    const customBaseOpacity = token.document.getFlag(
      CONSTANTS.MODULE_NAME,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY
    );
    if (customFrameOpacity && customFrameOpacity != 0.5) {
      frameOpacity = customFrameOpacity;
    }
    if (customBaseOpacity && customBaseOpacity != 0.5) {
      baseOpacity = customBaseOpacity;
    }
    const textureINT = borderColor.TEXTURE_INT || PIXI.Texture.EMPTY;
    const textureEX = borderColor.TEXTURE_EX || PIXI.Texture.EMPTY;
    factionBorder.alpha = frameOpacity;
    const gt = CONST.GRID_TYPES;
    const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];
    if (game.settings.get(CONSTANTS.MODULE_NAME, "circleBorders")) {
      const h = Math.round(t / 2);
      if (fillTexture) {
        factionBorder.beginFill(Color.from(borderColor.EX), baseOpacity).lineStyle(t * nBS, borderColor.EX, 0.8).drawCircle(token.w / 2, token.h / 2, token.w / 2 * s + t + p).beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity }).endFill();
        factionBorder.beginFill(Color.from(borderColor.INT), baseOpacity).lineStyle(h * nBS, Color.from(borderColor.INT), 1).drawCircle(token.w / 2, token.h / 2, token.w / 2 * s + h + t / 2 + p).beginTextureFill({ texture: textureINT, color: Color.from(borderColor.INT), alpha: baseOpacity }).endFill();
      }
      factionBorder.lineStyle(t * nBS, borderColor.EX, 0.8).drawCircle(token.w / 2, token.h / 2, token.w / 2 * s + t + p);
      factionBorder.lineStyle(h * nBS, Color.from(borderColor.INT), 1).drawCircle(token.w / 2, token.h / 2, token.w / 2 * s + h + t / 2 + p);
    } else if (hexTypes.includes(canvas.grid?.type) && token.width === 1 && token.height === 1) {
      const q = Math.round(p / 2);
      const polygon = canvas.grid?.grid?.getPolygon(
        -1.5 - q + sW,
        -1.5 - q + sH,
        (token.w + 2) * sX + p,
        (token.h + 2) * sY + p
      );
      if (fillTexture) {
        factionBorder.beginFill(Color.from(borderColor.EX), baseOpacity).lineStyle(t * nBS, borderColor.EX, 0.8).drawPolygon(polygon).beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity }).endFill();
        factionBorder.beginFill(Color.from(borderColor.INT), baseOpacity).lineStyle(t * nBS / 2, Color.from(borderColor.INT), 1).drawPolygon(polygon).beginTextureFill({ texture: textureINT, color: Color.from(borderColor.INT), alpha: baseOpacity }).endFill();
      }
      factionBorder.lineStyle(t * nBS, borderColor.EX, 0.8).drawPolygon(polygon);
      factionBorder.lineStyle(t * nBS / 2, Color.from(borderColor.INT), 1).drawPolygon(polygon);
    } else {
      const q = Math.round(p / 2);
      const h = Math.round(t / 2);
      const o = Math.round(h / 2);
      if (fillTexture) {
        factionBorder.beginFill(Color.from(borderColor.EX), baseOpacity).lineStyle(t * nBS, borderColor.EX, 0.8).drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3).beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity }).endFill();
        factionBorder.beginFill(Color.from(borderColor.INT), baseOpacity).lineStyle(h * nBS, Color.from(borderColor.INT), 1).drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3).beginTextureFill({ texture: textureINT, color: Color.from(borderColor.INT), alpha: baseOpacity }).endFill();
      }
      factionBorder.lineStyle(t * nBS, borderColor.EX, 0.8).drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);
      factionBorder.lineStyle(h * nBS, Color.from(borderColor.INT), 1).drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);
    }
  }
  static clearAllGridFaction() {
    const tokens = canvas.tokens?.placeables;
    for (const token of tokens) {
      if (token.faction) {
        token.faction.removeChildren().forEach((c) => c.destroy());
      }
      TokenFactions.clearGridFaction(token.id);
    }
  }
  static clearGridFaction(tokenId) {
    if (canvas?.grid?.faction) {
      const factionBorder = canvas?.grid?.faction[tokenId];
      if (factionBorder && !factionBorder.destroyed) {
        factionBorder.children.forEach((c) => {
          if (c && !c._destroyed) {
            c.clear();
          }
        });
        factionBorder?.destroy();
        delete canvas?.grid?.faction[tokenId];
      }
    }
  }
  static _drawGradient(token, color, bevelGradient) {
    const bg = new PIXI.Sprite(bevelGradient);
    bg.anchor.set(0, 0);
    bg.width = token.w;
    bg.height = token.h;
    bg.tint = color;
    return bg;
  }
  static _drawTexture(token, color, bevelTexture) {
    const bg = new PIXI.Sprite(bevelTexture);
    bg.anchor.set(0, 0);
    bg.width = 400;
    bg.height = 400;
    bg.tint = color;
    return bg;
  }
}
const API = {
  async disableDrawBorderFactionsFromTokens(tokenIdsOrNames) {
    for (const tokenIdOrName of tokenIdsOrNames) {
      this.disableDrawBorderFactionsFromToken(tokenIdOrName);
    }
  },
  async disableDrawBorderFactionsFromToken(tokenIdOrName) {
    const token = canvas.tokens?.placeables.find((t) => {
      return isStringEquals(t.id, tokenIdOrName) || isStringEquals(t.name, tokenIdOrName);
    });
    if (!token) {
      warn(`No token is been found with reference '${tokenIdOrName}'`, true);
      return;
    }
    await token.document.setFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE, true);
  },
  async enableDrawBorderFactionsFromTokens(tokenIdsOrNames) {
    for (const tokenIdOrName of tokenIdsOrNames) {
      this.enableDrawBorderFactionsFromToken(tokenIdOrName);
    }
  },
  async enableDrawBorderFactionsFromToken(tokenIdOrName) {
    const token = canvas.tokens?.placeables.find((t) => {
      return isStringEquals(t.id, tokenIdOrName) || isStringEquals(t.name, tokenIdOrName);
    });
    if (!token) {
      warn(`No token is been found with reference '${tokenIdOrName}'`, true);
      return;
    }
    await token.document.setFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE, false);
  },
  async retrieveBorderFactionsColorFromToken(tokenIdOrName) {
    const token = canvas.tokens?.placeables.find((t) => {
      return isStringEquals(t.id, tokenIdOrName) || isStringEquals(t.name, tokenIdOrName);
    });
    const factionGraphicDefaultS = "#000000";
    if (!token) {
      warn(`No token is been found with reference '${tokenIdOrName}'`, true);
      return factionGraphicDefaultS;
    }
    const borderColor = TokenFactions.colorBorderFaction(token);
    if (!borderColor) {
      return factionGraphicDefaultS;
    }
    if (!borderColor.INT || Number.isNaN(borderColor.INT)) {
      return factionGraphicDefaultS;
    }
    switch (game.settings.get(CONSTANTS.MODULE_NAME, "removeBorders")) {
      case "0": {
        break;
      }
      case "1": {
        if (!token.owner) {
          return factionGraphicDefaultS;
        }
        break;
      }
      case "2": {
        return factionGraphicDefaultS;
      }
    }
    let skipDraw;
    try {
      skipDraw = token.document.getFlag(
        CONSTANTS.MODULE_NAME,
        TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE
      );
    } catch (e) {
      await token.document.setFlag(
        CONSTANTS.MODULE_NAME,
        TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE,
        false
      );
      skipDraw = token.document.getFlag(
        CONSTANTS.MODULE_NAME,
        TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE
      );
    }
    if (skipDraw) {
      return factionGraphicDefaultS;
    }
    return borderColor.INT_S;
  },
  async clearAllGridFaction() {
    TokenFactions.clearAllGridFaction();
  },
  async clearGridFaction(tokenId) {
    TokenFactions.clearGridFaction(tokenId);
  },
  clearGridFactionArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error("clearGridFactionArr | inAttributes must be of type array");
    }
    const [tokenId] = inAttributes;
    this.clearGridFaction(tokenId);
  }
};
const initHooks = async () => {
  warn("Init Hooks processing");
  TokenFactions.onInit();
  Hooks.on("renderSettingsConfig", (app, el, data) => {
    const nC = game.settings.get(CONSTANTS.MODULE_NAME, "neutralColor");
    const fC = game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColor");
    const hC = game.settings.get(CONSTANTS.MODULE_NAME, "hostileColor");
    const cC = game.settings.get(CONSTANTS.MODULE_NAME, "controlledColor");
    const pC = game.settings.get(CONSTANTS.MODULE_NAME, "partyColor");
    const nCE = game.settings.get(CONSTANTS.MODULE_NAME, "neutralColorEx");
    const fCE = game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColorEx");
    const hCE = game.settings.get(CONSTANTS.MODULE_NAME, "hostileColorEx");
    const cCE = game.settings.get(CONSTANTS.MODULE_NAME, "controlledColorEx");
    const pCE = game.settings.get(CONSTANTS.MODULE_NAME, "partyColorEx");
    const afCE = game.settings.get(CONSTANTS.MODULE_NAME, "actorFolderColorEx");
    const cdCE = game.settings.get(CONSTANTS.MODULE_NAME, "customDispositionColorEx");
    el.find('[name="token-factions.neutralColor"]').parent().append(`<input type="color" value="${nC}" data-edit="token-factions.neutralColor">`);
    el.find('[name="token-factions.friendlyColor"]').parent().append(`<input type="color" value="${fC}" data-edit="token-factions.friendlyColor">`);
    el.find('[name="token-factions.hostileColor"]').parent().append(`<input type="color" value="${hC}" data-edit="token-factions.hostileColor">`);
    el.find('[name="token-factions.controlledColor"]').parent().append(`<input type="color" value="${cC}" data-edit="token-factions.controlledColor">`);
    el.find('[name="token-factions.partyColor"]').parent().append(`<input type="color" value="${pC}" data-edit="token-factions.partyColor">`);
    el.find('[name="token-factions.neutralColorEx"]').parent().append(`<input type="color" value="${nCE}" data-edit="token-factions.neutralColorEx">`);
    el.find('[name="token-factions.friendlyColorEx"]').parent().append(`<input type="color" value="${fCE}" data-edit="token-factions.friendlyColorEx">`);
    el.find('[name="token-factions.hostileColorEx"]').parent().append(`<input type="color" value="${hCE}" data-edit="token-factions.hostileColorEx">`);
    el.find('[name="token-factions.controlledColorEx"]').parent().append(`<input type="color" value="${cCE}" data-edit="token-factions.controlledColorEx">`);
    el.find('[name="token-factions.partyColorEx"]').parent().append(`<input type="color" value="${pCE}" data-edit="token-factions.partyColorEx">`);
    el.find('[name="token-factions.actorFolderColorEx"]').parent().append(`<input type="color" value="${afCE}" data-edit="token-factions.actorFolderColorEx">`);
    el.find('[name="token-factions.customDispositionColorEx"]').parent().append(`<input type="color" value="${cdCE}" data-edit="token-factions.customDispositionColorEx">`);
  });
  if (game.settings.get(CONSTANTS.MODULE_NAME, "tokenFactionsEnabled")) {
    Hooks.on("closeSettingsConfig", (token, data) => {
      TokenFactions.updateTokensAll();
    });
    Hooks.on("renderTokenConfig", (config, html) => {
      TokenFactions.renderTokenConfig(config, html);
    });
    Hooks.on("renderSettingsConfig", (sheet, html) => {
      TokenFactions.updateTokensAll();
    });
    Hooks.on("updateActor", (actor2, data) => {
      if (hasProperty(data, "flags") && hasProperty(
        data.flags[CONSTANTS.MODULE_NAME],
        `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`
      ) && getProperty(data.flags[CONSTANTS.MODULE_NAME], `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`))
        ;
      else {
        TokenFactions.updateTokenFaction(actor2.token);
      }
    });
    Hooks.on("updateToken", (tokenDocument, data) => {
      if (hasProperty(data, "flags") && hasProperty(
        data.flags[CONSTANTS.MODULE_NAME],
        `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`
      ) && getProperty(data.flags[CONSTANTS.MODULE_NAME], `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`))
        ;
      else {
        TokenFactions.updateTokenFaction(actor);
      }
    });
    Hooks.on("updateFolder", (folder, data) => {
      TokenFactions.updateTokenDataFaction(actor);
    });
    libWrapper.register(CONSTANTS.MODULE_NAME, "Token.prototype.refresh", TokenPrototypeRefreshHandler, "MIXED");
    libWrapper.register(CONSTANTS.MODULE_NAME, "Token.prototype.draw", TokenPrototypeDrawHandler, "MIXED");
    libWrapper.register(CONSTANTS.MODULE_NAME, "Token.prototype._onUpdate", TokenPrototypeOnUpdateHandler, "MIXED");
    libWrapper.register(CONSTANTS.MODULE_NAME, "Actor.prototype._onUpdate", ActorPrototypeOnUpdateHandler, "MIXED");
    Hooks.on("renderTokenHUD", (app, html, data) => {
      TokenFactions.AddBorderToggle(app, html, data);
    });
    if (!TokenFactions.bevelGradient || !TokenFactions.bevelGradient.baseTexture) {
      TokenFactions.bevelGradient = await loadTexture(`modules/${CONSTANTS.MODULE_NAME}/assets/bevel-gradient.jpg`);
      TokenFactions.bevelTexture = await loadTexture(`modules/${CONSTANTS.MODULE_NAME}/assets/bevel-texture.png`);
    }
  }
};
const setupHooks = async () => {
  setApi(API);
};
const readyHooks = () => {
  Hooks.on("deleteToken", async (tokenDocument, data, updateData) => {
    const isPlayerOwned = tokenDocument.isOwner;
    if (!game.user?.isGM && !isPlayerOwned) {
      return;
    }
    TokenFactions.clearGridFaction(tokenDocument.id);
  });
};
const TokenPrototypeRefreshHandler = function(wrapped, ...args) {
  const tokenDocument = this;
  TokenFactions.updateTokenDataFaction(tokenDocument);
  return wrapped(...args);
};
const TokenPrototypeDrawHandler = function(wrapped, ...args) {
  const token = this;
  TokenFactions.updateTokenDataFaction(token.document);
  return wrapped(...args);
};
const TokenPrototypeOnUpdateHandler = function(wrapped, ...args) {
  if (hasProperty(args[0], "flags") && hasProperty(args[0].flags[CONSTANTS.MODULE_NAME], `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`) && getProperty(args[0].flags[CONSTANTS.MODULE_NAME], `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`))
    ;
  else {
    const token = this;
    TokenFactions.updateTokenDataFaction(token.document);
  }
  return wrapped(...args);
};
const ActorPrototypeOnUpdateHandler = function(wrapped, ...args) {
  if (hasProperty(args[0], "flags") && hasProperty(args[0].flags[CONSTANTS.MODULE_NAME], `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`) && getProperty(args[0].flags[CONSTANTS.MODULE_NAME], `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`))
    ;
  else {
    const actor2 = this;
    TokenFactions.updateTokenDataFaction(actor2.prototypeToken.document);
  }
  return wrapped(...args);
};
Hooks.once("init", () => {
  console.log(`${CONSTANTS.MODULE_NAME} | Initializing ${CONSTANTS.MODULE_NAME}`);
  if (!game.modules.get("lib-wrapper")?.active && game.user?.isGM) {
    let word = "install and activate";
    if (game.modules.get("lib-wrapper"))
      word = "activate";
    throw error(`Requires the 'libWrapper' module. Please ${word} it.`);
  }
  registerSettings();
  initHooks();
});
Hooks.once("setup", function() {
  setupHooks();
});
Hooks.once("ready", () => {
  readyHooks();
});
function setApi(api) {
  const data = game.modules.get(CONSTANTS.MODULE_NAME);
  data.api = api;
}
function getApi() {
  const data = game.modules.get(CONSTANTS.MODULE_NAME);
  return data.api;
}
function setSocket(socket) {
  const data = game.modules.get(CONSTANTS.MODULE_NAME);
  data.socket = socket;
}
function getSocket() {
  const data = game.modules.get(CONSTANTS.MODULE_NAME);
  return data.socket;
}
export {
  getApi,
  getSocket,
  setApi,
  setSocket
};
//# sourceMappingURL=module.js.map
