/**
 * Utility functions for Token Factions module
 */
import { MODULE_ID, FLAGS } from "../constants";

declare const game: Game; 


// TypeScript declaration merging to add the methods to Token interface
declare global {
  interface Token {
    getFactionEnableBorder(): boolean | undefined;
    getFactionCustomBorder(): boolean | undefined;
    getFactionCustomColorInt(): string | undefined;
    getFactionCustomColorExt(): string | undefined;
    getFactionCustomFrameOpacity(): number | undefined;
    getFactionCustomBaseOpacity(): number | undefined;

    setFactionEnableBorder(value: boolean): Promise<TokenDocument>;
    setFactionCustomBorder(value: boolean): Promise<TokenDocument>;
    setFactionCustomColorInt(value: string): Promise<TokenDocument>;
    setFactionCustomColorExt(value: string): Promise<TokenDocument>;
    setFactionCustomFrameOpacity(value: number): Promise<TokenDocument>;
    setFactionCustomBaseOpacity(value: number): Promise<TokenDocument>;
  }
}

// Global Token prototype extensions - automatically available
function getFactionFlag<T = any>(token: Token, flagKey: string): T {
  return (token.document.getFlag as any)(MODULE_ID, flagKey);
}

function setFactionFlag<T = any>(token: Token, flagKey: string, value: T): Promise<TokenDocument> {
  return (token.document.setFlag as any)(MODULE_ID, flagKey, value);
}

export function initTokenFlags() {
  // Global Token prototype extensions - automatically available
  Token.prototype.getFactionEnableBorder = function (this: Token): boolean | undefined {
    return getFactionFlag(this, FLAGS.FACTION_ENABLE_BORDER);
  };

  Token.prototype.getFactionCustomBorder = function (this: Token): boolean | undefined {
    return getFactionFlag(this, FLAGS.FACTION_CUSTOM_BORDER);
  };

  Token.prototype.getFactionCustomColorInt = function (this: Token): string | undefined {
    return getFactionFlag(this, FLAGS.FACTION_CUSTOM_COLOR_INT);
  };

  Token.prototype.getFactionCustomColorExt = function (this: Token): string | undefined {
    return getFactionFlag(this, FLAGS.FACTION_CUSTOM_COLOR_EXT);
  };

  Token.prototype.getFactionCustomFrameOpacity = function (this: Token): number | undefined {
    return getFactionFlag(this, FLAGS.FACTION_CUSTOM_FRAME_OPACITY);
  };

  Token.prototype.getFactionCustomBaseOpacity = function (this: Token): number | undefined {
    return getFactionFlag(this, FLAGS.FACTION_CUSTOM_BASE_OPACITY);
  };

  // Setter methods
  Token.prototype.setFactionEnableBorder = function (this: Token, value: boolean): Promise<TokenDocument> {
    return setFactionFlag(this, FLAGS.FACTION_ENABLE_BORDER, value);
  };

  Token.prototype.setFactionCustomBorder = function (this: Token, value: boolean): Promise<TokenDocument> {
    return setFactionFlag(this, FLAGS.FACTION_CUSTOM_BORDER, value);
  };

  Token.prototype.setFactionCustomColorInt = function (this: Token, value: string): Promise<TokenDocument> {
    return setFactionFlag(this, FLAGS.FACTION_CUSTOM_COLOR_INT, value);
  };

  Token.prototype.setFactionCustomColorExt = function (this: Token, value: string): Promise<TokenDocument> {
    return setFactionFlag(this, FLAGS.FACTION_CUSTOM_COLOR_EXT, value);
  };

  Token.prototype.setFactionCustomFrameOpacity = function (this: Token, value: number): Promise<TokenDocument> {
    return setFactionFlag(this, FLAGS.FACTION_CUSTOM_FRAME_OPACITY, value);
  };

  Token.prototype.setFactionCustomBaseOpacity = function (this: Token, value: number): Promise<TokenDocument> {
    return setFactionFlag(this, FLAGS.FACTION_CUSTOM_BASE_OPACITY, value);
  };
}
