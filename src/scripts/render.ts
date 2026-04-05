import { TokenFactions } from "./tokenFactions";
import CONSTANTS, { MODULE_ID } from "./constants";
import Logger from "./lib/Logger";
import { FactionBorderGraphics } from "./models";
import "./lib/utils"; // Import to ensure extensions are applied
import { ModuleSettings } from "./settings";

declare const game: Game;

let bevelGradient: PIXI.Texture | null = null;
let bevelTexture: PIXI.Texture | null = null;

export async function initTexture() {
  bevelGradient = (await loadTexture(`modules/${CONSTANTS.MODULE_ID}/assets/bevel-gradient.jpg`)) as PIXI.Texture;
  bevelTexture = (await loadTexture(`modules/${CONSTANTS.MODULE_ID}/assets/bevel-texture.png`)) as PIXI.Texture;
}

export function drawBorderFaction(token: Token): void {
  if (!token) {
    Logger.debug("No token is found or passed");
    return;
  }

  if (!(token as any).faction) {
    Logger.debug(`Token faction is not initialized`);
    return;
  }

  if (token.x === 0 && token.y === 0 && token.document.x === 0 && token.document.y === 0) {
    Logger.debug(`Token position is invalid`);
    return;
  }

  dropTokenBoarder(token);

  if (shouldSkipDrawing(token)) {
    Logger.debug(`Skipping drawing border for token ${token.document.name}`);
    return;
  }

  const borderColor = colorBorderFaction(token);

  if (!borderColor) {
    Logger.debug(`No border color is found for token ${token.document.name}`);
    return;
  }

  if (!borderColor.INT || Number.isNaN(borderColor.INT.valueOf())) {
    Logger.debug(`No border color is found for token ${token.document.name}`);
    return;
  }

  const frameStyle = ModuleSettings.getFrameStyle();

  Logger.debug(`Drawing border for token %s. Style: %s, Color: %d`, token.document.name, frameStyle, borderColor.INT);

  // Reset container position
  (token as any).faction.container.position.set(0, 0);

  if (frameStyle === TokenFactions.TOKEN_FACTIONS_FRAME_STYLE.BELEVELED) {
    drawBeveledBorder(token, (token as any).faction.container, borderColor);
  } else {
    drawBorder(token, (token as any).faction.container, borderColor);
  }
}

export function dropTokenBoarder(token: Token): void {
  (token as any).faction.container.removeChildren().forEach((c: PIXI.DisplayObject) => c.destroy());
}

export function shouldSkipDrawing(token: Token): boolean {
  if (!token.visible) {
    return true;
  }

  const removeBorders = ModuleSettings.getRemoveBorders();

  if (removeBorders === "1" && !token.isOwner) {
    return true;
  } else if (removeBorders === "2") {
    return true;
  }

  return !(token.getFactionEnableBorder() ?? ModuleSettings.getEnableDefault());
}

