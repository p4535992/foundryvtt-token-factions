import { FactionBorderGraphics } from "./models.js";
import { TokenFactions } from "./TokenFactions.js";
import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";
import { injectConfig } from "./lib/injectConfig.js";
import { isRealNumber } from "./lib/lib.js";
import { drawBorderFaction } from "./render.js";

export class TokenFaction {
  static TOKEN_FACTIONS_FRAME_STYLE = {
    FLAT: "flat",
    BELEVELED: "beveled",
    BORDER: "border",
  };

  constructor(token) {
    Logger.debug("Creating token's faction for %s", token.name);
    token.faction = this;
    this.token = token;
    this.container = token.addChildAt(this.createTokenContainer(), 0);
    drawBorderFaction(token);
  }

  updateToken() {
    if (!this.token) {
      Logger.warn("No token was setup");
      return;
    }

    if (!(this.token instanceof Token)) {
      Logger.warn("Token is not a Token instance");
      return;
    }

    Logger.debug("Updating token %s", this.token.document.name);
    drawBorderFaction(this.token);
  }

  createTokenContainer() {
    const container = new PIXI.Container();
    container.name = CONSTANTS.MODULE_ID;
    return container;
  }

  destroy() {
    Logger.debug("Destroying token's faction for %s", this.token.name);
    this.token.removeChild(this.container);
    this.container.destroy();
    this.token.faction = null;
    this.token = null;
  }
}
