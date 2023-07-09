import { advancedLosTestInLos, debug, getOwnedTokens, i18n } from "./lib/lib.mjs";
import { FactionGraphic } from "./TokenFactionsModels.mjs";
import CONSTANTS from "./constants.mjs";

export class TokenFactions {
  static TOKEN_FACTIONS_FLAGS = {
    FACTION_DRAW_FRAME: "factionDrawFrame", //'draw-frame',
    FACTION_DISABLE: "factionDisable", // 'disable'
    // FACTION_NO_BORDER: 'factionNoBorder', // noBorder
    FACTION_CUSTOM_COLOR_INT: "factionCustomColorInt",
    FACTION_CUSTOM_COLOR_EXT: "factionCustomColorExt",
    FACTION_CUSTOM_FRAME_OPACITY: "factionCustomFrameOpacity",
    FACTION_CUSTOM_BASE_OPACITY: "factionCustomBaseOpacity",
  };

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
    const tokenDocument = config.object;
    if (!game.user?.isGM) {
      return;
    }
    if (!html) {
      return;
    }
    const factionDisableValue = config.object.getFlag(
      CONSTANTS.MODULE_ID,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE
    )
      ? "checked"
      : "";

    const currentCustomColorTokenInt =
      config.object.getFlag(CONSTANTS.MODULE_ID, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT) ||
      "#000000";

    const currentCustomColorTokenExt =
      config.object.getFlag(CONSTANTS.MODULE_ID, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT) ||
      "#000000";

    const currentCustomColorTokenFrameOpacity =
      config.object.getFlag(CONSTANTS.MODULE_ID, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY) ||
      0.5;

    const currentCustomColorTokenBaseOpacity =
      config.object.getFlag(CONSTANTS.MODULE_ID, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY) ||
      0.5;

