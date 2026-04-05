/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your module
 */
// Import TypeScript modules
import { initHooks, readyHooks, setupHooks } from "./scripts/hooks";
import CONSTANTS from "./scripts/constants";
import API from "./scripts/api";
import Logger from "./scripts/lib/Logger";
import { initTokenFlags } from "./scripts/lib/utils";
import { registerSettings } from "./scripts/settings";

declare const game: Game; 

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once("init", () => {
  console.log(`${CONSTANTS.MODULE_ID} | Initializing ${CONSTANTS.MODULE_ID}`);
  initTokenFlags();

  // Do anything once the module is ready
  if (!game.modules?.get("lib-wrapper")?.active && game.user?.isGM) {
    let word = "install and activate";
    if (game.modules.get("lib-wrapper")) word = "activate";
    throw Logger.error(`Requires the 'libWrapper' module. Please ${word} it.`);
  }

  // Register custom module settings
  registerSettings();
  initHooks();
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once("setup", function () {
  setupHooks();
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once("ready", () => {
  // Do anything once the module is ready
  readyHooks();
});

// Add any additional hooks if necessary