export function drawBeveledBorder(token: Token, container: PIXI.Container, borderColor: FactionBorderGraphics): void {
  const { textureScaleX, textureScaleY } = getTextureScale(token);

  const borderOffset = ModuleSettings.getBorderOffset();
  const borderScale = getBorderScale();
  const frameOpacity = getFrameOpacity(token);
  const baseOpacity = getBaseOpacity(token);
  const fillTexture = ModuleSettings.getFillTexture();

  const tokenCenterX = token.w / 2;
  const tokenCenterY = token.h / 2;
  const tokenBorderRadiusX = (token.w * textureScaleX) / 2;
  const tokenBorderRadiusY = (token.h * textureScaleY) / 2;

  const borderWidth = getTokenBorderWidth(token);
  const scaledBorderWidth = borderWidth * borderScale;
  const scaledHalfBorderWidth = scaledBorderWidth / 2;

  const outerRing = _drawGradient(token, borderColor.INT, bevelGradient as PIXI.Texture);
  const innerRing = _drawGradient(token, borderColor.INT, bevelGradient as PIXI.Texture);
  const ringTexture = _drawTexture(token, borderColor.INT, bevelTexture as PIXI.Texture);

  const outerRingMask = new PIXI.Graphics();
  const innerRingMask = new PIXI.Graphics();
  const ringTextureMask = new PIXI.Graphics();

  outerRing.alpha = frameOpacity;
  innerRing.alpha = frameOpacity;
  ringTexture.alpha = frameOpacity;

  const factionBorder = new PIXI.Graphics();
  container.addChild(factionBorder);

  if (fillTexture) {
    factionBorder
      .beginFill(borderColor.INT, baseOpacity)
      .drawEllipse(
        tokenCenterX,
        tokenCenterY,
        tokenBorderRadiusX - scaledBorderWidth - borderOffset - scaledHalfBorderWidth,
        tokenBorderRadiusY - scaledBorderWidth - borderOffset - scaledHalfBorderWidth,
      )
      .beginTextureFill({
        texture: PIXI.Texture.EMPTY,
        color: borderColor.INT,
        alpha: baseOpacity,
      })
      .endFill();
  }

  // Render inner shadow
  factionBorder
    .lineStyle(1.5 * scaledBorderWidth, borderColor.EX, frameOpacity * 0.6)
    .drawEllipse(
      tokenCenterX,
      tokenCenterY,
      tokenBorderRadiusX - scaledBorderWidth - borderOffset - scaledHalfBorderWidth / 2,
      tokenBorderRadiusY - scaledBorderWidth - borderOffset - scaledHalfBorderWidth / 2,
    );

  outerRingMask
    .lineStyle(scaledHalfBorderWidth, borderColor.EX, 1.0)
    .beginFill(0xffffff, 0.0)
    .drawEllipse(
      tokenCenterX,
      tokenCenterY,
      tokenBorderRadiusX - scaledBorderWidth - borderOffset,
      tokenBorderRadiusY - scaledBorderWidth - borderOffset,
    )
    .endFill();

  innerRing.anchor.set(1);
  innerRing.rotation = Math.PI;

  innerRingMask
    .lineStyle(scaledHalfBorderWidth, borderColor.EX, 1.0)
    .beginFill(0xffffff, 0.0)
    .drawEllipse(
      tokenCenterX,
      tokenCenterY,
      tokenBorderRadiusX - scaledBorderWidth - borderOffset - scaledHalfBorderWidth,
      tokenBorderRadiusY - scaledBorderWidth - borderOffset - scaledHalfBorderWidth,
    )
    .endFill();

  ringTextureMask
    .lineStyle(scaledBorderWidth, borderColor.EX, 1.0)
    .beginFill(0xffffff, 0.0)
    .drawEllipse(
      tokenCenterX,
      tokenCenterY,
      tokenBorderRadiusX - scaledBorderWidth - borderOffset - scaledHalfBorderWidth / 2,
      tokenBorderRadiusY - scaledBorderWidth - borderOffset - scaledHalfBorderWidth / 2,
    )
    .endFill();

  container.addChild(outerRing);
  container.addChild(outerRingMask);
  outerRing.mask = outerRingMask;

  container.addChild(innerRing);
  container.addChild(innerRingMask);
  innerRing.mask = innerRingMask;

  container.addChild(ringTexture);
  container.addChild(ringTextureMask);
  ringTexture.mask = ringTextureMask;
}

export function drawBorder(token: Token, container: PIXI.Container, borderColor: FactionBorderGraphics): void {
  const graphics = new PIXI.Graphics();
  container.addChild(graphics);

  const tokenBorderWidth = getTokenBorderWidth(token);
  const isFilled = ModuleSettings.getFillTexture();
  const borderOffset = ModuleSettings.getBorderOffset();
  const borderScale = getBorderScale();
  const frameOpacity = getFrameOpacity(token);
  const baseOpacity = getBaseOpacity(token);

  graphics.alpha = frameOpacity;

  if (ModuleSettings.getCircleBorders()) {
    drawCircleBorder(token, borderColor, graphics, isFilled, tokenBorderWidth, borderOffset, borderScale, baseOpacity);
  } else if (isHexGrid()) {
    drawHexBorder(token, borderColor, graphics, isFilled, tokenBorderWidth, borderOffset, borderScale, baseOpacity);
  } else {
    drawSquareBorder(token, borderColor, graphics, isFilled, tokenBorderWidth, borderOffset, borderScale, baseOpacity);
  }
}

