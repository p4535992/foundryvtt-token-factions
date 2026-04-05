import CONSTANTS from "./constants";
import { ModuleSettings } from "./settings";

declare const game: Game; 

export function handelRenderSettingsConfig(app: SettingsConfig, el: JQuery, data: object): void {
  const neutralColor = ModuleSettings.getNeutralColor();
  const friendlyColor = ModuleSettings.getFriendlyColor();
  const hostileColor = ModuleSettings.getHostileColor();
  const controlledColor = ModuleSettings.getControlledColor();
  const partyColor = ModuleSettings.getPartyColor();
  const neutralColorEx = ModuleSettings.getNeutralColorEx();
  const friendlyColorEx = ModuleSettings.getFriendlyColorEx();
  const hostileColorEx = ModuleSettings.getHostileColorEx();
  const controlledColorEx = ModuleSettings.getControlledColorEx();
  const partyColorEx = ModuleSettings.getPartyColorEx();
  const actorFolderColorEx = ModuleSettings.getActorFolderColorEx();

  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.NEUTRAL_COLOR}"]`)
    .parent()
    .append(
      `<input type="color" value="${neutralColor}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.NEUTRAL_COLOR}">`,
    );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.FRIENDLY_COLOR}"]`)
    .parent()
    .append(
      `<input type="color" value="${friendlyColor}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.FRIENDLY_COLOR}">`,
    );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.HOSTILE_COLOR}"]`)
    .parent()
    .append(
      `<input type="color" value="${hostileColor}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.HOSTILE_COLOR}">`,
    );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.CONTROLLED_COLOR}"]`)
    .parent()
    .append(
      `<input type="color" value="${controlledColor}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.CONTROLLED_COLOR}">`,
    );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.PARTY_COLOR}"]`)
    .parent()
    .append(
      `<input type="color" value="${partyColor}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.PARTY_COLOR}">`,
    );

  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX}"]`)
    .parent()
    .append(
      `<input type="color" value="${neutralColorEx}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX}">`,
    );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX}"]`)
    .parent()
    .append(
      `<input type="color" value="${friendlyColorEx}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX}">`,
    );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.HOSTILE_COLOR_EX}"]`)
    .parent()
    .append(
      `<input type="color" value="${hostileColorEx}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.HOSTILE_COLOR_EX}">`,
    );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX}"]`)
    .parent()
    .append(
      `<input type="color" value="${controlledColorEx}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX}">`,
    );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.PARTY_COLOR_EX}"]`)
    .parent()
    .append(
      `<input type="color" value="${partyColorEx}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.PARTY_COLOR_EX}">`,
    );

  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX}"]`)
    .parent()
    .append(
      `<input type="color" value="${actorFolderColorEx}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX}">`,
    );
} 