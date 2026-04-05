/**
 * Token Factions Module Constants
 * Global constant object containing all module configuration values
 */

// Module identification
export const MODULE_ID = "token-factions" as const;
export const PATH = `modules/${MODULE_ID}/` as const;

// Flag keys for token documents
export const FLAGS = {
  FACTION_DRAW_FRAME: "factionDrawFrame",
  FACTION_ENABLE_BORDER: "enableBorder",
  FACTION_CUSTOM_BORDER: "customBorder",
  FACTION_CUSTOM_COLOR_INT: "customColorInt",
  FACTION_CUSTOM_COLOR_EXT: "customColorExt",
  FACTION_CUSTOM_FRAME_OPACITY: "customFrameOpacity",
  FACTION_CUSTOM_BASE_OPACITY: "customBaseOpacity",
} as const;

// Default values
export const DEFAULTS = {
  ENABLE_DEFAULT: true,
  CONTROLLED_COLOR: "#FF9829",
  CONTROLLED_COLOR_EX: "#000000",
  HOSTILE_COLOR: "#E72124",
  HOSTILE_COLOR_EX: "#000000",
  FRIENDLY_COLOR: "#43DFDF",
  FRIENDLY_COLOR_EX: "#000000",
  NEUTRAL_COLOR: "#F1D836",
  NEUTRAL_COLOR_EX: "#000000",
  PARTY_COLOR: "#33BC4E",
  PARTY_COLOR_EX: "#000000",
  ACTOR_FOLDER_COLOR_EX: "#000000",
  COLOR_FROM: "token-disposition",
  BASE_OPACITY: 0.5,
  FILL_TEXTURE: true,
  FRAME_STYLE: "flat",
  FRAME_OPACITY: 1,
  REMOVE_BORDERS: "0",
  PERMANENT_BORDER: false,
  BORDER_WIDTH: 4,
  BORDER_GRID_SCALE: false,
  BORDER_OFFSET: 0,
  CIRCLE_BORDERS: false,
  SCALE_BORDER: false,
  HUD_ENABLE: true,
  HUD_COLUMN: "Right",
  HUD_TOP_BOTTOM: "Bottom",
  DEBUG: false,
} as const;

// Setting keys
export const SETTINGS = {
  RESET: "reset",
  COLOR_FROM: "color-from",
  BASE_OPACITY: "base-opacity",
  ENABLE_DEFAULT: "enable-default",
  FILL_TEXTURE: "fillTexture",
  FRAME_STYLE: "frame-style",
  FRAME_OPACITY: "frame-opacity",
  REMOVE_BORDERS: "removeBorders",
  PERMANENT_BORDER: "permanentBorder",
  BORDER_WIDTH: "borderWidth",
  BORDER_GRID_SCALE: "borderGridScale",
  BORDER_OFFSET: "borderOffset",
  CIRCLE_BORDERS: "circleBorders",
  SCALE_BORDER: "scaleBorder",
  HUD_ENABLE: "hudEnable",
  HUD_COLUMN: "hudColumn",
  HUD_TOP_BOTTOM: "hudTopBottom",
  CONTROLLED_COLOR: "controlledColor",
  CONTROLLED_COLOR_EX: "controlledColorEx",
  HOSTILE_COLOR: "hostileColor",
  HOSTILE_COLOR_EX: "hostileColorEx",
  FRIENDLY_COLOR: "friendlyColor",
  FRIENDLY_COLOR_EX: "friendlyColorEx",
  NEUTRAL_COLOR: "neutralColor",
  NEUTRAL_COLOR_EX: "neutralColorEx",
  PARTY_COLOR: "partyColor",
  PARTY_COLOR_EX: "partyColorEx",
  ACTOR_FOLDER_COLOR_EX: "actorFolderColorEx",
  DEBUG: "debug",
} as const;

// Combined constants object for backward compatibility
const CONSTANTS = {
  MODULE_ID,
  PATH,
  FLAGS,
  DEFAULTS,
  SETTINGS,
} as const;

export default CONSTANTS;

// Type definitions for better TypeScript support
export type ModuleId = typeof MODULE_ID;
export type FlagKeys = keyof typeof FLAGS;
export type SettingKeys = keyof typeof SETTINGS;
export type DefaultKeys = keyof typeof DEFAULTS; 