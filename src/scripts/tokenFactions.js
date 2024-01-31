import { FactionGraphic } from "./TokenFactionsModels.js";
import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";
import { injectConfig } from "./lib/injectConfig.js";
import { isRealNumber } from "./lib/lib.js";

export class TokenFactions {
  static TOKEN_FACTIONS_FRAME_STYLE = {
    FLAT: "flat",
    BELEVELED: "beveled",
    BORDER: "border",
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
      "party-member": game.settings.get(CONSTANTS.MODULE_ID, "partyColor"), //'#33bc4e',
      "party-npc": game.settings.get(CONSTANTS.MODULE_ID, "partyColor"), //'#33bc4e',
      "friendly-npc": game.settings.get(CONSTANTS.MODULE_ID, "friendlyColor"), //'#43dfdf',
      "neutral-npc": game.settings.get(CONSTANTS.MODULE_ID, "neutralColor"), //'#f1d836',
      "hostile-npc": game.settings.get(CONSTANTS.MODULE_ID, "hostileColor"), //'#e72124',

      "controlled-npc": game.settings.get(CONSTANTS.MODULE_ID, "controlledColor"),
      "neutral-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "neutralColorEx"),
      "friendly-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "friendlyColorEx"),
      "hostile-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "hostileColorEx"),
      "controlled-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "controlledColorEx"),
      "party-external-member": game.settings.get(CONSTANTS.MODULE_ID, "partyColorEx"),
      "party-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "partyColorEx"),

      //"target-npc": game.settings.get(CONSTANTS.MODULE_ID, "targetColor"),
      //"target-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "targetColorEx")
    };

    TokenFactions.dispositions = Object.keys(TokenFactions.defaultColors);

