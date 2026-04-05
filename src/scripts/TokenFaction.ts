import CONSTANTS from "./constants";
import Logger from "./lib/Logger";
import { drawBorderFaction } from "./render";

export class TokenFaction {
  token: Token | null;
  container: PIXI.Container;

  constructor(token: Token) {
    Logger.debug("Creating token's faction for %s", token.name);
    (token as any).faction = this;
    this.token = token;
    this.container = token.addChildAt(this.createTokenContainer(), 0);
    drawBorderFaction(token);
  }

  updateToken(): void {
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

  createTokenContainer(): PIXI.Container {
    const container = new PIXI.Container();
    container.name = CONSTANTS.MODULE_ID;
    return container;
  }

  destroy(): void {
    this.container.destroy();
    
    if(this.token){
        Logger.debug("Destroying token's faction for %s", this.token.name);
        this.token.removeChild(this.container);
        (this.token as any).faction = null;
        this.token = null;
    }
  }
} 