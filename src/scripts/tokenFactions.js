import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";
import { TokenFaction } from "./TokenFaction.js";
import { initTexture as initTextures } from "./render.js";

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

  static defaultColors;

  static dispositions;

  static async onInit() {
    TokenFactions.defaultColors = {
      "party-member": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR), //'#33bc4e',
      "party-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR), //'#33bc4e',
      "friendly-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR), //'#43dfdf',
      "neutral-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR), //'#f1d836',
      "hostile-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR), //'#e72124',

      "controlled-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR),
      "neutral-external-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX),
      "friendly-external-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX),
      "hostile-external-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR_EX),
      "controlled-external-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX),
      "party-external-member": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR_EX),
      "party-external-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR_EX),
    };

    TokenFactions.dispositions = Object.keys(TokenFactions.defaultColors);
    await initTextures();
  }

  static setupTokens(canvas) {
    Logger.debug("Setup tokens");
    canvas.tokens.placeables.forEach((token) => {
      TokenFactions.setupFactionForToken(token);
    });
  }

  static updateTokenFolder(tokenFolder) {
    Logger.debug("Updating folder");
    const tokens = canvas.tokens?.placeables;
    for (const token of tokens) {
      if (token.actor?.folder?.id === tokenFolder.id) {
        token.faction.updateToken();
      }
    }
  }

  static async updateAllTokens() {
    Logger.debug("Updating all tokens");
    canvas.tokens.placeables.forEach((token) => {
      token?.faction?.updateToken();
    });
  }

  static setupFactionForToken(token) {
    Logger.debug("Setting up faction for token %s", token.name);
    const faction = new TokenFaction(token);
    return faction;
  }

  // START NEW MANAGE

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
}