    TokenFactions.bevelGradient = await loadTexture(`modules/${CONSTANTS.MODULE_ID}/assets/bevel-gradient.jpg`);
    TokenFactions.bevelTexture = await loadTexture(`modules/${CONSTANTS.MODULE_ID}/assets/bevel-texture.png`);
  }

  static renderTokenConfig = async function (config, html) {
    TokenFactions.renderTokenConfigHandler(config, html);
    /*
    const tokenDocument = config.object;
    if (!game.user?.isGM) {
      return;
    }
    if (!html) {
      return;
    }
    const factionDisableValue = config.object.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE)
      ? "checked"
      : "";

    const currentCustomColorTokenInt =
      config.object.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT) || "#000000";

    const currentCustomColorTokenExt =
      config.object.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT) || "#000000";

    const currentCustomColorTokenFrameOpacity =
      config.object.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY) || 0.5;

    const currentCustomColorTokenBaseOpacity =
      config.object.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY) || 0.5;

    // Expand the width
    config.position.width = 540;
    config.setPosition(config.position);

    const nav = html.find(`nav.sheet-tabs.tabs[data-group="main"]`);
    nav.append(
      $(`
			<a class="item" data-tab="factions">
        <i class="fas fa-user-circle"></i>
				${Logger.i18n("token-factions.label.factions")}
			</a>
		`)
    );

    const formConfig = `
      <div class="form-group">
        <label>${Logger.i18n("token-factions.label.factionsCustomDisable")}</label>
        <input type="checkbox"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.FACTION_DISABLE}"
          name="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.FACTION_DISABLE}"
          data-dtype="Boolean" ${factionDisableValue}>
      </div>
      <div class="form-group">
        <label>${Logger.i18n("token-factions.label.factionsCustomColorTokenInt")}</label>
        <input type="color"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT}"
          name="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT}"
          data-dtype="String" value="${currentCustomColorTokenInt}"></input>
      </div>
      <div class="form-group">
        <label>${Logger.i18n("token-factions.label.factionsCustomColorTokenExt")}</label>
        <input type="color"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT}"
          name="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT}"
          data-dtype="String" value="${currentCustomColorTokenExt}"></input>
      </div>
      <div class="form-group">
        <label>${Logger.i18n("token-factions.label.factionsCustomColorTokenFrameOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY}"
          name="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY}"
          data-dtype="Number" value="${currentCustomColorTokenFrameOpacity}"></input>
      </div>
      <div class="form-group">
        <label>${Logger.i18n("token-factions.label.factionsCustomColorTokenBaseOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY}"
          name="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY}"
          data-dtype="Number" value="${currentCustomColorTokenBaseOpacity}"></input>
      </div>
    `;

    nav
      .parent()
      .find("footer")
      .before(
        $(`
			<div class="tab" data-tab="factions">
				${formConfig}
			</div>
		`)
      );

    nav
      .parent()
      .find('.tab[data-tab="factions"] input[type="checkbox"][data-edit]')
      .change(config._onChangeInput.bind(config));
    // nav
    //   .parent()
    //   .find('.tab[data-tab="factions"] input[type="color"][data-edit]')
    //   .change(config._onChangeInput.bind(config));
    */
  };

  /**
   * Handler called when token configuration window is opened. Injects custom form html and deals
   * with updating token.
   * @category GMOnly
   * @function
   * @async
   * @param {TokenConfig} tokenConfig
   * @param {JQuery} html
   */
  static async renderTokenConfigHandler(tokenConfig, html) {
    // if (!tokenConfig.token.hasPlayerOwner) {
    //   return;
    // }
    if (!html) {
      return;
    }

    injectConfig.inject(
      tokenConfig,
      html,
      {
        moduleId: CONSTANTS.MODULE_ID,
        tab: {
          name: CONSTANTS.MODULE_ID,
          label: Logger.i18n("token-factions.label.factions"),
          icon: "fas fa-user-circle",
        },
      },
      tokenConfig.object
    );

    const posTab = html.find(`.tab[data-tab="${CONSTANTS.MODULE_ID}"]`);
    const tokenFlags = tokenConfig.options.sheetConfig
      ? tokenConfig.object.flags
        ? tokenConfig.object.flags[CONSTANTS.MODULE_ID] || {}
        : {}
      : tokenConfig.token.flags
      ? tokenConfig.token.flags[CONSTANTS.MODULE_ID] || {}
      : {};

    const data = {
      hasPlayerOwner: tokenConfig.token.hasPlayerOwner,
      factionDisable: tokenFlags[CONSTANTS.FLAGS.FACTION_DISABLE] ? "checked" : "",
      currentCustomColorTokenInt: tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT] || "#000000",
      currentCustomColorTokenExt: tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT] || "#000000",
      currentCustomColorTokenFrameOpacity: isRealNumber(tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY])
        ? tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY]
        : 0.5,
      currentCustomColorTokenBaseOpacity: isRealNumber(tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY])
        ? tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY]
        : 0.5,
    };

    const insertHTML = await renderTemplate(`modules/${CONSTANTS.MODULE_ID}/templates/token-config.html`, data);
    posTab.append(insertHTML);
  }

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
      return undefined;
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

    if (token.faction?.removeChildren) {
      token.faction.removeChildren().forEach((c) => c.destroy());
    }

    let showFactionOnToken = false;
    /*
    if (!token.document?.distance) {
      showFactionOnToken = false;
    } else if (
      !token.document.permission ||
      token.document.permission === "all" ||
      (token.document.permission === "gm" && game.user.isGM)
    ) {
      showFactionOnToken = true;
    } else if (!!token.document?.actor?.testUserPermission(game.user, token.document.permission.toUpperCase())) {
      showFactionOnToken = true;
    }
    */
    if (token.visible) {
      showFactionOnToken = true;
    }

    if (!showFactionOnToken) {
      Logger.debug(`Cannot show faction on token '${token.document.name}'`);
      return;
    }

    let gfx;
    // if (!token.faction || token.faction.destroyed) {
    // FVTT10
    // token.faction = token.addChildAt(new PIXI.Container(), 0);
    // FVTT11
    if (!canvas.grid.faction) {
      canvas.grid.faction = canvas.grid.addChildAt(
        new PIXI.Container(),
        canvas.grid.getChildIndex(canvas.grid.borders)
      );
    }
    token.faction ??= canvas.grid.faction.addChild(new PIXI.Container());
    gfx = token.faction.addChild(new PIXI.Graphics());
    // }
    //token.faction.removeChildren().forEach((c) => c.destroy());

    TokenFactions._drawBorderFaction(token, gfx);

    /*
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
    */
    return token;
  }

  // START NEW MANAGE

  static AddBorderToggle(app, html, data) {
    if (!game.user?.isGM) {
      return;
    }
    if (!game.settings.get(CONSTANTS.MODULE_ID, "hudEnable")) {
      return;
    }
    if (!app?.object?.document) {
      return;
    }

    const factionDisableFlag = app.object.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE);

    const borderButton = `
    <div class="control-icon factionBorder
      ${factionDisableFlag ? "active" : ""}"
      title="Toggle Faction Border"> <i class="fas fa-angry"></i>
    </div>`;

    const settingHudColClass = game.settings.get(CONSTANTS.MODULE_ID, "hudColumn") ?? "right";
    const settingHudTopBottomClass = game.settings.get(CONSTANTS.MODULE_ID, "hudTopBottom") ?? "bottom";

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
    const borderIsDisabled = this.object.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE);

    for (const token of canvas.tokens?.controlled) {
      try {
        await token.document.setFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE, !borderIsDisabled);
        token.refresh();
      } catch (e) {
        Logger.error(e);
      }
    }

    event.currentTarget.classList.toggle("active", !borderIsDisabled);
  }

  static async ToggleCustomBorder(event) {
    const tokenTmp = this.object;

    const currentCustomColorTokenInt =
      tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT) || "#000000";

    const currentCustomColorTokenExt =
      tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT) || "#000000";

    const currentCustomColorTokenFrameOpacity =
      tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY) || 0.5;

    const currentCustomColorTokenBaseOpacity =
      tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY) || 0.5;

    const dialogContent = `
      <div class="form-group">
        <label>${Logger.i18n("token-factions.label.factionsCustomColorTokenInt")}</label>
        <input type="color"
          value="${currentCustomColorTokenInt}"
          data-edit="token-factions.currentCustomColorTokenInt"></input>
      </div>
      <div class="form-group">
        <label>${Logger.i18n("token-factions.label.factionsCustomColorTokenExt")}</label>
        <input type="color"
          value="${currentCustomColorTokenExt}"
          data-edit="token-factions.currentCustomColorTokenExt"></input>
      </div>
      <div class="form-group">
        <label>${Logger.i18n("token-factions.label.factionsCustomColorTokenFrameOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          value="${currentCustomColorTokenFrameOpacity}"
          data-edit="token-factions.currentCustomColorTokenFrameOpacity"></input>
      </div>
      <div class="form-group">
        <label>${Logger.i18n("token-factions.label.factionsCustomColorTokenBaseOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          value="${currentCustomColorTokenBaseOpacity}"
          data-edit="token-factions.currentCustomColorTokenBaseOpacity"></input>
      </div>
      `;

    const d = new Dialog({
      title: Logger.i18n("token-factions.label.chooseCustomColorToken"),
      content: dialogContent,
      buttons: {
        yes: {
          label: Logger.i18n("token-factions.label.applyCustomColor"),

          callback: async (html) => {
            const newCurrentCustomColorTokenInt = $(
              html.find(`input[data-edit='token-factions.currentCustomColorTokenInt']`)[0]
            ).val();
            const newCurrentCustomColorTokenExt = $(
              html.find(`input[data-edit='token-factions.currentCustomColorTokenExt']`)[0]
            ).val();
            const newCurrentCustomColorTokenFrameOpacity = $(
              html.find(`input[data-edit='token-factions.currentCustomColorTokenFrameOpacity']`)[0]
            ).val();
            const newCurrentCustomColorTokenBaseOpacity = $(
              html.find(`input[data-edit='token-factions.currentCustomColorTokenBaseOpacity']`)[0]
            ).val();
            for (const token of canvas.tokens?.controlled) {
              token.document.setFlag(
                CONSTANTS.MODULE_ID,
                CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT,
                newCurrentCustomColorTokenInt
              );
              token.document.setFlag(
                CONSTANTS.MODULE_ID,
                CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT,
                newCurrentCustomColorTokenExt
              );
              token.document.setFlag(
                CONSTANTS.MODULE_ID,
                CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY,
                newCurrentCustomColorTokenFrameOpacity
              );
              token.document.setFlag(
                CONSTANTS.MODULE_ID,
                CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY,
                newCurrentCustomColorTokenBaseOpacity
              );
            }
          },
        },
        no: {
          label: Logger.i18n("token-factions.label.doNothing"),
          callback: (html) => {
            // Do nothing
          },
        },
      },
      default: "no",
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
    if (A[0] === undefined || A[1] === undefined || A[2] === undefined) {
      Logger.error("RGB color invalid");
    }
    return (
      "#" +
      TokenFactions._componentToHex(A[0]) +
      TokenFactions._componentToHex(A[1]) +
      TokenFactions._componentToHex(A[2])
    );
  }

  static _hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
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
    for (const tk of canvas.tokens?.placeables) {
      TokenFactions._updateTokensBorder(tk.document);
    }
  }

  static async _updateTokensBorder(tokenData) {
    const currentTokenID = tokenData?.id ? tokenData?.id : tokenData?._id;
    const tokens = [];
    const tokenDoc = canvas.tokens?.get(currentTokenID)?.document;
    if (!tokenDoc) {
      const actorID = currentTokenID; // game.actors?.get(currentTokenID)?.id;
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

    tokens.forEach((tokenDoc) => {
      if (tokenDoc) {
        const tokenID = tokenDoc.id;
        const sceneID = (canvas.tokens?.get(tokenDoc.id)).scene.id;
        const specifiedScene = game.scenes?.get(sceneID);
        if (specifiedScene) {
          if (!specifiedScene) {
            return;
          }
          tokenDoc = specifiedScene.tokens.find((tokenTmp) => {
            return tokenTmp.id === tokenID;
          });
        }
        if (!tokenDoc) {
          let foundToken = null;
          game.scenes?.find((sceneTmp) => {
            // getTokenForScene(scene, tokenID);
            if (!sceneTmp) {
              foundToken = null;
            }
            foundToken = sceneTmp.tokens.find((token) => {
              return token.id === tokenID;
            });
            return !!foundToken;
          });

          tokenDoc = foundToken;
        }
      }

      if (!tokenDoc) {
        // Is not in the current canvas
        return;
      }
      // TokenDocument to Token

      const token = tokenDoc._object;
      if (!token.id) {
        return;
      }
      token.sortableChildren = true;

      if (token.faction?.removeChildren) {
        token.faction.removeChildren().forEach((c) => c.destroy());
      }

      let showFactionOnToken = false;
      /*
      if (!token.document?.distance) {
        showFactionOnToken = false;
      } else if (
        !token.document.permission ||
        token.document.permission === "all" ||
        (token.document.permission === "gm" && game.user.isGM)
      ) {
        showFactionOnToken = true;
      } else if (!!token.document?.actor?.testUserPermission(game.user, token.document.permission.toUpperCase())) {
        showFactionOnToken = true;
      }
      */
      if (token.visible) {
        showFactionOnToken = true;
      }

      if (!showFactionOnToken) {
        Logger.debug(`Cannot show faction on token '${token.document.name}'`);
        return;
      }

      let gfx;
      // if (!token.faction || token.faction.destroyed) {
      // FVTT10
      // token.faction = token.addChildAt(new PIXI.Container(), 0);
      // FVTT11
      if (!canvas.grid.faction) {
        canvas.grid.faction = canvas.grid.addChildAt(
          new PIXI.Container(),
          canvas.grid.getChildIndex(canvas.grid.borders)
        );
      }
      token.faction ??= canvas.grid.faction.addChild(new PIXI.Container());
      gfx = token.faction.addChild(new PIXI.Graphics());
      // }
      //token.faction.removeChildren().forEach((c) => c.destroy());

      TokenFactions._drawBorderFaction(token, gfx);

      /*
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
      */
    });
    return;
  }

  static colorBorderFaction(token) {
    if (!TokenFactions.defaultColors) {
      TokenFactions.onInit();
    }

    const colorFrom = game.settings.get(CONSTANTS.MODULE_ID, "color-from");
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
      // colorFrom === 'custom-disposition'
      // TODO PUT SOME NEW FLAG ON THE TOKEN
      const disposition = TokenFactions.dispositionKey(token);
      if (disposition) {
        color = game.settings.get(CONSTANTS.MODULE_ID, `custom-${disposition}-color`);
      }
    }

    const currentCustomColorTokenInt = token.document.getFlag(
      CONSTANTS.MODULE_ID,
      CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT
    );
    const currentCustomColorTokenExt = token.document.getFlag(
      CONSTANTS.MODULE_ID,
      CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT
    );

    const overrides = {
      CONTROLLED: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "controlledColor")).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "controlledColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, "controlledColor")),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, "controlledColorEx")),
      },
      FRIENDLY: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "friendlyColor")).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "friendlyColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, "friendlyColor")),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, "friendlyColorEx")),
      },
      NEUTRAL: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "neutralColor")).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "neutralColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, "neutralColor")),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, "neutralColorEx")),
      },
      HOSTILE: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "hostileColor")).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "hostileColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, "hostileColor")),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, "hostileColorEx")),
      },
      PARTY: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "partyColor")).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "partyColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, "partyColor")),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, "partyColorEx")),
      },
      ACTOR_FOLDER_COLOR: {
        INT: parseInt(String(color).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "actorFolderColorEx")).substr(1), 16),
        ICON: icon ? String(icon) : "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(color),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, "actorFolderColorEx")),
      },
      CUSTOM_DISPOSITION: {
        INT: parseInt(String(color).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "customDispositionColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(color),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, "customDispositionColorEx")),
      },
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
        EX_S: String(currentCustomColorTokenExt),
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
      // colorFrom === 'custom-disposition'
      borderColor = overrides.CUSTOM_DISPOSITION;
    }

    return borderColor;
  }

  static _drawBorderFaction(token, gfx) {
    // if (!gfx && token.faction) {

    //   gfx = token.faction;
    // }
    if (!gfx) {
      Logger.debug(`No gfx is founded or passed`);
      return;
    }
    if (!token) {
      Logger.debug(`No token is founded or passed`);
      return;
    }
    if (token.x === 0 && token.y === 0) {
      if (token.document.x === 0 && token.document.y === 0) {
        Logger.debug(`No token is founded or passed`);
        return;
      }
    }

    // // OLD FVTT 9
    //
    // gfx.children.forEach((c) => c.clear());
    // // gfx.removeChildren().forEach(c => c.destroy());

    // Some systems have special classes for factions, if we can't removeChildren,
    // then use the token's children and make sure to only remove the ones we created

    // if (gfx.removeChildren) {

    //   container.children.forEach((c) => c.clear());
    //   // gfx.removeChildren().forEach(c => c.destroy());
    // }

    const borderColor = TokenFactions.colorBorderFaction(token);
    if (!borderColor) {
      return;
    }
    if (!borderColor.INT || Number.isNaN(borderColor.INT)) {
      return;
    }
    switch (game.settings.get(CONSTANTS.MODULE_ID, "removeBorders")) {
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
      skipDraw = getProperty(token.document, `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.FACTION_DISABLE}`);
    } catch (e) {
      token.document.setFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE, false);
      skipDraw = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE);
    }

    if (skipDraw) {
      return;
    }

    const frameStyle = String(game.settings.get(CONSTANTS.MODULE_ID, "frame-style"));

    if (frameStyle == TokenFactions.TOKEN_FACTIONS_FRAME_STYLE.FLAT) {
      // frameStyle === 'flat'
      const fillTexture = game.settings.get(CONSTANTS.MODULE_ID, "fillTexture");
      TokenFactions._drawBorder(token, borderColor, gfx, fillTexture);
    }
    // TODO to re-integrate ???
    else if (frameStyle == TokenFactions.TOKEN_FACTIONS_FRAME_STYLE.BELEVELED) {
      // frameStyle === 'bevelled'
      const fillTexture = game.settings.get(CONSTANTS.MODULE_ID, "fillTexture");
      const frameWidth = canvas.grid?.grid?.w * (game.settings.get(CONSTANTS.MODULE_ID, "borderWidth") / 100);

      // BASE CONFIG
      let t = game.settings.get(CONSTANTS.MODULE_ID, "borderWidth") || CONFIG.Canvas.objectBorderThickness;
      const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");

      if (game.settings.get(CONSTANTS.MODULE_ID, "permanentBorder") && token.controlled) {
        t = t * 2;
      }
      const sB = game.settings.get(CONSTANTS.MODULE_ID, "scaleBorder");
      const bS = game.settings.get(CONSTANTS.MODULE_ID, "borderGridScale");
      const nBS = bS ? canvas.dimensions?.size / 100 : 1;

      const sX = sB ? token.document.texture.scaleX : 1;

      const sY = sB ? token.document.texture.scaleY : 1;
      const sW = sB ? (token.w - token.w * sX) / 2 : 0;
      const sH = sB ? (token.h - token.h * sY) / 2 : 0;

      let frameOpacity = game.settings.get(CONSTANTS.MODULE_ID, "frame-opacity") || 0.5;
      let baseOpacity = game.settings.get(CONSTANTS.MODULE_ID, "base-opacity") || 0.5;

      const customFrameOpacity = token.document.getFlag(
        CONSTANTS.MODULE_ID,
        CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY
      );
      const customBaseOpacity = token.document.getFlag(
        CONSTANTS.MODULE_ID,
        CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY
      );

      if (customFrameOpacity && customFrameOpacity != 0.5) {
        frameOpacity = customFrameOpacity;
      }
      if (customBaseOpacity && customBaseOpacity != 0.5) {
        baseOpacity = customBaseOpacity;
      }

      const textureINT = borderColor.TEXTURE_INT || PIXI.Texture.EMPTY; //await PIXI.Texture.fromURL(token.document.texture.src) || PIXI.Texture.EMPTY;
      const textureEX = borderColor.TEXTURE_EX || PIXI.Texture.EMPTY;

      const h = Math.round(t / 2);
      const o = Math.round(h / 2);

      // const ringTexture = new PIXI.Sprite(TokenFactions.bevelTexture);
      // ringTexture.tint = borderColor.INT;
      // ringTexture.alpha = frameOpacity;
      // container.addChild(ringTexture);
      // const factionBorder = new PIXI.Graphics();
      /*
			const borderColorBeleveled = borderColor;
			borderColorBeleveled.TEXTURE_INT = TokenFactions.bevelTexture;
			borderColorBeleveled.TEXTURE_EX = TokenFactions.bevelGradient;
			TokenFactions._drawBorder(token, borderColorBeleveled, factionBorder, fillTexture);
			*/
      // ringTexture.mask = factionBorder;

      const outerRing = TokenFactions._drawGradient(token, borderColor.INT, TokenFactions.bevelGradient);
      const innerRing = TokenFactions._drawGradient(token, borderColor.INT, TokenFactions.bevelGradient);
      const ringTexture = TokenFactions._drawTexture(token, borderColor.INT, TokenFactions.bevelTexture);
      const outerRingMask = new PIXI.Graphics();
      const innerRingMask = new PIXI.Graphics();
      const ringTextureMask = new PIXI.Graphics();

      outerRing.alpha = frameOpacity;
      innerRing.alpha = frameOpacity;
      ringTexture.alpha = frameOpacity;

      innerRing.pivot.set(1000.0, 1000.0);
      innerRing.angle = 180;

      outerRingMask
        .lineStyle(h * nBS, borderColor.EX, 1.0)

        .beginFill(Color.from(0xffffff), 0.0)
        .drawCircle(token.w / 2, token.h / 2, token.w / 2)
        .endFill();

      innerRingMask
        .lineStyle(h * nBS, borderColor.EX, 1.0)

        .beginFill(Color.from(0xffffff), 0.0)
        .drawCircle(token.w / 2, token.h / 2, token.w / 2 - frameWidth / 2)
        .endFill();

      ringTextureMask
        .lineStyle(h * nBS, borderColor.EX, 1.0)

        .beginFill(Color.from(0xffffff), 0.0)
        .drawCircle(token.w / 2, token.h / 2, token.w / 2)
        .endFill();

      token.faction.addChild(outerRing);

      token.faction.addChild(outerRingMask);
      outerRing.mask = outerRingMask;

      token.faction.addChild(innerRing);

      token.faction.addChild(innerRingMask);
      innerRing.mask = innerRingMask;

      token.faction.addChild(ringTexture);

      token.faction.addChild(ringTextureMask);
      ringTexture.mask = ringTextureMask;

      /*
      const fillTexture = game.settings.get(CONSTANTS.MODULE_ID, 'fillTexture');
      if (fillTexture) {
        // TODO FILL TEXTURE
      }

      const outerRing = new PIXI.Sprite(TokenFactions.bevelGradient);
      outerRing.anchor.set(0.0, 0.0);
      outerRing.width = token.w;
      outerRing.height = token.h;
      outerRing.tint = borderColor.INT;

      const innerRing = new PIXI.Sprite(TokenFactions.bevelGradient);
      innerRing.anchor.set(0.0, 0.0);
      innerRing.width = token.w;
      innerRing.height = token.h;
      innerRing.tint = borderColor.INT;

      const ringTexture = new PIXI.Sprite(TokenFactions.bevelTexture);
      ringTexture.anchor.set(0.0, 0.0);
      ringTexture.width = 400;
      ringTexture.height = 400;
      ringTexture.tint = borderColor.INT;

      const outerRingMask = new PIXI.Graphics();
      const innerRingMask = new PIXI.Graphics();
      const ringTextureMask = new PIXI.Graphics();

      outerRing.alpha = frameOpacity;
      innerRing.alpha = frameOpacity;
      ringTexture.alpha = frameOpacity;

      innerRing.pivot.set(1000.0, 1000.0);
      innerRing.angle = 180;

      // outerRingMask
      //   .lineStyle(t / 2, 0xffffff, 1.0, 0)
      //   .beginFill(Color.from(0xffffff), 0.0)
      //   .drawCircle(token.w / 2, token.h / 2, token.w / 2);

      const borderColorOuterRingMask = borderColor;
      borderColorOuterRingMask.INT = 0xffffff;
      TokenFactions._drawBorder(token,borderColorOuterRingMask,outerRingMask,false);

      // innerRingMask
      //   .lineStyle(t / 2, 0xffffff, 1.0, 0)
      //   .beginFill(Color.from(0xffffff), 0.0)
      //   .drawCircle(token.w / 2, token.h / 2, token.w / 2 - t / 2);

      const borderColorInnerRingMask = borderColor;
      borderColorInnerRingMask.INT = 0xffffff;
      TokenFactions._drawBorder(token,borderColorInnerRingMask,innerRingMask,false);

      // ringTextureMask
      //   .lineStyle(t, 0xffffff, 1.0, 0)
      //   .beginFill(Color.from(0xffffff), 0.0)
      //   .drawCircle(token.w / 2, token.h / 2, token.w / 2);

      const borderColorRingTextureMask = borderColor;
      borderColorRingTextureMask.INT = 0xffffff;
      TokenFactions._drawBorder(token,borderColorRingTextureMask,false);

      container.addChild(outerRing);
      container.addChild(outerRingMask);
      outerRing.mask = outerRingMask;

      container.addChild(innerRing);
      container.addChild(innerRingMask);
      innerRing.mask = innerRingMask;

      container.addChild(ringTexture);
      container.addChild(ringTextureMask);
      ringTexture.mask = ringTextureMask;
      */
      //}else if(frameStyle == TOKEN_FACTIONS_FRAME_STYLE.BORDER){
    }
    // is ok as default ??
    else {
      const fillTexture = game.settings.get(CONSTANTS.MODULE_ID, "fillTexture");
      TokenFactions._drawBorder(token, borderColor, gfx, fillTexture);
    }
    return gfx;
  }

  static _drawBorder(token, borderColor, factionBorder, fillTexture) {
    //
    /*
    const factionBorder = new PIXI.Graphics();

    // If we cannot create an faction as a child of the token through factions field,
    // then do it through direct token's children while keeping track of which children we created

    if (container.addChild) {
      container.addChild(factionBorder);
    }
    else if (token.addChild) {
      factionBorder.source = CONSTANTS.MODULE_ID;
      token.addChild(factionBorder);
    }

    if (canvas.interface.reverseMaskfilter) {
      factionBorder.filters = [canvas.interface.reverseMaskfilter];
    }
    */

    //token.faction ??= canvas.grid.faction.addChild(new PIXI.Container());
    //const factionBorder = token.faction.addChild(new PIXI.Graphics());

    let t = game.settings.get(CONSTANTS.MODULE_ID, "borderWidth") || CONFIG.Canvas.objectBorderThickness;
    const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");

    if (game.settings.get(CONSTANTS.MODULE_ID, "permanentBorder") && token.controlled) {
      t = t * 2;
    }
    const sB = game.settings.get(CONSTANTS.MODULE_ID, "scaleBorder");
    const bS = game.settings.get(CONSTANTS.MODULE_ID, "borderGridScale");
    const nBS = bS ? canvas.dimensions?.size / 100 : 1;

    const sX = sB ? token.document.texture.scaleX : 1;

    const sY = sB ? token.document.texture.scaleY : 1;
    const sW = sB ? (token.w - token.w * sX) / 2 : 0;
    const sH = sB ? (token.h - token.h * sY) / 2 : 0;

    const s = sX;
    // const s: any = sB ? token.scale : 1;
    // const sW = sB ? (token.w - token.w * s) / 2 : 0;
    // const sH = sB ? (token.h - token.h * s) / 2 : 0;

    let frameOpacity = game.settings.get(CONSTANTS.MODULE_ID, "frame-opacity") || 0.5;
    let baseOpacity = game.settings.get(CONSTANTS.MODULE_ID, "base-opacity") || 0.5;

    const customFrameOpacity = token.document.getFlag(
      CONSTANTS.MODULE_ID,
      CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY
    );
    const customBaseOpacity = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY);

    if (customFrameOpacity && customFrameOpacity != 0.5) {
      frameOpacity = customFrameOpacity;
    }
    if (customBaseOpacity && customBaseOpacity != 0.5) {
      baseOpacity = customBaseOpacity;
    }

    const textureINT = borderColor.TEXTURE_INT || PIXI.Texture.EMPTY; //await PIXI.Texture.fromURL(token.document.texture.src) || PIXI.Texture.EMPTY;
    const textureEX = borderColor.TEXTURE_EX || PIXI.Texture.EMPTY;

    factionBorder.alpha = frameOpacity;

    // Draw Hex border for size 1 tokens on a hex grid
    const gt = CONST.GRID_TYPES;
    const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];

    if (game.settings.get(CONSTANTS.MODULE_ID, "circleBorders")) {
      // const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");
      const h = Math.round(t / 2);
      const o = Math.round(h / 2);

      if (fillTexture) {
        factionBorder

          .beginFill(Color.from(borderColor.EX), baseOpacity)
          .lineStyle(t * nBS, borderColor.EX, 0.8)
          // .drawCircle(token.x + token.w / 2, token.y + token.h / 2, (token.w / 2) * sX + t + p)
          .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + t + p)
          .beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity })
          .endFill();
        // .lineStyle(t*nBS, borderColor.EX, 0.8)
        // .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + t + p);

        factionBorder

          .beginFill(Color.from(borderColor.INT), baseOpacity)

          .lineStyle(h * nBS, Color.from(borderColor.INT), 1.0)
          // .drawCircle(token.x + token.w / 2, token.y + token.h / 2, (token.w / 2) * sX + h + t / 2 + p)
          .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + h + t / 2 + p)

          .beginTextureFill({ texture: textureINT, color: Color.from(borderColor.INT), alpha: baseOpacity })
          .endFill();
        // .lineStyle(h*nBS, Color.from(borderColor.INT), 1.0)
        // .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + h + t / 2 + p);
      }

      factionBorder
        .lineStyle(t * nBS, borderColor.EX, 0.8)
        // .drawCircle(token.x + token.w / 2, token.y + token.h / 2, (token.w / 2) * sX + t + p);
        .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + t + p);

      factionBorder

        .lineStyle(h * nBS, Color.from(borderColor.INT), 1.0)
        // .drawCircle(token.x + token.w / 2, token.y + token.h / 2, (token.w / 2) * sX + h + t / 2 + p);
        .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + h + t / 2 + p);
    } else if (canvas.grid.isHex || hexTypes.includes(canvas.grid?.type)) {
      // && token.document.width === 1 && token.document.height === 1) {
      // const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");
      const q = Math.round(p / 2);

      // Should be able to use getBorderPolygon or replaced method after https://github.com/foundryvtt/foundryvtt/issues/10088 is released?
      // Until then only works when width and height are the same
      const polygon =
        token.document.width === token.document.height
          ? canvas.grid?.grid?.getBorderPolygon(token.document.width, token.document.height, q)
          : canvas.grid?.grid?.getPolygon(-1.5 - q + sW, -1.5 - q + sH, (token.w + 2) * sX + p, (token.h + 2) * sY + p);

      // const polygon = canvas.grid?.grid?.getPolygon(
      // 	-1.5 - q + sW,
      // 	-1.5 - q + sH,
      // 	(token.w + 2) * s + p,
      // 	(token.h + 2) * s + p
      // );

      if (fillTexture) {
        factionBorder

          .beginFill(Color.from(borderColor.EX), baseOpacity)
          .lineStyle(t * nBS, borderColor.EX, 0.8)
          .drawPolygon(polygon)
          .beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity })
          .endFill();
        // .lineStyle(t*nBS, borderColor.EX, 0.8)
        // .drawPolygon(polygon);

        factionBorder

          .beginFill(Color.from(borderColor.INT), baseOpacity)

          .lineStyle((t * nBS) / 2, Color.from(borderColor.INT), 1.0)
          .drawPolygon(polygon)

          .beginTextureFill({ texture: textureINT, color: Color.from(borderColor.INT), alpha: baseOpacity })
          .endFill();
        // .lineStyle(t*nBS / 2, Color.from(borderColor.INT), 1.0)
        // .drawPolygon(polygon);
      }

      factionBorder.lineStyle(t * nBS, borderColor.EX, 0.8).drawPolygon(polygon);

      factionBorder.lineStyle((t * nBS) / 2, Color.from(borderColor.INT), 1.0).drawPolygon(polygon);
    }

    // Otherwise Draw Square border
    else {
      // const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");
      const q = Math.round(p / 2);
      const h = Math.round(t / 2);
      const o = Math.round(h / 2);

      if (fillTexture) {
        factionBorder

          .beginFill(Color.from(borderColor.EX), baseOpacity)
          .lineStyle(t * nBS, borderColor.EX, 0.8)
          // .drawRoundedRect(token.x, token.y, token.w, token.h, 3)
          .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3)
          .beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity })
          .endFill();
        // .lineStyle(t*nBS, borderColor.EX, 0.8)
        // .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);

        factionBorder

          .beginFill(Color.from(borderColor.INT), baseOpacity)

          .lineStyle(h * nBS, Color.from(borderColor.INT), 1.0)
          // .drawRoundedRect(token.x, token.y, token.w, token.h, 3)
          .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3)

          .beginTextureFill({ texture: textureINT, color: Color.from(borderColor.INT), alpha: baseOpacity })
          .endFill();
        // .lineStyle(h*nBS, Color.from(borderColor.INT), 1.0)
        // .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);
      }

      factionBorder
        .lineStyle(t * nBS, borderColor.EX, 0.8)
        // .drawRoundedRect(token.x, token.y, token.w, token.h, 3);
        .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);

      factionBorder

        .lineStyle(h * nBS, Color.from(borderColor.INT), 1.0)
        // .drawRoundedRect(token.x, token.y, token.w, token.h, 3);
        .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);
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

    bg.anchor.set(0.0, 0.0);
    bg.width = token.w;
    bg.height = token.h;
    bg.tint = color;
    // bg.x = token.x;
    // bg.y = token.y;

    return bg;
  }

  static _drawTexture(token, color, bevelTexture) {
    const bg = new PIXI.Sprite(bevelTexture);

    bg.anchor.set(0.0, 0.0);
    bg.width = 400;
    bg.height = 400;
    bg.tint = color;
    // bg.x = token.x;
    // bg.y = token.y;

    return bg;
  }
}
