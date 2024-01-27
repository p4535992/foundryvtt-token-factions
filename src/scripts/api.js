import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";
import { isStringEquals } from "./lib/lib.js";
import { TokenFactions } from "./tokenFactions.js";

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
      Logger.warn(`No token is been found with reference '${tokenIdOrName}'`, true);
      return;
    }

    await token.document.setFlag(CONSTANTS.MODULE_ID, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE, true);
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
      Logger.warn(`No token is been found with reference '${tokenIdOrName}'`, true);
      return;
    }

    await token.document.setFlag(CONSTANTS.MODULE_ID, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE, false);
  },

  async retrieveBorderFactionsColorFromToken(tokenIdOrName) {
    const token = canvas.tokens?.placeables.find((t) => {
      return isStringEquals(t.id, tokenIdOrName) || isStringEquals(t.name, tokenIdOrName);
    });

    const factionGraphicDefaultS = "#000000";

    if (!token) {
      Logger.warn(`No token is been found with reference '${tokenIdOrName}'`, true);
      return factionGraphicDefaultS;
    }

    const borderColor = TokenFactions.colorBorderFaction(token);

    if (!borderColor) {
      return factionGraphicDefaultS;
    }
    if (!borderColor.INT || Number.isNaN(borderColor.INT)) {
      return factionGraphicDefaultS;
    }
    switch (game.settings.get(CONSTANTS.MODULE_ID, "removeBorders")) {
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
      skipDraw = token.document.getFlag(CONSTANTS.MODULE_ID, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE);
    } catch (e) {
      await token.document.setFlag(CONSTANTS.MODULE_ID, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE, false);
      skipDraw = token.document.getFlag(CONSTANTS.MODULE_ID, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE);
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
      throw Logger.error("clearGridFactionArr | inAttributes must be of type array");
    }
    const [tokenId] = inAttributes;
    this.clearGridFaction(tokenId);
  },
};

export default API;
