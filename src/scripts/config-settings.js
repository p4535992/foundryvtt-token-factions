import CONSTANTS from "./constants.js";

export function handelRenderSettingsConfig(app, el, data) {
  const neutralColor = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR);
  const friendlyColor = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR);
  const hostileColor = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR);
  const controlledColor = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR);
  const partyColor = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR);
  const neutralColorEx = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX);
  const friendlyColorEx = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX);
  const hostileColorEx = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR_EX);
  const controlledColorEx = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX);
  const partyColorEx = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR_EX);
  const actorFolderColorEx = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX);

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
