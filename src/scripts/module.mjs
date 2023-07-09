import { warn, error, debug, i18n, advancedLosTestInLos, getOwnedTokens } from "./lib/lib.mjs";
import { TokenFactions } from "./tokenFactions.mjs";
import CONSTANTS from "./constants.mjs";
import { setApi } from "../main.mjs";
import API from "./api.mjs";
// import { registerSocket, tokenFactionsSocket } from "./socket";

export const initHooks = async () => {
  warn("Init Hooks processing");
  TokenFactions.onInit();

  // Hooks.once("socketlib.ready", registerSocket);
  // registerSocket();

  Hooks.on("renderSettingsConfig", (app, el, data) => {
    const nC = game.settings.get(CONSTANTS.MODULE_ID, "neutralColor");
    const fC = game.settings.get(CONSTANTS.MODULE_ID, "friendlyColor");
    const hC = game.settings.get(CONSTANTS.MODULE_ID, "hostileColor");
    const cC = game.settings.get(CONSTANTS.MODULE_ID, "controlledColor");
    const pC = game.settings.get(CONSTANTS.MODULE_ID, "partyColor");
    const nCE = game.settings.get(CONSTANTS.MODULE_ID, "neutralColorEx");
    const fCE = game.settings.get(CONSTANTS.MODULE_ID, "friendlyColorEx");
    const hCE = game.settings.get(CONSTANTS.MODULE_ID, "hostileColorEx");
    const cCE = game.settings.get(CONSTANTS.MODULE_ID, "controlledColorEx");
    const pCE = game.settings.get(CONSTANTS.MODULE_ID, "partyColorEx");
    const afCE = game.settings.get(CONSTANTS.MODULE_ID, "actorFolderColorEx");
    const cdCE = game.settings.get(CONSTANTS.MODULE_ID, "customDispositionColorEx");

    el.find('[name="token-factions.neutralColor"]')
      .parent()
      .append(`<input type="color" value="${nC}" data-edit="token-factions.neutralColor">`);
    el.find('[name="token-factions.friendlyColor"]')
      .parent()
      .append(`<input type="color" value="${fC}" data-edit="token-factions.friendlyColor">`);
    el.find('[name="token-factions.hostileColor"]')
      .parent()
      .append(`<input type="color" value="${hC}" data-edit="token-factions.hostileColor">`);
    el.find('[name="token-factions.controlledColor"]')
      .parent()
      .append(`<input type="color" value="${cC}" data-edit="token-factions.controlledColor">`);
    el.find('[name="token-factions.partyColor"]')
      .parent()
      .append(`<input type="color" value="${pC}" data-edit="token-factions.partyColor">`);

    el.find('[name="token-factions.neutralColorEx"]')
      .parent()
      .append(`<input type="color" value="${nCE}" data-edit="token-factions.neutralColorEx">`);
    el.find('[name="token-factions.friendlyColorEx"]')
      .parent()
      .append(`<input type="color" value="${fCE}" data-edit="token-factions.friendlyColorEx">`);
    el.find('[name="token-factions.hostileColorEx"]')
      .parent()
      .append(`<input type="color" value="${hCE}" data-edit="token-factions.hostileColorEx">`);
    el.find('[name="token-factions.controlledColorEx"]')
      .parent()
      .append(`<input type="color" value="${cCE}" data-edit="token-factions.controlledColorEx">`);
    el.find('[name="token-factions.partyColorEx"]')
      .parent()
      .append(`<input type="color" value="${pCE}" data-edit="token-factions.partyColorEx">`);

    el.find('[name="token-factions.actorFolderColorEx"]')
      .parent()
      .append(`<input type="color" value="${afCE}" data-edit="token-factions.actorFolderColorEx">`);
    el.find('[name="token-factions.customDispositionColorEx"]')
      .parent()
      .append(`<input type="color" value="${cdCE}" data-edit="token-factions.customDispositionColorEx">`);
  });

  if (game.settings.get(CONSTANTS.MODULE_ID, "tokenFactionsEnabled")) {
    // setup all the hooks

    Hooks.on("closeSettingsConfig", (token, data) => {
      TokenFactions.updateTokensAll();
    });

    Hooks.on("renderTokenConfig", (config, html) => {
      TokenFactions.renderTokenConfig(config, html);
    });

    Hooks.on("renderSettingsConfig", (sheet, html) => {
      TokenFactions.updateTokensAll();
    });

    Hooks.on("updateActor", (actor, data) => {
      // TokenFactions.updateTokenDataFaction(actor);
      // token?.refresh();
      if (
        hasProperty(data, "flags") &&
        hasProperty(data.flags[CONSTANTS.MODULE_ID], `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`) &&
        getProperty(data.flags[CONSTANTS.MODULE_ID], `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`)
      ) {
        // DO NOTHING
      } else {
        TokenFactions.updateTokenFaction(actor.token);
      }
    });

    Hooks.on("updateToken", (tokenDocument, data) => {
      //TokenFactions.updateTokenDataFaction(tokenDocument);
      // token?.refresh();
      if (
        hasProperty(data, "flags") &&
        hasProperty(data.flags[CONSTANTS.MODULE_ID], `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`) &&
        getProperty(data.flags[CONSTANTS.MODULE_ID], `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`)
      ) {
        // DO NOTHING
      } else {
        TokenFactions.updateTokenFaction(actor);
      }
    });

    Hooks.on("updateFolder", (folder, data) => {
      TokenFactions.updateTokenDataFaction(actor);
    });

    // Hooks.on('preUpdateActor', (actor, updateData) => {
    //   TokenFactions._applyFactions(actor, updateData);
    // });
    // Hooks.on('preUpdateToken', (tokenDocument, updateData) => {
    //   TokenFactions._applyFactions(tokenDocument,updateData);
    // });

    //@ts-ignore
    libWrapper.register(CONSTANTS.MODULE_ID, "Token.prototype.refresh", TokenPrototypeRefreshHandler, "MIXED");

    //@ts-ignore
    libWrapper.register(CONSTANTS.MODULE_ID, "Token.prototype.draw", TokenPrototypeDrawHandler, "MIXED");

    //@ts-ignore
    libWrapper.register(CONSTANTS.MODULE_ID, "Token.prototype._onUpdate", TokenPrototypeOnUpdateHandler, "MIXED");

    //@ts-ignore
    libWrapper.register(CONSTANTS.MODULE_ID, "Actor.prototype._onUpdate", ActorPrototypeOnUpdateHandler, "MIXED");

    Hooks.on("renderTokenHUD", (app, html, data) => {
      TokenFactions.AddBorderToggle(app, html, data);
    });

    // Hooks.on("createToken", (data) => {
    // 	const token = canvas.tokens?.get(data.id);
    // 	if (!token.owner) {
    // 		token.cursor = "default";
    // 	}
    // });

    // Hooks.on("canvasReady", () => {
    // 	canvas.tokens?.placeables.forEach((t) => {
    // 		t.draw();
    // 	});
    // });

    // Hooks.on("refreshToken", (token, options) => {
    // 	TokenFactions.updateTokenDataFaction(token.document);
    // });

    // canvas.tokens?.placeables.forEach((t) => {
    // 	if (!t.owner) {
    // 		t.cursor = "default";
    // 	}
    // });

    if (!TokenFactions.bevelGradient || !TokenFactions.bevelGradient.baseTexture) {
      TokenFactions.bevelGradient = await loadTexture(`modules/${CONSTANTS.MODULE_ID}/assets/bevel-gradient.jpg`);
      TokenFactions.bevelTexture = await loadTexture(`modules/${CONSTANTS.MODULE_ID}/assets/bevel-texture.png`);
    }
  }
};

