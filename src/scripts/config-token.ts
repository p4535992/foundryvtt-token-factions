import CONSTANTS from "./constants";
import Logger from "./lib/Logger";
import { injectConfig } from "./lib/injectConfig";
import { isRealBoolean, isRealNumber } from "./lib/lib";
import { ModuleSettings } from "./settings";

declare const game: Game; 

export const renderTokenConfig = async function (config: TokenConfig, html: JQuery): Promise<void> {
  await renderTokenConfigHandler(config, html); // Added await here as renderTokenConfigHandler is async
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
async function renderTokenConfigHandler(tokenConfig: TokenConfig, html: JQuery): Promise<void> {
  if (!html) {
    return;
  }

  injectConfig.inject(
    tokenConfig,
    $(html),
    {
      moduleId: CONSTANTS.MODULE_ID,
      tab: {
        name: CONSTANTS.MODULE_ID,
        label: Logger.i18n("token-factions.tokeconfig.factions"),
        icon: "fas fa-user-circle",
      },
    },
    tokenConfig.object as TokenDocument // Added type assertion
  );

  const posTab = $(html).find(`.tab[data-tab="${CONSTANTS.MODULE_ID}"]`);
  const tokenDocument = tokenConfig.document as TokenDocument;
  const tokenFlags = tokenDocument.flags[CONSTANTS.MODULE_ID] || {};
  
  const data = {
    enableBorder: isRealBoolean(tokenFlags[CONSTANTS.FLAGS.FACTION_ENABLE_BORDER])
      ? Boolean(tokenFlags[CONSTANTS.FLAGS.FACTION_ENABLE_BORDER])
      : false,
    customBorder: isRealBoolean(tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_BORDER])
      ? Boolean(tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_BORDER])
      : false,
    customColorInt:
      tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT] ||
      ModuleSettings.getHostileColor(),
    customColorExt:
      tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT] ||
      ModuleSettings.getHostileColorEx(),
    customFrameOpacity: isRealNumber(tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY])
      ? tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY]
      : ModuleSettings.getFrameOpacity(),
    customBaseOpacity: isRealNumber(tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY])
      ? tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY]
      : ModuleSettings.getBaseOpacity(),
  };

  const insertHTML = await renderTemplate(`modules/${CONSTANTS.MODULE_ID}/templates/token-config.html`, data);
  posTab.append(insertHTML);
} 