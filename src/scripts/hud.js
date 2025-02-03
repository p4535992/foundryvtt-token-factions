import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";

export const handleRenderHUD = (app, html, data) => {
  addBorderToggle(app, html, data);
};

function addBorderToggle(app, html, data) {
  if (!game.user?.isGM) {
    return;
  }

  if (!game.settings.get(CONSTANTS.MODULE_ID, "hudEnable")) {
    return;
  }

  if (!app?.object?.document) {
    return;
  }

  const factionDisableFlag = app.object.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE_BORDER);

  const borderButton = `
    <div class="control-icon factionBorder ${factionDisableFlag ? "active" : ""}"
      title="Toggle Faction Border"> <i class="fas fa-angry"></i>
    </div>`;

  const settingHudColClass = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HUD_COLUMN) ?? "right";
  const settingHudTopBottomClass =
    game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HUD_TOP_BOTTOM) ?? "bottom";

  const buttonPos = "." + settingHudColClass.toLowerCase();

  const col = html.find(buttonPos);
  if (settingHudTopBottomClass.toLowerCase() === "top") {
    col.prepend(borderButton);
  } else {
    col.append(borderButton);
  }

  html.find(".factionBorder").click(toggleBorder.bind(app));
}

async function toggleBorder(event) {
  const borderIsDisabled = this.object.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE_BORDER);

  for (const token of canvas.tokens?.controlled) {
    try {
      await token.document.setFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE_BORDER, !borderIsDisabled);
      token.refresh();
    } catch (e) {
      Logger.error(e);
    }
  }

  event.currentTarget.classList.toggle("active", !borderIsDisabled);
}
