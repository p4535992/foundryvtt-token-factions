import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";
import { injectConfig } from "./lib/injectConfig.js";
import { isRealBoolean, isRealNumber } from "./lib/lib.js";

export const renderTokenConfig = async function (config, html) {
  renderTokenConfigHandler(config, html);
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
async function renderTokenConfigHandler(tokenConfig, html) {
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
        label: Logger.i18n("token-factions.tokeconfig.factions"),
        icon: "fas fa-user-circle",
      },
    },
    tokenConfig.object,
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
    disableBorder: isRealBoolean(tokenFlags[CONSTANTS.FLAGS.FACTION_DISABLE_BORDER])
      ? Boolean(tokenFlags[CONSTANTS.FLAGS.FACTION_DISABLE_BORDER])
      : false,
    customBorder: isRealBoolean(tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_BORDER])
      ? Boolean(tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_BORDER])
      : false,
    customColorInt:
      tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT] ||
      game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR),
    customColorExt:
      tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT] ||
      game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR_EX),
    customFrameOpacity: isRealNumber(tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY])
      ? tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY]
      : game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRAME_OPACITY),
    customBaseOpacity: isRealNumber(tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY])
      ? tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY]
      : game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BASE_OPACITY),
  };

  const insertHTML = await renderTemplate(`modules/${CONSTANTS.MODULE_ID}/templates/token-config.html`, data);
  posTab.append(insertHTML);
}
