import CONSTANTS, { MODULE_ID, SETTINGS } from "./constants";
import Logger from "./lib/Logger";

declare const game: Game;

export const registerSettings = function (): void {
  game.settings.registerMenu(MODULE_ID, SETTINGS.RESET, {
    name: `${MODULE_ID}.setting.reset.name`,
    hint: `${MODULE_ID}.setting.reset.hint`,
    label: `${MODULE_ID}.setting.reset.name`,
    icon: "fas fa-undo",
    type: ResetSettingsDialog as any,
    restricted: true,
  });

  // ==========================
  // TOKEN FACTIONS
  // ==========================

  game.settings.register(MODULE_ID, SETTINGS.ENABLE_DEFAULT, {
    name: `${MODULE_ID}.setting.${SETTINGS.ENABLE_DEFAULT}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.ENABLE_DEFAULT}.hint`,
    scope: "world",
    type: Boolean,
    default: CONSTANTS.DEFAULTS.ENABLE_DEFAULT,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.COLOR_FROM, {
    name: `${MODULE_ID}.setting.${SETTINGS.COLOR_FROM}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.COLOR_FROM}.hint`,
    scope: "world",
    config: true,
    default: CONSTANTS.DEFAULTS.COLOR_FROM,
    type: String,
    choices: {
      "token-disposition": `${MODULE_ID}.setting.color-from.opt.token-disposition`,
      "actor-folder-color": `${MODULE_ID}.setting.color-from.opt.actor-folder-color`,
    },
  });

  game.settings.register(MODULE_ID, SETTINGS.BASE_OPACITY, {
    name: `${MODULE_ID}.setting.${SETTINGS.BASE_OPACITY}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.BASE_OPACITY}.hint`,
    scope: "world",
    config: true,
    default: CONSTANTS.DEFAULTS.BASE_OPACITY,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
  });

  game.settings.register(MODULE_ID, SETTINGS.FILL_TEXTURE, {
    name: `${MODULE_ID}.setting.${SETTINGS.FILL_TEXTURE}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.FILL_TEXTURE}.hint`,
    scope: "world",
    type: Boolean,
    default: CONSTANTS.DEFAULTS.FILL_TEXTURE,
    config: true,
  });

  // ===============================
  // SUB FEATURE STANDARD
  // ===============================

  game.settings.register(MODULE_ID, SETTINGS.FRAME_STYLE, {
    name: `${MODULE_ID}.setting.${SETTINGS.FRAME_STYLE}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.FRAME_STYLE}.hint`,
    scope: "world",
    config: true,
    default: CONSTANTS.DEFAULTS.FRAME_STYLE,
    type: String,
    choices: {
      flat: `${MODULE_ID}.setting.frame-style.opt.flat`,
      beveled: `${MODULE_ID}.setting.frame-style.opt.beveled`,
    },
  });

  game.settings.register(MODULE_ID, SETTINGS.FRAME_OPACITY, {
    name: `${MODULE_ID}.setting.${SETTINGS.FRAME_OPACITY}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.FRAME_OPACITY}.hint`,
    scope: "world",
    config: true,
    default: CONSTANTS.DEFAULTS.FRAME_OPACITY,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
  });

  // ===============================
  // SUB FEATURE ALTERNATIVE BORDER
  // ===============================

  game.settings.register(MODULE_ID, SETTINGS.REMOVE_BORDERS, {
    name: `${MODULE_ID}.setting.${SETTINGS.REMOVE_BORDERS}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.REMOVE_BORDERS}.hint`,
    scope: "world",
    type: String,
    choices: { 0: "None", 1: "Non Owned", 2: "All" },
    default: CONSTANTS.DEFAULTS.REMOVE_BORDERS,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.PERMANENT_BORDER, {
    name: `${MODULE_ID}.setting.${SETTINGS.PERMANENT_BORDER}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.PERMANENT_BORDER}.hint`,
    default: CONSTANTS.DEFAULTS.PERMANENT_BORDER,
    type: Boolean,
    scope: "world",
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.BORDER_WIDTH, {
    name: `${MODULE_ID}.setting.${SETTINGS.BORDER_WIDTH}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.BORDER_WIDTH}.hint`,
    scope: "world",
    type: Number,
    default: CONSTANTS.DEFAULTS.BORDER_WIDTH,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.BORDER_GRID_SCALE, {
    name: `${MODULE_ID}.setting.${SETTINGS.BORDER_GRID_SCALE}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.BORDER_GRID_SCALE}.hint`,
    scope: "world",
    type: Boolean,
    default: CONSTANTS.DEFAULTS.BORDER_GRID_SCALE,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.BORDER_OFFSET, {
    name: `${MODULE_ID}.setting.${SETTINGS.BORDER_OFFSET}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.BORDER_OFFSET}.hint`,
    scope: "world",
    type: Number,
    default: CONSTANTS.DEFAULTS.BORDER_OFFSET,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.CIRCLE_BORDERS, {
    name: `${MODULE_ID}.setting.${SETTINGS.CIRCLE_BORDERS}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.CIRCLE_BORDERS}.hint`,
    scope: "world",
    type: Boolean,
    default: CONSTANTS.DEFAULTS.CIRCLE_BORDERS,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.SCALE_BORDER, {
    name: `${MODULE_ID}.setting.${SETTINGS.SCALE_BORDER}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.SCALE_BORDER}.hint`,
    scope: "world",
    type: Boolean,
    default: CONSTANTS.DEFAULTS.SCALE_BORDER,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.HUD_ENABLE, {
    name: `${MODULE_ID}.setting.${SETTINGS.HUD_ENABLE}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.HUD_ENABLE}.hint`,
    scope: "world",
    type: Boolean,
    default: CONSTANTS.DEFAULTS.HUD_ENABLE,
    config: true,
  });

  /** Which column should the button be placed on */
  game.settings.register(MODULE_ID, SETTINGS.HUD_COLUMN, {
    name: `${MODULE_ID}.setting.${SETTINGS.HUD_COLUMN}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.HUD_COLUMN}.hint`,
    scope: "world",
    config: true,
    type: String,
    default: CONSTANTS.DEFAULTS.HUD_COLUMN,
    choices: { Left: "Left", Right: "Right" },
  });

  /** Whether the button should be placed on the top or bottom of the column */
  game.settings.register(MODULE_ID, SETTINGS.HUD_TOP_BOTTOM, {
    name: `${MODULE_ID}.setting.${SETTINGS.HUD_TOP_BOTTOM}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.HUD_TOP_BOTTOM}.hint`,
    scope: "world",
    config: true,
    type: String,
    default: CONSTANTS.DEFAULTS.HUD_TOP_BOTTOM,
    choices: { Top: "Top", Bottom: "Bottom" },
  });

  game.settings.register(MODULE_ID, SETTINGS.CONTROLLED_COLOR, {
    name: `${MODULE_ID}.setting.${SETTINGS.CONTROLLED_COLOR}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.CONTROLLED_COLOR}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.CONTROLLED_COLOR,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.CONTROLLED_COLOR_EX, {
    name: `${MODULE_ID}.setting.${SETTINGS.CONTROLLED_COLOR_EX}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.CONTROLLED_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.CONTROLLED_COLOR_EX,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.HOSTILE_COLOR, {
    name: `${MODULE_ID}.setting.${SETTINGS.HOSTILE_COLOR}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.HOSTILE_COLOR}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.HOSTILE_COLOR,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.HOSTILE_COLOR_EX, {
    name: `${MODULE_ID}.setting.${SETTINGS.HOSTILE_COLOR_EX}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.HOSTILE_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.HOSTILE_COLOR_EX,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.FRIENDLY_COLOR, {
    name: `${MODULE_ID}.setting.${SETTINGS.FRIENDLY_COLOR}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.FRIENDLY_COLOR}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.FRIENDLY_COLOR,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.FRIENDLY_COLOR_EX, {
    name: `${MODULE_ID}.setting.${SETTINGS.FRIENDLY_COLOR_EX}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.FRIENDLY_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.FRIENDLY_COLOR_EX,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.NEUTRAL_COLOR, {
    name: `${MODULE_ID}.setting.${SETTINGS.NEUTRAL_COLOR}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.NEUTRAL_COLOR}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.NEUTRAL_COLOR,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.NEUTRAL_COLOR_EX, {
    name: `${MODULE_ID}.setting.${SETTINGS.NEUTRAL_COLOR_EX}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.NEUTRAL_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.NEUTRAL_COLOR_EX,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.PARTY_COLOR, {
    name: `${MODULE_ID}.setting.${SETTINGS.PARTY_COLOR}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.PARTY_COLOR}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.PARTY_COLOR,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.PARTY_COLOR_EX, {
    name: `${MODULE_ID}.setting.${SETTINGS.PARTY_COLOR_EX}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.PARTY_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.PARTY_COLOR_EX,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.ACTOR_FOLDER_COLOR_EX, {
    name: `${MODULE_ID}.setting.${SETTINGS.ACTOR_FOLDER_COLOR_EX}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.ACTOR_FOLDER_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.ACTOR_FOLDER_COLOR_EX,
    config: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.DEBUG, {
    name: `${MODULE_ID}.setting.${SETTINGS.DEBUG}.name`,
    hint: `${MODULE_ID}.setting.${SETTINGS.DEBUG}.hint`,
    scope: "client",
    config: true,
    default: CONSTANTS.DEFAULTS.DEBUG,
    type: Boolean,
  });
};

class ResetSettingsDialog extends FormApplication {
  constructor(...args: any[]) {
    super(...args);

    return new Dialog({
      title: game.i18n.localize(`${MODULE_ID}.dialogs.resetsettings.title`),
      content:
        '<p style="margin-bottom:1rem;">' + game.i18n.localize(`${MODULE_ID}.dialogs.resetsettings.content`) + "</p>",
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${MODULE_ID}.dialogs.resetsettings.confirm`),
          callback: async () => {
            const worldSettings = game.settings.storage
              ?.get("world")
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ?.filter((setting) => setting.key.startsWith(`${MODULE_ID}.`));
            for (const setting of worldSettings) {
              Logger.info(`Reset setting '${setting.key}'`);
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              await game.settings.set(
                MODULE_ID,
                setting.key,
                game.settings.settings.get(`${MODULE_ID}.${setting.key}`).default,
              );
              // OLD await setting.delete();
            }
            //window.location.reload();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize(`${MODULE_ID}.dialogs.resetsettings.cancel`),
        },
      },
      default: "cancel",
    }) as unknown as ResetSettingsDialog; // TODO remove this trick
  }

  async _updateObject(event?: Event, formData?: object): Promise<unknown> {
    // do nothing
    return undefined;
  }
}

/**
 * Static Settings manager for Token Factions module
 * Provides type-safe access to all module settings without caching
 */
export class ModuleSettings {
  /**
   * Get a setting value with type safety
   */
  private static get<T>(key: string): T {
    return game.settings.get(MODULE_ID, key) as T;
  }

  /**
   * Set a setting value
   */
  private static async set<T>(key: string, value: T): Promise<T> {
    return game.settings.set(MODULE_ID, key, value) as Promise<T>;
  }

  // Core Settings
  static getEnableDefault(): boolean {
    return this.get<boolean>(SETTINGS.ENABLE_DEFAULT);
  }

  static getColorFrom(): "token-disposition" | "actor-folder-color" {
    return this.get<"token-disposition" | "actor-folder-color">(SETTINGS.COLOR_FROM);
  }

  static getBaseOpacity(): number {
    return this.get<number>(SETTINGS.BASE_OPACITY);
  }

  static getFillTexture(): boolean {
    return this.get<boolean>(SETTINGS.FILL_TEXTURE);
  }

  // Frame Settings
  static getFrameStyle(): "flat" | "beveled" {
    return this.get<"flat" | "beveled">(SETTINGS.FRAME_STYLE);
  }

  static getFrameOpacity(): number {
    return this.get<number>(SETTINGS.FRAME_OPACITY);
  }

  // Border Settings
  static getRemoveBorders(): "0" | "1" | "2" {
    return this.get<"0" | "1" | "2">(SETTINGS.REMOVE_BORDERS);
  }

  static getPermanentBorder(): boolean {
    return this.get<boolean>(SETTINGS.PERMANENT_BORDER);
  }

  static getBorderWidth(): number {
    return this.get<number>(SETTINGS.BORDER_WIDTH);
  }

  static getBorderGridScale(): boolean {
    return this.get<boolean>(SETTINGS.BORDER_GRID_SCALE);
  }

  static getBorderOffset(): number {
    return this.get<number>(SETTINGS.BORDER_OFFSET);
  }

  static getCircleBorders(): boolean {
    return this.get<boolean>(SETTINGS.CIRCLE_BORDERS);
  }

  static getScaleBorder(): boolean {
    return this.get<boolean>(SETTINGS.SCALE_BORDER);
  }

  // HUD Settings
  static getHudEnable(): boolean {
    return this.get<boolean>(SETTINGS.HUD_ENABLE);
  }

  static getHudColumn(): "Left" | "Right" {
    return this.get<"Left" | "Right">(SETTINGS.HUD_COLUMN);
  }

  static getHudTopBottom(): "Top" | "Bottom" {
    return this.get<"Top" | "Bottom">(SETTINGS.HUD_TOP_BOTTOM);
  }

  // Color Settings
  static getControlledColor(): string {
    return this.get<string>(SETTINGS.CONTROLLED_COLOR);
  }

  static getControlledColorEx(): string {
    return this.get<string>(SETTINGS.CONTROLLED_COLOR_EX);
  }

  static getHostileColor(): string {
    return this.get<string>(SETTINGS.HOSTILE_COLOR);
  }

  static getHostileColorEx(): string {
    return this.get<string>(SETTINGS.HOSTILE_COLOR_EX);
  }

  static getFriendlyColor(): string {
    return this.get<string>(SETTINGS.FRIENDLY_COLOR);
  }

  static getFriendlyColorEx(): string {
    return this.get<string>(SETTINGS.FRIENDLY_COLOR_EX);
  }

  static getNeutralColor(): string {
    return this.get<string>(SETTINGS.NEUTRAL_COLOR);
  }

  static getNeutralColorEx(): string {
    return this.get<string>(SETTINGS.NEUTRAL_COLOR_EX);
  }

  static getPartyColor(): string {
    return this.get<string>(SETTINGS.PARTY_COLOR);
  }

  static getPartyColorEx(): string {
    return this.get<string>(SETTINGS.PARTY_COLOR_EX);
  }

  static getActorFolderColorEx(): string {
    return this.get<string>(SETTINGS.ACTOR_FOLDER_COLOR_EX);
  }

  // Debug Settings
  static getDebug(): boolean {
    return this.get<boolean>(SETTINGS.DEBUG);
  }

  /**
   * Reset all settings to their default values
   */
  static async resetToDefaults(): Promise<void> {
    Logger.info("Resetting all Token Factions settings to defaults");

    const promises = Object.entries(SETTINGS).map(async ([, settingKey]) => {
      const defaultValue = CONSTANTS.DEFAULTS[settingKey as keyof typeof CONSTANTS.DEFAULTS];
      if (defaultValue !== undefined) {
        try {
          await game.settings.set(MODULE_ID, settingKey, defaultValue);
        } catch (error) {
          Logger.error(`Failed to reset setting ${settingKey}:`, error);
        }
      }
    });

    await Promise.all(promises);
    Logger.info("Settings reset completed");
  }
}
