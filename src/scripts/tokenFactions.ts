import Logger from "./lib/Logger";
import { TokenFaction } from "./TokenFaction";
import { initTexture as initTextures } from "./render";
import { ModuleSettings } from "./settings";

declare const game: Game;

export class TokenFactions {
  static TOKEN_FACTIONS_FRAME_STYLE = {
    FLAT: "flat",
    BELEVELED: "beveled",
    BORDER: "border",
  };

  static dispositionKey = (token: Token): string | undefined => {
    const dispositionValue = parseInt(String(token.document.disposition), 10);

    let disposition: string | undefined;

    if (token.actor && token.actor.hasPlayerOwner && token.actor.type === "character") {
      disposition = "party-member";
    } else if (token.actor && token.actor.hasPlayerOwner) {
      disposition = "party-npc";
    } else if (dispositionValue === 1) {
      disposition = "friendly-npc";
    } else if (dispositionValue === 0) {
      disposition = "neutral-npc";
    } else if (dispositionValue === -1) {
      disposition = "hostile-npc";
    }
    return disposition;
  };

  static defaultColors: Record<string, string>;

  static async onInit(): Promise<void> {
    TokenFactions.defaultColors = {
      "party-member": ModuleSettings.getPartyColor(),
      "party-npc": ModuleSettings.getPartyColor(),
      "friendly-npc": ModuleSettings.getFriendlyColor(),
      "neutral-npc": ModuleSettings.getNeutralColor(),
      "hostile-npc": ModuleSettings.getHostileColor(),

      "controlled-npc": ModuleSettings.getControlledColor(),
      "neutral-external-npc": ModuleSettings.getNeutralColorEx(),
      "friendly-external-npc": ModuleSettings.getFriendlyColorEx(),
      "hostile-external-npc": ModuleSettings.getHostileColorEx(),
      "controlled-external-npc": ModuleSettings.getControlledColorEx(),
      "party-external-member": ModuleSettings.getPartyColorEx(),
      "party-external-npc": ModuleSettings.getPartyColorEx(),
    };

    await initTextures();
  }

  static setupTokens(canvas: Canvas): void {
    Logger.debug("Setup tokens");
    canvas.tokens?.placeables.forEach((token) => {
      TokenFactions.setupFactionForToken(token);
    });
  }

  static updateTokenFolder(tokenFolder: Folder): void {
    Logger.debug("Updating folder");
    const tokens = game.canvas?.tokens?.placeables;

    if (tokens) {
      for (const token of tokens) {
        if (token.actor?.folder?.id === tokenFolder.id) {
          (token as any).faction.updateToken();
        }
      }
    }
  }

  static async updateAllTokens(): Promise<void> {
    Logger.debug("Updating all tokens");
    game.canvas?.tokens?.placeables.forEach((token) => {
      (token as any)?.faction?.updateToken();
    });
  }

  static setupFactionForToken(token: Token): TokenFaction {
    Logger.debug("Setting up faction for token %s", token.name);
    const faction = new TokenFaction(token);
    return faction;
  }

  // START NEW MANAGE

  static _clamp(value: number, max: number, min: number): number {
    return Math.min(Math.max(value, min), max);
  }

  static _componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  static _rgbToHex(rgb: number[]): string {
    if (rgb[0] === undefined || rgb[1] === undefined || rgb[2] === undefined) {
      Logger.error("RGB color invalid");
      return "#000000";
    }

    return (
      "#" +
      TokenFactions._componentToHex(rgb[0]) +
      TokenFactions._componentToHex(rgb[1]) +
      TokenFactions._componentToHex(rgb[2])
    );
  }

  static _hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const regexp = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    const result = regexp.exec(hex);

    if (result == null || result[1] === undefined || result[2] === undefined || result[3] === undefined) {
      Logger.error("HEX color invalid");
      return null;
    }

    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  static _interpolateColor(color1: number[], color2: number[], factor: number): number[] {
    if (!(color1.length === 3 && color2.length === 3)) {
      Logger.error("Invalid color array");
      return [0, 0, 0];
    }

    if (arguments.length < 3) {
      factor = 0.5;
    }

    return color1.map((value, index) => {
      return Math.round(value + factor * (color2[index] - value));
    });
  }

  // My function to interpolate between two colors completely, returning an array
  static _interpolateColors(color1Str: string, color2Str: string, steps: number): number[][] {
    const stepFactor = 1 / (steps - 1);
    const interpolatedColorArray: number[][] = [];

    const color1 = color1Str.match(/\d+/g)?.map(Number);
    const color2 = color2Str.match(/\d+/g)?.map(Number);

    if (!color1 || !color2) {
      Logger.error("Invalid color string format for interpolation");
      return []; // Or throw an error
    }

    for (let i = 0; i < steps; i++) {
      interpolatedColorArray.push(TokenFactions._interpolateColor(color1, color2, stepFactor * i));
    }

    return interpolatedColorArray;
  }
}