    // Expand the width
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
          data-edit="flags.${CONSTANTS.MODULE_ID}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}"
          name="flags.${CONSTANTS.MODULE_ID}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}"
          data-dtype="Boolean" ${factionDisableValue}>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenInt")}</label>
        <input type="color"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT}"
          name="flags.${CONSTANTS.MODULE_ID}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT}"
          data-dtype="String" value="${currentCustomColorTokenInt}"></input>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenExt")}</label>
        <input type="color"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT}"
          name="flags.${CONSTANTS.MODULE_ID}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT}"
          data-dtype="String" value="${currentCustomColorTokenExt}"></input>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenFrameOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY}"
          name="flags.${CONSTANTS.MODULE_ID}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY}"
          data-dtype="Number" value="${currentCustomColorTokenFrameOpacity}"></input>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenBaseOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY}"
          name="flags.${CONSTANTS.MODULE_ID}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY}"
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
  };

  // static _applyFactions = async function (document | Actor, updateData): Promise<void> {
  // 	// Set the disable flag
  // 	let propertyNameDisable = `flags.${CONSTANTS.MODULE_ID}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`;
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
    /*
		if (!TokenFactions.bevelGradient || !TokenFactions.bevelGradient.baseTexture) {
			TokenFactions.bevelGradient = (
				await loadTexture(`modules/${CONSTANTS.MODULE_ID}/assets/bevel-gradient.jpg`)
			);
			TokenFactions.bevelTexture = (
				await loadTexture(`modules/${CONSTANTS.MODULE_ID}/assets/bevel-texture.png`)
			);
		}
		*/
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
    //@ts-ignore
    if (!(token instanceof Token)) {
      return token;
    }
    token.sortableChildren = true;
    /*
		const isPlayerOwned = token.document.isOwner;
		// When i hidden this hide for everyone except owner and gm
		if (token.document.hidden) {
			if (!game.user?.isGM && !isPlayerOwned) {
				TokenFactions.clearGridFaction(token.document.id);
				// tokenFactionsSocket.executeAsGM("clearGridFaction", token.document.id);
				return;
			}
		}
		// or if a token is not visible
		//@ts-ignore
		if (token.document.object) {
			const someoneIsSelected = canvas.tokens?.controlled?.length > 0;
			if (!game.user?.isGM && !isPlayerOwned) {
				let isVisible = token.isVisible;
				if (!isVisible) {
					TokenFactions.clearGridFaction(token.document.id);
					// tokenFactionsSocket.executeAsGM("clearGridFaction", tokenData.id);
					return;
				}
			}
			// else if (game.user?.isGM && someoneIsSelected) {
			// 	let isVisible = false;
			// 	const tokensToClear = <string[]>[];
			// 	for (const ownedToken of canvas.tokens?.placeables) {
			// 		if (ownedToken.id === token.id) {
			// 			continue;
			// 		}
			// 		//@ts-ignore
			// 		if(ownedToken.controlled){
			// 			continue;
			// 		}
			// 		const sourceCenter = {
			// 			x: ownedToken.center.x,
			// 			y: ownedToken.center.y,
			// 			//@ts-ignore
			// 			z: ownedToken.losHeight,
			// 		};
			// 		const tolerance = Math.min(ownedToken.w, ownedToken.h) / 4; // this is the same of levels
			// 		const isVisibleX =
			// 			//@ts-ignore
			// 			canvas.effects.visibility.testVisibility(sourceCenter, { tolerance: tolerance, object: token });
			// 		if (isVisibleX) {
			// 			isVisible = true;
			// 			break;
			// 		} else {
			// 			tokensToClear.push(ownedToken.id);
			// 		}
			// 	}
			// 	// }
			// 	if (!isVisible) {
			// 		for(const id of tokensToClear){
			// 			TokenFactions.clearGridFaction(id);
			// 		}
			// 		// tokenFactionsSocket.executeAsGM("clearGridFaction", tokenData.id);
			// 		return;
			// 	}
			// }
		}
		*/
    // OLD FVTT 9
    /*
		//@ts-ignore
		if (!token.faction || token.faction.destroyed) {
			//@ts-ignore
			token.faction = token.addChildAt(new PIXI.Container(), 0);
		}
		token.sortableChildren = true;
		// token.sortDirty = true;
		*/
    // FVTT 10 WITH GRID
    /*
		//@ts-ignore
		if (!canvas.grid.faction) {
			//@ts-ignore
			canvas.grid.faction = {};
		}
		//@ts-ignore
		if (!canvas.grid.faction[token.id]) {
			//@ts-ignore
			canvas.grid.faction[token.id] = new PIXI.Container();
			//@ts-ignore
			canvas.grid.addChild(canvas.grid.faction[token.id]);
		}
		//@ts-ignore
		if (!canvas.grid.faction[token.id].geometry) {
			//@ts-ignore
			canvas.grid.removeChild(canvas.grid.faction[token.id]);
			//@ts-ignore
			canvas.grid.faction[token.id] = new PIXI.Container();
			//@ts-ignore
			canvas.grid.addChild(canvas.grid.faction[token.id]);
		}
		//@ts-ignore
		let factionBorderContainer = canvas.grid.faction[token.id];
		// factionBorder.sortableChildren = true;
		// factionBorder.clear();
		*/

    //@ts-ignore
    if (!token.faction || token.faction.destroyed) {
      //@ts-ignore
      token.faction = token.addChildAt(new PIXI.Container(), 0);
    }
    //@ts-ignore
    token.faction.removeChildren().forEach((c) => c.destroy());
    //@ts-ignore
    let factionBorderContainer = token.faction;

    //@ts-ignore
    factionBorderContainer = TokenFactions._drawBorderFaction(token, factionBorderContainer);
    //@ts-ignore
    // token.addChildAt(factionBorderContainer, 0);
    // TokenFactions.clearGridFaction(token.id);
    //@ts-ignore
    if (token.mesh) {
      //@ts-ignore
      if (token.border) {
        //@ts-ignore
        if (token.mesh.zIndex >= token.border.zIndex) {
          //@ts-ignore
          token.mesh.zIndex = token.border.zIndex - 1;
          //@ts-ignore
          if (token.faction.zIndex >= token.mesh.zIndex) {
            //@ts-ignore
            token.faction.zIndex = token.mesh.zIndex - 1;
          }
        }
        //@ts-ignore
        if (token.zIndex >= token.border.zIndex) {
          //@ts-ignore
          token.zIndex = token.border.zIndex - 1;
          //@ts-ignore
          if (token.faction.zIndex >= token.zIndex) {
            //@ts-ignore
            token.faction.zIndex = token.zIndex - 1;
          }
        }
        //@ts-ignore
        if (token.faction.zIndex >= token.border.zIndex) {
          //@ts-ignore
          token.faction.zIndex = token.border.zIndex - 1;
        }
      } else {
        //@ts-ignore
        if (token.faction.zIndex >= token.mesh.zIndex) {
          //@ts-ignore
          token.faction.zIndex = token.mesh.zIndex - 1;
        }
      }
    } else {
      //@ts-ignore
      if (token.border) {
        //@ts-ignore
        if (token.zIndex >= token.border.zIndex) {
          //@ts-ignore
          token.zIndex = token.border.zIndex - 1;
          //@ts-ignore
          if (token.faction.zIndex >= token.zIndex) {
            //@ts-ignore
            token.faction.zIndex = token.zIndex - 1;
          }
        }
      } else {
        //@ts-ignore
        if (token.faction.zIndex >= token.zIndex) {
          //@ts-ignore
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
    if (!game.settings.get(CONSTANTS.MODULE_ID, "hudEnable")) {
      return;
    }
    if (!app?.object?.document) {
      return;
    }

    const factionDisableFlag = app.object.document.getFlag(
      CONSTANTS.MODULE_ID,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE
    );

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
    //@ts-ignore
    const borderIsDisabled = this.object.document.getFlag(
      CONSTANTS.MODULE_ID,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE
    );

    for (const token of canvas.tokens?.controlled) {
      //@ts-ignore
      await token.document.setFlag(
        CONSTANTS.MODULE_ID,
        TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE,
        !borderIsDisabled
      );
      // if (borderIsDisabled) {
      // 	await token.document.unsetFlag(
      // 		CONSTANTS.MODULE_ID,
      // 		TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT
      // 	);
      // 	await token.document.unsetFlag(
      // 		CONSTANTS.MODULE_ID,
      // 		TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT
      // 	);
      // 	await token.document.unsetFlag(
      // 		CONSTANTS.MODULE_ID,
      // 		TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY
      // 	);
      // 	await token.document.unsetFlag(
      // 		CONSTANTS.MODULE_ID,
      // 		TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY
      // 	);
      // }
    }

    event.currentTarget.classList.toggle("active", !borderIsDisabled);
  }

  static async ToggleCustomBorder(event) {
    //@ts-ignore
    const tokenTmp = this.object;

    const currentCustomColorTokenInt =
      tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT) ||
      "#000000";

    const currentCustomColorTokenExt =
      tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT) ||
      "#000000";

    const currentCustomColorTokenFrameOpacity =
      tokenTmp.document.getFlag(
        CONSTANTS.MODULE_ID,
        TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY
      ) || 0.5;

    const currentCustomColorTokenBaseOpacity =
      tokenTmp.document.getFlag(
        CONSTANTS.MODULE_ID,
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
              html.find(`input[data-edit='token-factions.currentCustomColorTokenFrameOpacity']`)[0]
            ).val();
            const newCurrentCustomColorTokenBaseOpacity = $(
              html.find(`input[data-edit='token-factions.currentCustomColorTokenBaseOpacity']`)[0]
            ).val();
            for (const token of canvas.tokens?.controlled) {
              token.document.setFlag(
                CONSTANTS.MODULE_ID,
                TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT,
                newCurrentCustomColorTokenInt
              );
              token.document.setFlag(
                CONSTANTS.MODULE_ID,
                TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT,
                newCurrentCustomColorTokenExt
              );
              token.document.setFlag(
                CONSTANTS.MODULE_ID,
                TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY,
                newCurrentCustomColorTokenFrameOpacity
              );
              token.document.setFlag(
                CONSTANTS.MODULE_ID,
                TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY,
                newCurrentCustomColorTokenBaseOpacity
              );
            }
          },
        },
        no: {
          label: i18n("token-factions.label.doNothing"),
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
    if (A[0] === undefined || A[1] === undefined || A[2] === undefined) console.error("RGB color invalid");
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
    canvas.tokens?.placeables.forEach((tokenDoc) => {
      TokenFactions._updateTokensBorder(tokenDoc.document);
    });
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
          //@ts-ignore
          tokenDoc = foundToken;
        }
      }

      if (!tokenDoc) {
        // Is not in the current canvas
        return;
      }
      // TokenDocument to Token
      //@ts-ignore
      const token = tokenDoc._object;
      if (!token.id) {
        return;
      }
      token.sortableChildren = true;
      // FVTT 10 WITH GRID
      /*
			//@ts-ignore
			if (!canvas.grid.faction) {
				//@ts-ignore
				canvas.grid.faction = {};
			}
			//@ts-ignore
			if (!canvas.grid.faction[token.id]) {
				//@ts-ignore
				canvas.grid.faction[token.id] = new PIXI.Container();
				//@ts-ignore
				canvas.grid.addChild(canvas.grid.faction[token.id]);
			}
			//@ts-ignore
			if (!canvas.grid.faction[token.id].geometry) {
				//@ts-ignore
				canvas.grid.removeChild(canvas.grid.faction[token.id]);
				//@ts-ignore
				canvas.grid.faction[token.id] = new PIXI.Container();
				//@ts-ignore
				canvas.grid.addChild(canvas.grid.faction[token.id]);
			}
			//@ts-ignore
			let factionBorderContainer = canvas.grid.faction[token.id];
			*/

      //@ts-ignore
      if (!token.faction || token.faction.destroyed) {
        //@ts-ignore
        token.faction = token.addChildAt(new PIXI.Container(), 0);
      }
      //@ts-ignore
      token.faction.removeChildren().forEach((c) => c.destroy());
      //@ts-ignore
      let factionBorderContainer = token.faction;

      //@ts-ignore
      factionBorderContainer = TokenFactions._drawBorderFaction(token, factionBorderContainer);
      //@ts-ignore
      // token.addChildAt(factionBorderContainer, 0);
      // TokenFactions.clearGridFaction(token.id);
      //@ts-ignore
      if (token.mesh) {
        //@ts-ignore
        if (token.border) {
          //@ts-ignore
          if (token.mesh.zIndex >= token.border.zIndex) {
            //@ts-ignore
            token.mesh.zIndex = token.border.zIndex - 1;
            //@ts-ignore
            if (token.faction.zIndex >= token.mesh.zIndex) {
              //@ts-ignore
              token.faction.zIndex = token.mesh.zIndex - 1;
            }
          }
          //@ts-ignore
          if (token.zIndex >= token.border.zIndex) {
            //@ts-ignore
            token.zIndex = token.border.zIndex - 1;
            //@ts-ignore
            if (token.faction.zIndex >= token.zIndex) {
              //@ts-ignore
              token.faction.zIndex = token.zIndex - 1;
            }
          }
          //@ts-ignore
          if (token.faction.zIndex >= token.border.zIndex) {
            //@ts-ignore
            token.faction.zIndex = token.border.zIndex - 1;
          }
        } else {
          //@ts-ignore
          if (token.faction.zIndex >= token.mesh.zIndex) {
            //@ts-ignore
            token.faction.zIndex = token.mesh.zIndex - 1;
          }
        }
      } else {
        //@ts-ignore
        if (token.border) {
          //@ts-ignore
          if (token.zIndex >= token.border.zIndex) {
            //@ts-ignore
            token.zIndex = token.border.zIndex - 1;
            //@ts-ignore
            if (token.faction.zIndex >= token.zIndex) {
              //@ts-ignore
              token.faction.zIndex = token.zIndex - 1;
            }
          }
        } else {
          //@ts-ignore
          if (token.faction.zIndex >= token.zIndex) {
            //@ts-ignore
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
        //@ts-ignore
        color = token.actor.folder.color;
        //@ts-ignore
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
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT
    );
    const currentCustomColorTokenExt = token.document.getFlag(
      CONSTANTS.MODULE_ID,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT
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

      //@ts-ignore
      const d = parseInt(token.document.disposition);
      //@ts-ignore
      if (!game.user?.isGM && token.owner) {
        borderColor = overrides.CONTROLLED;
      }
      //@ts-ignore
      else if (token.actor?.hasPlayerOwner) {
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

  static _drawBorderFaction(token, container) {
    //@ts-ignore
    if (!container && token.faction) {
      //@ts-ignore
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
      //@ts-ignore
      if (token.document.x === 0 && token.document.y === 0) {
        debug(`No token is founded or passed`);
        return;
      }
    }

    // // OLD FVTT 9
    // //@ts-ignore
    // container.children.forEach((c) => c.clear());
    // // container.removeChildren().forEach(c => c.destroy());

    // Some systems have special classes for factions, if we can't removeChildren,
    // then use the token's children and make sure to only remove the ones we created
    //@ts-ignore
    if (container.removeChildren) {
      //@ts-ignore
      container.children.forEach((c) => c.clear());
      // container.removeChildren().forEach(c => c.destroy());
    }
    //@ts-ignore
    else if (token.removeChildren) {
      token.children.forEach((c) => {
        //@ts-ignore
        if (c.source === CONSTANTS.MODULE_ID) {
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
    switch (game.settings.get(CONSTANTS.MODULE_ID, "removeBorders")) {
      case "0":
        break;
      case "1":
        //@ts-ignore
        if (!token.owner) {
          return;
        }
        break;
      case "2":
        return;
    }

    //@ts-ignore
    let skipDraw;
    try {
      //skipDraw = token.document.getFlag(
      //	CONSTANTS.MODULE_ID,
      //	TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE
      //);
      skipDraw = getProperty(
        token.document,
        `flags.${CONSTANTS.MODULE_ID}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`
      );
    } catch (e) {
      //@ts-ignore
      token.document.setFlag(CONSTANTS.MODULE_ID, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE, false);
      skipDraw = token.document.getFlag(CONSTANTS.MODULE_ID, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE);
    }
    //@ts-ignore
    if (skipDraw) {
      return;
    }

    const frameStyle = String(game.settings.get(CONSTANTS.MODULE_ID, "frame-style"));

    if (frameStyle == TokenFactions.TOKEN_FACTIONS_FRAME_STYLE.FLAT) {
      // frameStyle === 'flat'
      const fillTexture = game.settings.get(CONSTANTS.MODULE_ID, "fillTexture");
      TokenFactions._drawBorder(token, borderColor, container, fillTexture);
    } else if (frameStyle == TokenFactions.TOKEN_FACTIONS_FRAME_STYLE.BELEVELED) {
      // frameStyle === 'bevelled'
      const fillTexture = game.settings.get(CONSTANTS.MODULE_ID, "fillTexture");
      const frameWidth = canvas.grid?.grid?.w * (game.settings.get(CONSTANTS.MODULE_ID, "borderWidth") / 100);

      // BASE CONFIG
      let t = game.settings.get(CONSTANTS.MODULE_ID, "borderWidth") || CONFIG.Canvas.objectBorderThickness;
      const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");
      //@ts-ignore
      if (game.settings.get(CONSTANTS.MODULE_ID, "permanentBorder") && token._controlled) {
        t = t * 2;
      }
      const sB = game.settings.get(CONSTANTS.MODULE_ID, "scaleBorder");
      const bS = game.settings.get(CONSTANTS.MODULE_ID, "borderGridScale");
      const nBS = bS ? canvas.dimensions?.size / 100 : 1;
      //@ts-ignore
      const sX = sB ? token.document.texture.scaleX : 1;
      //@ts-ignore
      const sY = sB ? token.document.texture.scaleY : 1;
      const sW = sB ? (token.w - token.w * sX) / 2 : 0;
      const sH = sB ? (token.h - token.h * sY) / 2 : 0;

      let frameOpacity = game.settings.get(CONSTANTS.MODULE_ID, "frame-opacity") || 0.5;
      let baseOpacity = game.settings.get(CONSTANTS.MODULE_ID, "base-opacity") || 0.5;

      const customFrameOpacity = token.document.getFlag(
        CONSTANTS.MODULE_ID,
        TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY
      );
      const customBaseOpacity = token.document.getFlag(
        CONSTANTS.MODULE_ID,
        TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY
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
        //@ts-ignore
        .beginFill(Color.from(0xffffff), 0.0)
        .drawCircle(token.w / 2, token.h / 2, token.w / 2)
        .endFill();

      innerRingMask
        .lineStyle(h * nBS, borderColor.EX, 1.0)
        //@ts-ignore
        .beginFill(Color.from(0xffffff), 0.0)
        .drawCircle(token.w / 2, token.h / 2, token.w / 2 - frameWidth / 2)
        .endFill();

      ringTextureMask
        .lineStyle(h * nBS, borderColor.EX, 1.0)
        //@ts-ignore
        .beginFill(Color.from(0xffffff), 0.0)
        .drawCircle(token.w / 2, token.h / 2, token.w / 2)
        .endFill();

      //@ts-ignore
      token.faction.addChild(outerRing);
      //@ts-ignore
      token.faction.addChild(outerRingMask);
      outerRing.mask = outerRingMask;
      //@ts-ignore
      token.faction.addChild(innerRing);
      //@ts-ignore
      token.faction.addChild(innerRingMask);
      innerRing.mask = innerRingMask;
      //@ts-ignore
      token.faction.addChild(ringTexture);
      //@ts-ignore
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
      TokenFactions._drawBorder(token,borderColorRingTextureMask,ringTextureMask,false);

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
    } else {
      const fillTexture = game.settings.get(CONSTANTS.MODULE_ID, "fillTexture");
      TokenFactions._drawBorder(token, borderColor, container, fillTexture);
    }
    return container;
  }

  static _drawBorder(token, borderColor, container, fillTexture) {
    // //@ts-ignore
    // const factionBorder = container.addChild(new PIXI.Graphics());
    const factionBorder = new PIXI.Graphics();

    // If we cannot create an faction as a child of the token through factions field,
    // then do it through direct token's children while keeping track of which children we created

    if (container.addChild) {
      container.addChild(factionBorder);
    }
    //@ts-ignore
    else if (token.addChild) {
      //@ts-ignore
      factionBorder.source = CONSTANTS.MODULE_ID;
      token.addChild(factionBorder);
    }

    //@ts-ignore
    if (canvas.interface.reverseMaskfilter) {
      //@ts-ignore
      factionBorder.filters = [canvas.interface.reverseMaskfilter];
    }
    //@ts-ignore
    // factionBorder.zIndex = container.zIndex;

    let t = game.settings.get(CONSTANTS.MODULE_ID, "borderWidth") || CONFIG.Canvas.objectBorderThickness;
    const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");
    //@ts-ignore
    if (game.settings.get(CONSTANTS.MODULE_ID, "permanentBorder") && token._controlled) {
      t = t * 2;
    }
    const sB = game.settings.get(CONSTANTS.MODULE_ID, "scaleBorder");
    const bS = game.settings.get(CONSTANTS.MODULE_ID, "borderGridScale");
    const nBS = bS ? canvas.dimensions?.size / 100 : 1;
    //@ts-ignore
    const sX = sB ? token.document.texture.scaleX : 1;
    //@ts-ignore
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
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY
    );
    const customBaseOpacity = token.document.getFlag(
      CONSTANTS.MODULE_ID,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY
    );

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
        //@ts-ignore
        factionBorder
          //@ts-ignore
          .beginFill(Color.from(borderColor.EX), baseOpacity)
          .lineStyle(t * nBS, borderColor.EX, 0.8)
          // .drawCircle(token.x + token.w / 2, token.y + token.h / 2, (token.w / 2) * sX + t + p)
          .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + t + p)
          .beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity })
          .endFill();
        // .lineStyle(t*nBS, borderColor.EX, 0.8)
        // .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + t + p);

        //@ts-ignore
        factionBorder
          //@ts-ignore
          .beginFill(Color.from(borderColor.INT), baseOpacity)
          //@ts-ignore
          .lineStyle(h * nBS, Color.from(borderColor.INT), 1.0)
          // .drawCircle(token.x + token.w / 2, token.y + token.h / 2, (token.w / 2) * sX + h + t / 2 + p)
          .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + h + t / 2 + p)
          //@ts-ignore
          .beginTextureFill({ texture: textureINT, color: Color.from(borderColor.INT), alpha: baseOpacity })
          .endFill();
        // .lineStyle(h*nBS, Color.from(borderColor.INT), 1.0)
        // .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + h + t / 2 + p);
      }
      //@ts-ignore
      factionBorder
        .lineStyle(t * nBS, borderColor.EX, 0.8)
        // .drawCircle(token.x + token.w / 2, token.y + token.h / 2, (token.w / 2) * sX + t + p);
        .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + t + p);

      //@ts-ignore
      factionBorder
        //@ts-ignore
        .lineStyle(h * nBS, Color.from(borderColor.INT), 1.0)
        // .drawCircle(token.x + token.w / 2, token.y + token.h / 2, (token.w / 2) * sX + h + t / 2 + p);
        .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + h + t / 2 + p);
    }
    //@ts-ignore
    else if (hexTypes.includes(canvas.grid?.type) && token.width === 1 && token.height === 1) {
      // const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");
      const q = Math.round(p / 2);
      //@ts-ignore
      const polygon = canvas.grid?.grid?.getPolygon(
        -1.5 - q + sW,
        -1.5 - q + sH,
        (token.w + 2) * sX + p,
        (token.h + 2) * sY + p
      );
      //@ts-ignore
      // const polygon = canvas.grid?.grid?.getPolygon(
      // 	-1.5 - q + sW,
      // 	-1.5 - q + sH,
      // 	(token.w + 2) * s + p,
      // 	(token.h + 2) * s + p
      // );

      if (fillTexture) {
        //@ts-ignore
        factionBorder
          //@ts-ignore
          .beginFill(Color.from(borderColor.EX), baseOpacity)
          .lineStyle(t * nBS, borderColor.EX, 0.8)
          .drawPolygon(polygon)
          .beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity })
          .endFill();
        // .lineStyle(t*nBS, borderColor.EX, 0.8)
        // .drawPolygon(polygon);

        //@ts-ignore
        factionBorder
          //@ts-ignore
          .beginFill(Color.from(borderColor.INT), baseOpacity)
          //@ts-ignore
          .lineStyle((t * nBS) / 2, Color.from(borderColor.INT), 1.0)
          .drawPolygon(polygon)
          //@ts-ignore
          .beginTextureFill({ texture: textureINT, color: Color.from(borderColor.INT), alpha: baseOpacity })
          .endFill();
        // .lineStyle(t*nBS / 2, Color.from(borderColor.INT), 1.0)
        // .drawPolygon(polygon);
      }
      //@ts-ignore
      factionBorder.lineStyle(t * nBS, borderColor.EX, 0.8).drawPolygon(polygon);

      //@ts-ignore
      factionBorder.lineStyle((t * nBS) / 2, Color.from(borderColor.INT), 1.0).drawPolygon(polygon);
    }

    // Otherwise Draw Square border
    else {
      // const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");
      const q = Math.round(p / 2);
      const h = Math.round(t / 2);
      const o = Math.round(h / 2);

      if (fillTexture) {
        //@ts-ignore
        factionBorder
          //@ts-ignore
          .beginFill(Color.from(borderColor.EX), baseOpacity)
          .lineStyle(t * nBS, borderColor.EX, 0.8)
          // .drawRoundedRect(token.x, token.y, token.w, token.h, 3)
          .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3)
          .beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity })
          .endFill();
        // .lineStyle(t*nBS, borderColor.EX, 0.8)
        // .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);

        //@ts-ignore
        factionBorder
          //@ts-ignore
          .beginFill(Color.from(borderColor.INT), baseOpacity)
          //@ts-ignore
          .lineStyle(h * nBS, Color.from(borderColor.INT), 1.0)
          // .drawRoundedRect(token.x, token.y, token.w, token.h, 3)
          .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3)
          //@ts-ignore
          .beginTextureFill({ texture: textureINT, color: Color.from(borderColor.INT), alpha: baseOpacity })
          .endFill();
        // .lineStyle(h*nBS, Color.from(borderColor.INT), 1.0)
        // .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);
      }
      //@ts-ignore
      factionBorder
        .lineStyle(t * nBS, borderColor.EX, 0.8)
        // .drawRoundedRect(token.x, token.y, token.w, token.h, 3);
        .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);

      //@ts-ignore
      factionBorder
        //@ts-ignore
        .lineStyle(h * nBS, Color.from(borderColor.INT), 1.0)
        // .drawRoundedRect(token.x, token.y, token.w, token.h, 3);
        .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);
    }
  }

  static clearAllGridFaction() {
    const tokens = canvas.tokens?.placeables;
    for (const token of tokens) {
      //@ts-ignore
      if (token.faction) {
        //@ts-ignore
        token.faction.removeChildren().forEach((c) => c.destroy());
      }
      TokenFactions.clearGridFaction(token.id);
    }
  }

  static clearGridFaction(tokenId) {
    //@ts-ignore
    if (canvas?.grid?.faction) {
      //@ts-ignore
      const factionBorder = canvas?.grid?.faction[tokenId];
      //@ts-ignore
      if (factionBorder && !factionBorder.destroyed) {
        //@ts-ignore
        factionBorder.children.forEach((c) => {
          //@ts-ignore
          if (c && !c._destroyed) {
            //@ts-ignore
            c.clear();
          }
        });
        //@ts-ignore
        factionBorder?.destroy();
        //@ts-ignore
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
