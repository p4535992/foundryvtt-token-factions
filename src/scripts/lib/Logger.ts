import CONSTANTS from "../constants";
import { ModuleSettings } from "../settings";

declare const game: Game;

// ================================
// Logger utility
// ================================
export default class Logger {
  static get DEBUG(): boolean {
    return (
      ModuleSettings.getDebug() ||
      (game.modules.get("_dev-mode")?.api?.getPackageDebugValue(CONSTANTS.MODULE_ID, "boolean") as boolean)
    );
  }

  static debug(msg: string, ...args: any[]): string {
    try {
      if (
        ModuleSettings.getDebug() ||
        (game.modules.get("_dev-mode")?.api?.getPackageDebugValue(CONSTANTS.MODULE_ID, "boolean") as boolean)
      ) {
        console.log(`DEBUG | ${CONSTANTS.MODULE_ID} | ${msg}`, ...args);
      }
    } catch (e: any) {
      console.error(e.message);
    }
    return msg;
  }

  static logObject(...args: any[]): string {
    return this.log("", ...args); // Pass args correctly
  }

  static log(message: string, ...args: any[]): string {
    try {
      message = `${CONSTANTS.MODULE_ID} | ${message}`;
      console.log(message.replace("<br>", "\n"), ...args);
    } catch (e: any) {
      console.error(e.message);
    }
    return message;
  }

  static notify(message: string, ...args: any[]): string {
    try {
      message = `${CONSTANTS.MODULE_ID} | ${message}`;
      ui.notifications?.notify(message);
      console.log(message.replace("<br>", "\n"), ...args);
    } catch (e: any) {
      console.error(e.message);
    }
    return message;
  }

  static info(info: string, notify = false, ...args: any[]): string {
    try {
      info = `${CONSTANTS.MODULE_ID} | ${info}`;
      if (notify) {
        ui.notifications?.info(info);
      }
      console.log(info.replace("<br>", "\n"), ...args);
    } catch (e: any) {
      console.error(e.message);
    }
    return info;
  }

  static warn(warning: string, notify = false, ...args: any[]): string {
    try {
      warning = `${CONSTANTS.MODULE_ID} | ${warning}`;
      if (notify) {
        ui.notifications?.warn(warning);
      }
      console.warn(warning.replace("<br>", "\n"), ...args);
    } catch (e: any) {
      console.error(e.message);
    }
    return warning;
  }

  static errorObject(...args: any[]): Error {
    return this.error("", false, ...args); // Pass args correctly
  }

  static error(error: string, notify = true, ...args: any[]): Error {
    try {
      error = `${CONSTANTS.MODULE_ID} | ${error}`;
      if (notify) {
        ui.notifications?.error(error);
      }
      console.error(error.replace("<br>", "\n"), ...args);
    } catch (e: any) {
      console.error(e.message);
    }
    return new Error(error.replace("<br>", "\n"));
  }

  static timelog(message: string): string {
    return this.warn(String(Date.now()), false, message);
  }

  static i18n = (key: string): string => {
    return game.i18n?.localize(key)?.trim() ?? "debug_placeholder";
  };

  static i18nFormat = (key: string, data: Record<string, any> = {}): string => {
    return game.i18n?.format(key, data)?.trim() ?? "debug_placeholder";
  };

  static dialogWarning(message: string, icon = "fas fa-exclamation-triangle"): string {
    return `<p class="${CONSTANTS.MODULE_ID}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_ID}</strong>
        <br><br>${message}
    </p>`;
  }
}
