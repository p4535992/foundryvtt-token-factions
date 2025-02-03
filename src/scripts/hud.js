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
  html.find(".factionBorder").contextmenu(toggleCustomBorder.bind(app));
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

async function toggleCustomBorder(event) {
  const tokenTmp = this.object;

  const currentCustomColorTokenInt =
    tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT) || "#000000";

  const currentCustomColorTokenExt =
    tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT) || "#000000";

  const currentCustomColorTokenFrameOpacity =
    tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY) || 0.5;

  const currentCustomColorTokenBaseOpacity =
    tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY) || 0.5;

  // const currentCustomBorder =
  //   isRealBoolean(tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_BORDER))
  //   ? Boolean(tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_BORDER))
  //   : false;
  // <div class="form-group">
  //   <label>${Logger.i18n("token-factions.tokeconfig.customBorder")}</label>
  //   <input type="checkbox"
  //       value="${currentCustomBorder}"
  //       ${currentCustomBorder ? "checked" : ""}
  //       data-edit="token-factions.currentCustomBorder"></input>
  // </div>

  const dialogContent = `
    <div class="form-group">
      <label>${Logger.i18n("token-factions.tokeconfig.customColorInt")}</label>
      <input type="color"
        value="${currentCustomColorTokenInt}"
        data-edit="token-factions.currentCustomColorTokenInt"></input>
    </div>
    <div class="form-group">
      <label>${Logger.i18n("token-factions.tokeconfig.customColorExt")}</label>
      <input type="color"
        value="${currentCustomColorTokenExt}"
        data-edit="token-factions.currentCustomColorTokenExt"></input>
    </div>
    <div class="form-group">
      <label>${Logger.i18n("token-factions.tokeconfig.customFrameOpacity")}</label>
      <input type="number"
        min="0" max="1" step="0.1"
        value="${currentCustomColorTokenFrameOpacity}"
        data-edit="token-factions.currentCustomColorTokenFrameOpacity"></input>
    </div>
    <div class="form-group">
      <label>${Logger.i18n("token-factions.tokeconfig.customBaseOpacity")}</label>
      <input type="number"
        min="0" max="1" step="0.1"
        value="${currentCustomColorTokenBaseOpacity}"
        data-edit="token-factions.currentCustomColorTokenBaseOpacity"></input>
    </div>
    `;

  const d = new Dialog({
    title: Logger.i18n("token-factions.label.chooseCustomColorToken"),
    content: dialogContent,
    buttons: {
      yes: {
        label: Logger.i18n("token-factions.label.applyCustomColor"),

        callback: async (html) => {
          // const newCurrentCustomBorder = $(
          //   html.find(`input[data-edit='token-factions.currentCustomBorder']`)[0]
          // ).val();
          const newCurrentCustomColorTokenInt = $(
            html.find(`input[data-edit='token-factions.currentCustomColorTokenInt']`)[0],
          ).val();
          const newCurrentCustomColorTokenExt = $(
            html.find(`input[data-edit='token-factions.currentCustomColorTokenExt']`)[0],
          ).val();
          const newCurrentCustomColorTokenFrameOpacity = $(
            html.find(`input[data-edit='token-factions.currentCustomColorTokenFrameOpacity']`)[0],
          ).val();
          const newCurrentCustomColorTokenBaseOpacity = $(
            html.find(`input[data-edit='token-factions.currentCustomColorTokenBaseOpacity']`)[0],
          ).val();
          for (const token of canvas.tokens?.controlled) {
            // token.document.setFlag(
            //   CONSTANTS.MODULE_ID,
            //   CONSTANTS.FLAGS.FACTION_CUSTOM_BORDER,
            //   newCurrentCustomBorder
            // );
            token.document.setFlag(
              CONSTANTS.MODULE_ID,
              CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT,
              newCurrentCustomColorTokenInt,
            );
            token.document.setFlag(
              CONSTANTS.MODULE_ID,
              CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT,
              newCurrentCustomColorTokenExt,
            );
            token.document.setFlag(
              CONSTANTS.MODULE_ID,
              CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY,
              newCurrentCustomColorTokenFrameOpacity,
            );
            token.document.setFlag(
              CONSTANTS.MODULE_ID,
              CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY,
              newCurrentCustomColorTokenBaseOpacity,
            );
          }
        },
      },
      no: {
        label: Logger.i18n("token-factions.label.doNothing"),
        callback: (html) => {
          // Do nothing
        },
      },
    },
    default: "no",
  });
  d.render(true);
}
