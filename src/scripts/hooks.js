import { TokenFactions } from "./tokenFactions.js";
import CONSTANTS from "./constants.js";
import API from "./api.js";
import Logger from "./lib/Logger.js";
import { handleRenderHUD } from "./hud.js";
import { renderTokenConfig as handelRenderTokenConfig } from "./config-token.js";
import { handelRenderSettingsConfig } from "./config-settings.js";

export const initHooks = async () => {
  await TokenFactions.onInit();
  // setup all the hooks

  Hooks.on("renderSettingsConfig", handelRenderSettingsConfig);

  Hooks.on("closeSettingsConfig", (token, data) => {});

  Hooks.on("updateSetting", (setting) => {
    if (setting.key.startsWith(CONSTANTS.MODULE_ID)) {
      Logger.debug(`Faction settings changed. Key: ${setting.key} to ${setting.value}`);
      TokenFactions.updateAllTokens();
    }
  });

  Hooks.on("renderTokenConfig", handelRenderTokenConfig);

  Hooks.on("canvasReady", (canvas) => {
    TokenFactions.setupTokens(canvas);
  });

  Hooks.on("createToken", (tokenDocument) => {
    TokenFactions.setupFactionForToken(tokenDocument.object);
  });

  Hooks.on("updateToken", (tokenDocument, changes) => {
    if (shouldUpdateToken(changes)) {
      tokenDocument.object.faction.updateToken();
    }
  });

  Hooks.on("destroyToken", (token) => {
    if (token?.faction) {
      token.faction.destroy();
    }
  });

  Hooks.on("updateFolder", (tokenData, changes) => {
    // Update only if color changes
    if (changes.color) {
      Logger.debug(`Folder color changed, updating tokens in ${tokenData.name}`);
      TokenFactions.updateTokenFolder(tokenData);
    }
  });

  Hooks.on("renderTokenHUD", handleRenderHUD);

  Hooks.on("refreshToken", (token, options) => {
    if (token.faction) {
      if (options.refreshBorder || options.refreshVisibility) {
        token.faction.updateToken();
      }
    }
  });
};

export const setupHooks = async () => {
  game.modules.get(CONSTANTS.MODULE_ID).api = API;
};

export const readyHooks = () => {
  // DO NOTHING
};

// This is a helper function to determine if the token should be updated
// NOTE: Remove if token update doesn't work correctly
function shouldUpdateToken(data) {
  return (
    foundry.utils.hasProperty(data, "flags") ||
    foundry.utils.hasProperty(data, "height") ||
    foundry.utils.hasProperty(data, "width")
  );
}
