import CONSTANTS from "./constants";
import Logger from "./lib/Logger";
import { ModuleSettings } from "./settings";

export const handleRenderHUD = (app: TokenHUD, html: JQuery, data: object): void => {
  addBorderToggle(app, html, data);
};

function addBorderToggle(app: TokenHUD, html: JQuery, data: object): void {
  if (!game.user?.isGM) {
    return;
  }

  if (!ModuleSettings.getHudEnable()) {
    return;
  }

  if (!app?.object?.document) {
    return;
  }

  const factionEnableFlag = app.object.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_ENABLE_BORDER) ?? ModuleSettings.getEnableDefault();

  const borderButton = `
    <button type="button" class="control-icon factionBorder ${factionEnableFlag ? "active" : ""}"
      title="Toggle Faction Border"> 
        <i class="fas fa-angry"></i>
    </button>
    `;

  const settingHudColClass = (ModuleSettings.getHudColumn() as string) ?? "right";
  const settingHudTopBottomClass = (ModuleSettings.getHudTopBottom() as string) ?? "bottom";

  const buttonPos = "." + settingHudColClass.toLowerCase();

  const col = $(html).find(buttonPos);
  if (settingHudTopBottomClass.toLowerCase() === "top") {
    col.prepend(borderButton);
  } else {
    col.append(borderButton);
  }

  $(html).find(".factionBorder").on('click', toggleBorder.bind(app));
  $(html).find(".factionBorder").on('contextmenu', toggleCustomBorder.bind(app));
}

async function toggleBorder(this: TokenHUD, event: JQuery.ClickEvent): Promise<void> {
  const isBorderEnabled = this.object?.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_ENABLE_BORDER) ?? ModuleSettings.getEnableDefault();

  for (const token of canvas.tokens?.controlled ?? []) {
    try {
      await token.document.setFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_ENABLE_BORDER, !isBorderEnabled);
      token.refresh();
    } catch (e) {
      Logger.error(e as Error);
    }
  }

  if(event.currentTarget){
    event.currentTarget.classList.toggle("active", !isBorderEnabled);
  }
}

async function toggleCustomBorder(this: TokenHUD, event: JQuery.ContextMenuEvent): Promise<void> {
  const tokenTmp = this.object;
  if(!tokenTmp){
    return;
  }

  const currentCustomBorder = tokenTmp.getFactionCustomBorder() ?? false;

  const currentCustomColorTokenInt =
    (tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT) as string) || "#000000";

  const currentCustomColorTokenExt =
    (tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT) as string) || "#000000";

  const currentCustomColorTokenFrameOpacity =
    (tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY) as number) || 0.5;

  const currentCustomColorTokenBaseOpacity =
    (tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY) as number) || 0.5;

  // Prepare template data
  const templateData = {
    currentCustomBorder,
    currentCustomColorTokenInt,
    currentCustomColorTokenExt,
    currentCustomColorTokenFrameOpacity,
    currentCustomColorTokenBaseOpacity,
  };

  // Render the template
  const dialogContent = await renderTemplate(
    `modules/${CONSTANTS.MODULE_ID}/templates/custom-border-dialog.hbs`,
    templateData
  );

  const d = new Dialog({
    title: Logger.i18n("token-factions.label.chooseCustomColorToken"),
    content: dialogContent,
    buttons: {
      yes: {
        label: Logger.i18n("token-factions.label.applyCustomColor"),
        callback: async (html: JQuery<HTMLElement>) => {
          const newCurrentCustomBorder = (
            $(html).find(`input[data-edit='flags.token-factions.customBorder']`)[0] as HTMLInputElement
          )?.checked;
          const newCurrentCustomColorTokenInt = (
            $(html).find(`color-picker[name='flags.token-factions.customColorInt'] input[type='text']`)[0] as HTMLInputElement
          )?.value || currentCustomColorTokenInt;
          const newCurrentCustomColorTokenExt = (
            $(html).find(`color-picker[name='flags.token-factions.customColorExt'] input[type='text']`)[0] as HTMLInputElement
          )?.value || currentCustomColorTokenExt;
          const newCurrentCustomColorTokenFrameOpacity = parseFloat((
            $(html).find(`range-picker[name='flags.token-factions.customFrameOpacity'] input[type='number']`)[0] as HTMLInputElement
          )?.value) || currentCustomColorTokenFrameOpacity;
          const newCurrentCustomColorTokenBaseOpacity = parseFloat((
            $(html).find(`range-picker[name='flags.token-factions.customBaseOpacity'] input[type='number']`)[0] as HTMLInputElement
          )?.value) || currentCustomColorTokenBaseOpacity;

          for (const token of canvas.tokens?.controlled ?? []) {
            await token.setFactionCustomBorder(newCurrentCustomBorder);
            await token.setFactionCustomColorInt(newCurrentCustomColorTokenInt);
            await token.setFactionCustomColorExt(newCurrentCustomColorTokenExt);
            await token.setFactionCustomFrameOpacity(newCurrentCustomColorTokenFrameOpacity);
            await token.setFactionCustomBaseOpacity(newCurrentCustomColorTokenBaseOpacity);
            token.refresh();
          }
        },
      },
      no: {
        label: Logger.i18n("token-factions.label.doNothing"),
        callback: (html: JQuery<HTMLElement>) => {
          // Do nothing
        },
      },
    },
    default: "no",
  });
  d.render(true);
} 