/**
 * Get the border width for a token.
 *
 * @param {Token} token - The token object.
 * @returns {number} - The border width for the token.
 */
export function getTokenBorderWidth(token: Token): number {
  let tokenBorderWidth = ModuleSettings.getBorderWidth() || CONFIG.Canvas.objectBorderThickness;

  if (ModuleSettings.getPermanentBorder() && token.controlled) {
    tokenBorderWidth *= 2;
  }

  return tokenBorderWidth;
}

/**
 * Get the scale factor for the border based on the grid scale.
 *
 * @returns {number} - The scale factor for the border.
 */
export function getBorderScale(): number {
  const borderGridScale = ModuleSettings.getBorderGridScale();
  return borderGridScale ? (canvas.dimensions?.size || 100) / 100 : 1;
}

/**
 * Get the frame opacity for a given token.
 *
 * @param {Token} token - The token object.
 * @returns {number} The frame opacity value.
 */
export function getFrameOpacity(token: Token): number {
  let frameOpacity = ModuleSettings.getFrameOpacity() || 0.5;
  const isBorderCustom = token.getFactionCustomBorder() || false;

  if (isBorderCustom) {
    return token.getFactionCustomFrameOpacity() ?? frameOpacity;
  } else {
    return frameOpacity;
  }
}

/**
 * Get the base opacity for a given token.
 *
 * @param {Token} token - The token object.
 * @returns {number} The base opacity value.
 */
export function getBaseOpacity(token: Token): number {
  let baseOpacity = ModuleSettings.getBaseOpacity() || 0.5;
  const isBorderCustom = token.getFactionCustomBorder() || false;

  if (isBorderCustom) {
    return token.getFactionCustomBaseOpacity() ?? baseOpacity;
  } else {
    return baseOpacity;
  }
}

export function isHexGrid(): boolean {
  const gridTypes = CONST.GRID_TYPES;
  const hexTypes = [gridTypes.HEXEVENQ, gridTypes.HEXEVENR, gridTypes.HEXODDQ, gridTypes.HEXODDR];
  return canvas.grid?.isHexagonal || hexTypes.includes(canvas.grid?.type ?? -1);
}

export function drawCircleBorder(
  token: Token,
  borderColor: FactionBorderGraphics,
  graphics: PIXI.Graphics,
  isFilled: boolean,
  borderWidth: number,
  borderOffset: number,
  borderScale: number,
  baseOpacity: number,
): void {
  const { textureScaleX, textureScaleY } = getTextureScale(token);
  const scaledBorderWidth = borderWidth * borderScale;
  const scaledBorderHalfWidth = borderWidth * borderScale; // TODO this seems wrong maybe scaledBorderWidth / 2 ?

  const tokenCenterX = token.w / 2;
  const tokenCenterY = token.h / 2;

  const tokenBorderRadiusX = (token.w * textureScaleX) / 2;
  const tokenBorderRadiusY = (token.h * textureScaleY) / 2;

  if (isFilled) {
    graphics
      .beginFill(borderColor.EX, baseOpacity)
      .lineStyle(scaledBorderWidth, borderColor.EX, 0.8)
      .drawEllipse(
        tokenCenterX,
        tokenCenterY,
        tokenBorderRadiusX - scaledBorderWidth - borderOffset,
        tokenBorderRadiusY - scaledBorderWidth - borderOffset,
      )
      .beginTextureFill({
        texture: PIXI.Texture.EMPTY,
        color: borderColor.EX,
        alpha: baseOpacity,
      })
      .endFill();

    graphics
      .beginFill(borderColor.INT, baseOpacity)
      .lineStyle(scaledBorderHalfWidth, borderColor.INT, 1.0)
      .drawEllipse(
        tokenCenterX,
        tokenCenterY,
        tokenBorderRadiusX - scaledBorderHalfWidth - scaledBorderWidth / 2 - borderOffset,
        tokenBorderRadiusY - scaledBorderHalfWidth - scaledBorderWidth / 2 - borderOffset,
      )
      .beginTextureFill({
        texture: PIXI.Texture.EMPTY,
        color: borderColor.INT,
        alpha: baseOpacity,
      })
      .endFill();
  }

  graphics
    .lineStyle(scaledBorderWidth, borderColor.EX, 0.8)
    .drawEllipse(
      tokenCenterX,
      tokenCenterY,
      tokenBorderRadiusX - scaledBorderWidth - borderOffset,
      tokenBorderRadiusY - scaledBorderWidth - borderOffset,
    );

  graphics
    .lineStyle(scaledBorderHalfWidth, borderColor.INT, 1.0)
    .drawEllipse(
      tokenCenterX,
      tokenCenterY,
      tokenBorderRadiusX - scaledBorderHalfWidth - scaledBorderWidth / 2 - borderOffset,
      tokenBorderRadiusY - scaledBorderHalfWidth - scaledBorderWidth / 2 - borderOffset,
    );
}

