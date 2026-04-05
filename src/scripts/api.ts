import CONSTANTS from "./constants";
import Logger from "./lib/Logger";
import { isStringEquals } from "./lib/lib";
import { colorBorderFaction } from "./render";
import { FactionBorderGraphics } from "./models";
import { ModuleSettings } from "./settings";
import "./lib/utils"; // Import to ensure token extensions are applied

declare const game: Game;

/**
 * Token Factions API
 * Provides external access to module functionality for other modules, macros, and scripts
 */
const API = {
  /**
   * Set faction border enabled/disabled for a single token
   */
  async setEnableTokenBorderFaction(tokenIdOrName: string, enabled: boolean): Promise<void> {
    validateTokenId(tokenIdOrName);

    const token = findToken(tokenIdOrName);

    if (!token) {
      Logger.warn(`No token found with reference '${tokenIdOrName}'`, true);
      return;
    }

    try {
      await token.document.setFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_ENABLE_BORDER, enabled);
      Logger.debug(`${enabled ? "Enabled" : "Disabled"} faction border for token: ${token.name}`);
    } catch (error) {
      Logger.error(`Failed to ${enabled ? "enable" : "disable"} faction border for token '${tokenIdOrName}':`, error);
      throw error;
    }
  },

  /**
   * Set faction borders enabled/disabled for multiple tokens
   */
  async setEnableTokensBorderFaction(tokenIdsOrNames: string[], enabled: boolean): Promise<void> {
    if (!Array.isArray(tokenIdsOrNames)) {
      throw new Error("tokenIdsOrNames must be an array");
    }

    const results = await Promise.allSettled(
      tokenIdsOrNames.map((id) => this.setEnableTokenBorderFaction(id, enabled)),
    );

    const failures = results.filter((result) => result.status === "rejected");

    if (failures.length > 0) {
      Logger.warn(`Failed to ${enabled ? "enable" : "disable"} borders for ${failures.length} tokens`);
    }
  },

  /**
   * Check if token border is enabled
   */
  async isTokenBorderEnabled(tokenIdOrName: string): Promise<boolean> {
    validateTokenId(tokenIdOrName);

    const token = findToken(tokenIdOrName);
    if (!token) {
      Logger.warn(`No token found with reference '${tokenIdOrName}'`, true);
      return false;
    }

    try {
      const enableFlag = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_ENABLE_BORDER) as
        | boolean
        | undefined;
      return enableFlag ?? ModuleSettings.getEnableDefault();
    } catch (error) {
      Logger.error(`Failed to check border status for token '${tokenIdOrName}':`, error);
      return false;
    }
  },

  /**
   * Get the current faction border colors for a token (inner and outer)
   * Returns colors regardless of whether border is enabled or not
   * Prioritizes custom token colors over global settings
   */
  async getTokenBorderFactionColor(tokenIdOrName: string): Promise<FactionBorderGraphics | undefined> {
    validateTokenId(tokenIdOrName);

    const token = findToken(tokenIdOrName);

    if (!token) {
      Logger.warn(`No token found with reference '${tokenIdOrName}'`, true);
      return undefined;
    }

    try {
      // Check if token has custom colors enabled
      const hasCustomBorder = token.getFactionCustomBorder();

      if (hasCustomBorder) {
        // Use custom token colors
        const customColorInt = token.getFactionCustomColorInt();
        const customColorExt = token.getFactionCustomColorExt();

        if (customColorInt && customColorExt) {
          return {
            INT: Color.fromString(customColorInt),
            EX: Color.fromString(customColorExt),
          };
        }
      }

      // Fall back to global colors based on token disposition/folder
      const borderColor = colorBorderFaction(token);

      if (borderColor && borderColor.INT && borderColor.EX) {
        return borderColor;
      }

      // Final fallback - return default colors
      return {
        INT: Color.fromString(ModuleSettings.getHostileColor()),
        EX: Color.fromString(ModuleSettings.getHostileColorEx()),
      };
    } catch (error) {
      Logger.error(`Error retrieving border colors for token '${tokenIdOrName}':`, error);
      return undefined;
    }
  },

  /**
   * Force update all tokens' faction rendering
   */
  async updateAllTokens(): Promise<void> {
    try {
      const { TokenFactions } = await import("./tokenFactions");
      await TokenFactions.updateAllTokens();
      Logger.debug("Updated all token factions");
    } catch (error) {
      Logger.error("Failed to update all tokens:", error);
      throw error;
    }
  },
};

/**
 * Find a token by ID or name
 */
function findToken(tokenIdOrName: string): Token | undefined {
  if (!game.canvas?.tokens?.placeables) {
    return undefined;
  }

  return game.canvas.tokens.placeables.find((token: Token) => {
    return isStringEquals(token.id, tokenIdOrName) || isStringEquals(token.name, tokenIdOrName);
  });
}

/**
 * Validate token identifier
 */
function validateTokenId(tokenIdOrName: string): void {
  if (!tokenIdOrName || typeof tokenIdOrName !== "string" || tokenIdOrName.trim() === "") {
    throw new Error("Token identifier must be a non-empty string");
  }
}

export default API;