export const setupHooks = async () => {
  setApi(API);
};

export const readyHooks = () => {
  // DO NOTHING
  Hooks.on("deleteToken", async (tokenDocument, data, updateData) => {
    const isPlayerOwned = tokenDocument.isOwner;
    if (!game.user?.isGM && !isPlayerOwned) {
      return;
    }
    TokenFactions.clearGridFaction(tokenDocument.id);
    // tokenFactionsSocket.executeAsGM("clearGridFaction", tokenDocument.id);
  });
};

export const TokenPrototypeRefreshHandler = function (wrapped, ...args) {
  const tokenDocument = this;
  TokenFactions.updateTokenDataFaction(tokenDocument);
  return wrapped(...args);
};

export const TokenPrototypeDrawHandler = function (wrapped, ...args) {
  const token = this;
  TokenFactions.updateTokenDataFaction(token.document);
  // this.drawFactions();
  return wrapped(...args);
};

export const TokenPrototypeOnUpdateHandler = function (wrapped, ...args) {
  if (
    hasProperty(args[0], "flags") &&
    hasProperty(args[0].flags[CONSTANTS.MODULE_ID], `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`) &&
    getProperty(args[0].flags[CONSTANTS.MODULE_ID], `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`)
  ) {
    // DO NOTHING
  } else {
    const token = this;
    TokenFactions.updateTokenDataFaction(token.document);
  }
  return wrapped(...args);
};

export const ActorPrototypeOnUpdateHandler = function (wrapped, ...args) {
  if (
    hasProperty(args[0], "flags") &&
    hasProperty(args[0].flags[CONSTANTS.MODULE_ID], `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`) &&
    getProperty(args[0].flags[CONSTANTS.MODULE_ID], `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`)
  ) {
    // DO NOTHING
  } else {
    const actor = this;
    //@ts-ignore
    TokenFactions.updateTokenDataFaction(actor.prototypeToken.document);
  }
  return wrapped(...args);
};

// export const TokenPrototypeRefreshBorderHandler = function (wrapped, ...args) {
//   //@ts-ignore
//   const token: Token = this as Token;
//   //@ts-ignore
//   TokenFactions.updateTokenDataFaction(token.document);
//   return wrapped(args);
// };

// export const TokenPrototypeGetBorderColorHandler = function (wrapped, ...args) {
//   //@ts-ignore
//   const token: Token = this as Token;
//   return TokenFactions.updateTokenDataFaction(token.document);
//   //return wrapped(args);
// };

//@ts-ignore
// Token.prototype.drawFactions = function () {
//   const token = this as Token;
//   TokenFactions.updateTokenDataFaction(token.document);
// };