export function drawHexBorder(
  token: Token,
  borderColor: FactionBorderGraphics,
  graphics: PIXI.Graphics,
  fillTexture: boolean,
  tokenBorderWidth: number,
  borderOffset: number, // Unused parameter
  borderScale: number,
  baseOpacity: number,
): void {
  const { textureScaleX, textureScaleY } = getTextureScale(token);
  const { offsetX, offsetY } = getScaledOffsets(token, textureScaleX, textureScaleY);

  // const halfBorderWidth = Math.round(tokenBorderWidth / 2); // Unused
  // const quarterBorderWidth = Math.round(halfBorderWidth / 2); // Unused
  let polygon = token.shape as PIXI.Polygon;
  if (!polygon) {
    // TODO: check this
    Logger.warn(`Token shape is not defined for token ${token.document.name}`);
    return;
  }

  polygon.points = polygon.points.map((coord, index) =>
    index % 2 === 0 ? coord * textureScaleX + offsetX : coord * textureScaleY + offsetY,
  );

  if (fillTexture) {
    graphics
      .beginFill(borderColor.EX, baseOpacity)
      .lineStyle(tokenBorderWidth * borderScale, borderColor.EX, 0.8)
      .drawPolygon(polygon)
      .beginTextureFill({
        texture: PIXI.Texture.EMPTY,
        color: borderColor.EX,
        alpha: baseOpacity,
      })
      .endFill();

    graphics
      .beginFill(borderColor.INT, baseOpacity)
      .lineStyle((tokenBorderWidth * borderScale) / 2, borderColor.INT, 1.0)
      .drawPolygon(polygon)
      .beginTextureFill({
        texture: PIXI.Texture.EMPTY,
        color: borderColor.INT,
        alpha: baseOpacity,
      })
      .endFill();
  }

  graphics.lineStyle(tokenBorderWidth * borderScale, borderColor.EX, 0.8).drawPolygon(polygon);

  graphics.lineStyle((tokenBorderWidth * borderScale) / 2, borderColor.INT, 1.0).drawPolygon(polygon);
}

