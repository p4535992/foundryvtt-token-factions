import { TokenFactions } from "./tokenFactions";
import CONSTANTS from "./constants";
import API from "./api";
import Logger from "./lib/Logger";
import { handleRenderHUD } from "./hud";
import { renderTokenConfig as handelRenderTokenConfig } from "./config-token";
import { handelRenderSettingsConfig } from "./config-settings";

export const initHooks = async (): Promise<void> => {
  await TokenFactions.onInit();
  // setup all the hooks

  Hooks.on("renderSettingsConfig", handelRenderSettingsConfig);

  Hooks.on("closeSettingsConfig", (token, data) => {
    // Add specific types if known for token and data
  });

  Hooks.on("updateSetting", (setting: any) => { // Consider a more specific type for Setting
    if (setting.key.startsWith(CONSTANTS.MODULE_ID)) {
      Logger.debug(`Faction settings changed. Key: ${setting.key} to ${setting.value}`);
      TokenFactions.updateAllTokens();
    }
  });

  Hooks.on("renderTokenConfig", handelRenderTokenConfig);

  Hooks.on("canvasReady", (canvas: Canvas) => {
    TokenFactions.setupTokens(canvas);
  });

  Hooks.on("createToken", (tokenDocument: TokenDocument) => {
    if(tokenDocument.object){
      TokenFactions.setupFactionForToken(tokenDocument.object as Token);
    }
  });

  Hooks.on("updateToken", (tokenDocument: TokenDocument, changes: any) => { // Consider a more specific type for changes
    if (shouldUpdateToken(changes)) {
      if(tokenDocument.object){
        (tokenDocument.object as any).faction.updateToken();
      }
    }
  });

  Hooks.on("deleteToken", (tokenDocument: TokenDocument) => {
    if (tokenDocument.object && (tokenDocument.object as any).faction) {
      (tokenDocument.object as any).faction.destroy();
    }
  });

  Hooks.on("updateFolder", (tokenData: Folder, changes: any) => { // Consider a more specific type for changes
    // Update only if color changes
    if (changes.color) {
      Logger.debug(`Folder color changed, updating tokens in ${tokenData.name}`);
      TokenFactions.updateTokenFolder(tokenData);
    }
  });

  Hooks.on("renderTokenHUD", handleRenderHUD);

  Hooks.on("refreshToken", (token: Token, options: {refreshBorder?: boolean, refreshVisibility?: boolean}) => {
    if ((token as any).faction) {
      if (options.refreshBorder || options.refreshVisibility) {
        (token as any).faction.updateToken();
      }
    }
  });
};

export const setupHooks = async (): Promise<void> => {
  (game.modules.get(CONSTANTS.MODULE_ID) as any).api = API;
};

export const readyHooks = (): void => {
  // DO NOTHING
};

// This is a helper function to determine if the token should be updated
// NOTE: Remove if token update doesn't work correctly
function shouldUpdateToken(data: any): boolean { // Consider a more specific type for data
  return (
    foundry.utils.hasProperty(data, "flags") ||
    foundry.utils.hasProperty(data, "height") ||
    foundry.utils.hasProperty(data, "width")
  );
} 