export function drawSquareBorder(
  token: Token,
  borderColor: FactionBorderGraphics,
  graphics: PIXI.Graphics,
  fillTexture: boolean,
  tokenBorderWidth: number,
  borderOffset: number,
  borderScale: number,
  baseOpacity: number,
): void {
  const { textureScaleX, textureScaleY } = getTextureScale(token);
  const { offsetX, offsetY } = getScaledOffsets(token, textureScaleX, textureScaleY);

  const tokenWidth = token.w * textureScaleX;
  const tokenHeight = token.h * textureScaleY;

  const halfBorderOffset = Math.round(borderOffset / 2);
  const halfBorderWidth = Math.round(tokenBorderWidth / 2);
  const quarterBorderWidth = Math.round(halfBorderWidth / 2);

  if (fillTexture) {
    graphics
      .beginFill(borderColor.EX, baseOpacity)
      .lineStyle(tokenBorderWidth * borderScale, borderColor.EX, 0.8)
      .drawRoundedRect(
        offsetX - quarterBorderWidth - halfBorderOffset,
        offsetY - quarterBorderWidth - halfBorderOffset,
        tokenWidth + halfBorderWidth - borderOffset,
        tokenHeight + halfBorderWidth - borderOffset,
        3,
      )
      .beginTextureFill({
        texture: PIXI.Texture.EMPTY,
        color: borderColor.EX,
        alpha: baseOpacity,
      })
      .endFill();

    graphics
      .beginFill(borderColor.INT, baseOpacity)
      .lineStyle(halfBorderWidth * borderScale, borderColor.INT, 1.0)
      .drawRoundedRect(
        offsetX - quarterBorderWidth - halfBorderOffset,
        offsetY - quarterBorderWidth - halfBorderOffset,
        tokenWidth + halfBorderWidth - borderOffset,
        tokenHeight + halfBorderWidth - borderOffset,
        3,
      )
      .beginTextureFill({
        texture: PIXI.Texture.EMPTY,
        color: borderColor.INT,
        alpha: baseOpacity,
      })
      .endFill();
  }

  graphics
    .lineStyle(tokenBorderWidth * borderScale, borderColor.EX, 0.8)
    .drawRoundedRect(
      offsetX - quarterBorderWidth - halfBorderOffset,
      offsetY - quarterBorderWidth - halfBorderOffset,
      tokenWidth + halfBorderWidth - borderOffset,
      tokenHeight + halfBorderWidth - borderOffset,
      3,
    );

  graphics
    .lineStyle(halfBorderWidth * borderScale, borderColor.INT, 1.0)
    .drawRoundedRect(
      offsetX - quarterBorderWidth - halfBorderOffset,
      offsetY - quarterBorderWidth - halfBorderOffset,
      tokenWidth + halfBorderWidth - borderOffset,
      tokenHeight + halfBorderWidth - borderOffset,
      3,
    );
}

export function _drawGradient(token: Token, color: Color, bevelGradientTexture: PIXI.Texture): PIXI.Sprite {
  const bg = new PIXI.Sprite(bevelGradientTexture);

  bg.anchor.set(0.0, 0.0);
  bg.width = token.w;
  bg.height = token.h;
  bg.tint = color;
  // bg.x = token.x;
  // bg.y = token.y;

  return bg;
}

export function _drawTexture(token: Token, color: Color, bevelTextureTexture: PIXI.Texture): PIXI.Sprite {
  const bg = new PIXI.Sprite(bevelTextureTexture);

  bg.anchor.set(0.0, 0.0);
  bg.width = token.w;
  bg.height = token.h;
  bg.tint = color;
  // bg.x = token.x;
  // bg.y = token.y;

  return bg;
}

export function colorBorderFaction(token: Token): FactionBorderGraphics | undefined {
  const colorFrom = ModuleSettings.getColorFrom();

  let color: string | undefined | null = null;

  if (colorFrom === "token-disposition") {
    const disposition = TokenFactions.dispositionKey(token);

    if (disposition) {
      color = TokenFactions.defaultColors[disposition];
    }
  } else if (colorFrom === "actor-folder-color") {
    if (token.actor && token.actor.folder) {
      color = String(token.actor.folder.color);
    }
  } else {
    // colorFrom === 'custom-disposition'
    // TODO PUT SOME NEW FLAG ON THE TOKEN
    const disposition = TokenFactions.dispositionKey(token);
    if (disposition) {
      color = (game.settings.get as any)(MODULE_ID, `custom-${disposition}-color`) as string | undefined;
    }
  }

  const overrides = {
    CONTROLLED: {
      INT: Color.fromString(ModuleSettings.getControlledColor()),
      EX: Color.fromString(ModuleSettings.getControlledColorEx()),
      INT_S: String(ModuleSettings.getControlledColor()),
      EX_S: String(ModuleSettings.getControlledColorEx()),
    },
    FRIENDLY: {
      INT: Color.fromString(ModuleSettings.getFriendlyColor()),
      EX: Color.fromString(ModuleSettings.getFriendlyColorEx()),
      INT_S: String(ModuleSettings.getFriendlyColor()),
      EX_S: String(ModuleSettings.getFriendlyColorEx()),
    },
    NEUTRAL: {
      INT: Color.fromString(ModuleSettings.getNeutralColor()),
      EX: Color.fromString(ModuleSettings.getNeutralColorEx()),
      INT_S: String(ModuleSettings.getNeutralColor()),
      EX_S: String(ModuleSettings.getNeutralColorEx()),
    },
    HOSTILE: {
      INT: Color.fromString(ModuleSettings.getHostileColor()),
      EX: Color.fromString(ModuleSettings.getHostileColorEx()),
      INT_S: String(ModuleSettings.getHostileColor()),
      EX_S: String(ModuleSettings.getHostileColorEx()),
    },
    PARTY: {
      INT: Color.fromString(ModuleSettings.getPartyColor()),
      EX: Color.fromString(ModuleSettings.getPartyColorEx()),
      INT_S: String(ModuleSettings.getPartyColor()),
      EX_S: String(ModuleSettings.getPartyColorEx()),
    },
    ACTOR_FOLDER_COLOR: {
      INT: Color.fromString(color ? String(color) : CONSTANTS.DEFAULTS.ACTOR_FOLDER_COLOR_EX),
      EX: Color.fromString(ModuleSettings.getActorFolderColorEx()),
      INT_S: color ? String(color) : CONSTANTS.DEFAULTS.ACTOR_FOLDER_COLOR_EX,
      EX_S: String(ModuleSettings.getActorFolderColorEx()),
    },
  };

  const isBorderCustom = token.getFactionCustomBorder() || false;

  if (isBorderCustom) {
    const customColorInt = token.getFactionCustomColorInt();
    const customColorExt = token.getFactionCustomColorExt();

    return {
      INT: Color.fromString(String(customColorInt)),
      EX: Color.fromString(String(customColorExt)),
    };
  } else if (colorFrom === "token-disposition") {
    const disPath = CONST.TOKEN_DISPOSITIONS;
    const disposition = token.document.disposition;
    let borderColor = new FactionBorderGraphics();

    if (!game.user?.isGM && token.isOwner) {
      borderColor = overrides.CONTROLLED;
    } else if (token.actor?.hasPlayerOwner) {
      borderColor = overrides.PARTY;
    } else if (disposition === disPath.FRIENDLY) {
      borderColor = overrides.FRIENDLY;
    } else if (disposition === disPath.NEUTRAL) {
      borderColor = overrides.NEUTRAL;
    } else {
      // HOSTILE or others
      borderColor = overrides.HOSTILE;
    }

    return borderColor;
  } else if (colorFrom === "actor-folder-color") {
    return overrides.ACTOR_FOLDER_COLOR;
  } else {
    Logger.debug(`No color found for token ${token.document.name}`);
    return overrides.ACTOR_FOLDER_COLOR; // Fallback
  }
}

function getTextureScale(token: Token): { textureScaleX: number; textureScaleY: number } {
  return ModuleSettings.getScaleBorder()
    ? {
        textureScaleX: token.document.texture.scaleX ?? 1,
        textureScaleY: token.document.texture.scaleY ?? 1,
      }
    : { textureScaleX: 1, textureScaleY: 1 };
}

function getScaledOffsets(
  token: Token,
  textureScaleX: number,
  textureScaleY: number,
): { offsetX: number; offsetY: number } {
  return ModuleSettings.getScaleBorder()
    ? {
        offsetX: (token.w * (1 - textureScaleX)) / 2,
        offsetY: (token.h * (1 - textureScaleY)) / 2,
      }
    : { offsetX: 0, offsetY: 0 };
}
