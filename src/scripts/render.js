import { TokenFactions } from "./tokenFactions.js";
import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";
import { FactionBorderGraphics } from "./models.js";

let bevelGradient;
let bevelTexture;

export async function initTexture() {
  bevelGradient = await loadTexture(`modules/${CONSTANTS.MODULE_ID}/assets/bevel-gradient.jpg`);
  bevelTexture = await loadTexture(`modules/${CONSTANTS.MODULE_ID}/assets/bevel-texture.png`);
}

export function drawBorderFaction(token) {
  if (!token) {
    Logger.debug("No token is found or passed");
    return;
  }

  if (!token.faction) {
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

  if (!borderColor.INT || Number.isNaN(borderColor.INT)) {
    Logger.debug(`No border color is found for token ${token.document.name}`);
    return;
  }

  const frameStyle = String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRAME_STYLE));

  Logger.debug(`Drawing border for token %s. Style: %s, Color: %d`, token.document.name, frameStyle, borderColor.INT);

  // Reset container position
  token.faction.container.position.set(0, 0);

  if (frameStyle === TokenFactions.TOKEN_FACTIONS_FRAME_STYLE.BELEVELED) {
    drawBeveledBorder(token, token.faction.container, borderColor);
  } else {
    drawBorder(token, token.faction.container, borderColor);
  }
}

export function dropTokenBoarder(token) {
  token.faction.container.removeChildren().forEach((c) => c.destroy());
}

export function shouldSkipDrawing(token) {
  if (!token.visible) {
    return true;
  }

  const removeBorders = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.REMOVE_BORDERS);

  if (removeBorders === "1" && !token.isOwner) {
    return true;
  } else if (removeBorders === "2") {
    return true;
  }

  return token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE_BORDER) ?? false;
}

export function drawBeveledBorder(token, container, borderColor) {
  const { textureScaleX, textureScaleY } = getTextureScale(token);

  const borderOffset = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BORDER_OFFSET);
  const borderScale = getBorderScale();
  const frameOpacity = getFrameOpacity(token);
  const baseOpacity = getBaseOpacity(token);
  const fillTexture = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FILL_TEXTURE);

  const tokenCenterX = token.w / 2;
  const tokenCenterY = token.h / 2;
  const tokenBorderRadiusX = (token.w * textureScaleX) / 2;
  const tokenBorderRadiusY = (token.h * textureScaleY) / 2;

  const borderWidth = getTokenBorderWidth(token);
  const scaledBorderWidth = borderWidth * borderScale;
  const scaledHalfBorderWidth = scaledBorderWidth / 2;

  const outerRing = _drawGradient(token, borderColor.INT, bevelGradient);
  const innerRing = _drawGradient(token, borderColor.INT, bevelGradient);
  const ringTexture = _drawTexture(token, borderColor.INT, bevelTexture);

  const outerRingMask = new PIXI.Graphics();
  const innerRingMask = new PIXI.Graphics();
  const ringTextureMask = new PIXI.Graphics();

  outerRing.alpha = frameOpacity;
  innerRing.alpha = frameOpacity;
  ringTexture.alpha = frameOpacity;

  if (fillTexture) {
    const factionBorder = new PIXI.Graphics();
    container.addChild(factionBorder);

    factionBorder
      .beginFill(Color.from(borderColor.EX), baseOpacity)
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

    factionBorder
      .beginFill(Color.from(borderColor.INT), baseOpacity)
      .lineStyle(scaledHalfBorderWidth, Color.from(borderColor.INT), 1.0)
      .drawEllipse(
        tokenCenterX,
        tokenCenterY,
        tokenBorderRadiusX - scaledHalfBorderWidth - scaledBorderWidth / 2 - borderOffset,
        tokenBorderRadiusY - scaledHalfBorderWidth - scaledBorderWidth / 2 - borderOffset,
      )
      .beginTextureFill({
        texture: PIXI.Texture.EMPTY,
        color: Color.from(borderColor.INT),
        alpha: baseOpacity,
      })
      .endFill();
  }

  outerRingMask
    .lineStyle(scaledHalfBorderWidth, borderColor.EX, 1.0)
    .beginFill(Color.from(0xffffff), 0.0)
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
    .beginFill(Color.from(0xffffff), 0.0)
    .drawEllipse(
      tokenCenterX,
      tokenCenterY,
      tokenBorderRadiusX - scaledBorderWidth - borderOffset - scaledHalfBorderWidth,
      tokenBorderRadiusY - scaledBorderWidth - borderOffset - scaledHalfBorderWidth,
    )
    .endFill();

  ringTextureMask
    .lineStyle(scaledBorderWidth, borderColor.EX, 1.0)
    .beginFill(Color.from(0xffffff), 0.0)
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

export function drawBorder(token, container, borderColor) {
  const graphics = new PIXI.Graphics();
  container.addChild(graphics);

  const tokenBorderWidth = getTokenBorderWidth(token);
  const isFilled = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FILL_TEXTURE);
  const borderOffset = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BORDER_OFFSET);
  const borderScale = getBorderScale();
  const frameOpacity = getFrameOpacity(token);
  const baseOpacity = getBaseOpacity(token);

  graphics.alpha = frameOpacity;

  if (game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CIRCLE_BORDERS)) {
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
 * @param {Object} token - The token object.
 * @returns {number} - The border width for the token.
 */
export function getTokenBorderWidth(token) {
  let tokenBorderWidth =
    game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BORDER_WIDTH) || CONFIG.Canvas.objectBorderThickness;

  if (game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PERMANENT_BORDER) && token.controlled) {
    tokenBorderWidth *= 2;
  }

  return tokenBorderWidth;
}

/**
 * Get the scale factor for the border based on the grid scale.
 *
 * @returns {number} - The scale factor for the border.
 */
export function getBorderScale() {
  const borderGridScale = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BORDER_GRID_SCALE);
  return borderGridScale ? canvas.dimensions?.size / 100 : 1;
}

/**
 * Get the frame opacity for a given token.
 *
 * @param {Object} token - The token object.
 * @returns {number} The frame opacity value.
 */
export function getFrameOpacity(token) {
  let frameOpacity = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRAME_OPACITY) || 0.5;
  const customFrameOpacity = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY);
  if (customFrameOpacity && customFrameOpacity != 0.5) {
    frameOpacity = customFrameOpacity;
  }
  return frameOpacity;
}

/**
 * Get the base opacity for a given token.
 *
 * @param {Object} token - The token object.
 * @returns {number} The base opacity value.
 */
export function getBaseOpacity(token) {
  let baseOpacity = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BASE_OPACITY) || 0.5;
  const customBaseOpacity = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY);

  if (customBaseOpacity && customBaseOpacity != 0.5) {
    baseOpacity = customBaseOpacity;
  }

  return baseOpacity;
}

export function isHexGrid() {
  const gridTypes = CONST.GRID_TYPES;
  const hexTypes = [gridTypes.HEXEVENQ, gridTypes.HEXEVENR, gridTypes.HEXODDQ, gridTypes.HEXODDR];
  return canvas.grid.isHexagonal || hexTypes.includes(canvas.grid?.type);
}

export function drawCircleBorder(
  token,
  borderColor,
  graphics,
  isFilled,
  borderWidth,
  borderOffset,
  borderScale,
  baseOpacity,
) {
  const { textureScaleX, textureScaleY } = getTextureScale(token);
  const scaledBorderWidth = borderWidth * borderScale;
  const scaledBorderHalfWidth = borderWidth * borderScale;

  const tokenCenterX = token.w / 2;
  const tokenCenterY = token.h / 2;

  const tokenBorderRadiusX = (token.w * textureScaleX) / 2;
  const tokenBorderRadiusY = (token.h * textureScaleY) / 2;

  if (isFilled) {
    graphics
      .beginFill(Color.from(borderColor.EX), baseOpacity)
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
      .beginFill(Color.from(borderColor.INT), baseOpacity)
      .lineStyle(scaledBorderHalfWidth, Color.from(borderColor.INT), 1.0)
      .drawEllipse(
        tokenCenterX,
        tokenCenterY,
        tokenBorderRadiusX - scaledBorderHalfWidth - scaledBorderWidth / 2 - borderOffset,
        tokenBorderRadiusY - scaledBorderHalfWidth - scaledBorderWidth / 2 - borderOffset,
      )
      .beginTextureFill({
        texture: PIXI.Texture.EMPTY,
        color: Color.from(borderColor.INT),
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
    .lineStyle(scaledBorderHalfWidth, Color.from(borderColor.INT), 1.0)
    .drawEllipse(
      tokenCenterX,
      tokenCenterY,
      tokenBorderRadiusX - scaledBorderHalfWidth - scaledBorderWidth / 2 - borderOffset,
      tokenBorderRadiusY - scaledBorderHalfWidth - scaledBorderWidth / 2 - borderOffset,
    );
}

export function drawHexBorder(
  token,
  borderColor,
  graphics,
  fillTexture,
  tokenBorderWidth,
  borderOffset,
  borderScale,
  baseOpacity,
) {
  const { textureScaleX, textureScaleY } = getTextureScale(token);
  const { offsetX, offsetY } = getScaledOffsets(token, textureScaleX, textureScaleY);

  const halfBorderWidth = Math.round(tokenBorderWidth / 2);
  const quarterBorderWidth = Math.round(halfBorderWidth / 2);
  let polygon = token.getShape();

  polygon.points = polygon.points.map((coord, index) =>
    index % 2 === 0 ? coord * textureScaleX + offsetX : coord * textureScaleY + offsetY,
  );

  if (fillTexture) {
    graphics
      .beginFill(Color.from(borderColor.EX), baseOpacity)
      .lineStyle(tokenBorderWidth * borderScale, borderColor.EX, 0.8)
      .drawPolygon(polygon)
      .beginTextureFill({
        texture: PIXI.Texture.EMPTY,
        color: borderColor.EX,
        alpha: baseOpacity,
      })
      .endFill();

    graphics
      .beginFill(Color.from(borderColor.INT), baseOpacity)
      .lineStyle((tokenBorderWidth * borderScale) / 2, Color.from(borderColor.INT), 1.0)
      .drawPolygon(polygon)
      .beginTextureFill({
        texture: PIXI.Texture.EMPTY,
        color: Color.from(borderColor.INT),
        alpha: baseOpacity,
      })
      .endFill();
  }

  graphics.lineStyle(tokenBorderWidth * borderScale, borderColor.EX, 0.8).drawPolygon(polygon);

  graphics.lineStyle((tokenBorderWidth * borderScale) / 2, Color.from(borderColor.INT), 1.0).drawPolygon(polygon);
}

export function drawSquareBorder(
  token,
  borderColor,
  graphics,
  fillTexture,
  tokenBorderWidth,
  borderOffset,
  borderScale,
  baseOpacity,
) {
  const { textureScaleX, textureScaleY } = getTextureScale(token);
  const { offsetX, offsetY } = getScaledOffsets(token, textureScaleX, textureScaleY);

  const tokenWidth = token.w * textureScaleX;
  const tokenHeight = token.h * textureScaleY;

  const halfBorderOffset = Math.round(borderOffset / 2);
  const halfBorderWidth = Math.round(tokenBorderWidth / 2);
  const quarterBorderWidth = Math.round(halfBorderWidth / 2);

  if (fillTexture) {
    graphics
      .beginFill(Color.from(borderColor.EX), baseOpacity)
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
      .beginFill(Color.from(borderColor.INT), baseOpacity)
      .lineStyle(halfBorderWidth * borderScale, Color.from(borderColor.INT), 1.0)
      .drawRoundedRect(
        offsetX - quarterBorderWidth - halfBorderOffset,
        offsetY - quarterBorderWidth - halfBorderOffset,
        tokenWidth + halfBorderWidth - borderOffset,
        tokenHeight + halfBorderWidth - borderOffset,
        3,
      )
      .beginTextureFill({
        texture: PIXI.Texture.EMPTY,
        color: Color.from(borderColor.INT),
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
    .lineStyle(halfBorderWidth * borderScale, Color.from(borderColor.INT), 1.0)
    .drawRoundedRect(
      offsetX - quarterBorderWidth - halfBorderOffset,
      offsetY - quarterBorderWidth - halfBorderOffset,
      tokenWidth + halfBorderWidth - borderOffset,
      tokenHeight + halfBorderWidth - borderOffset,
      3,
    );
}

export function _drawGradient(token, color, bevelGradient) {
  const bg = new PIXI.Sprite(bevelGradient);

  bg.anchor.set(0.0, 0.0);
  bg.width = token.w;
  bg.height = token.h;
  bg.tint = color;
  // bg.x = token.x;
  // bg.y = token.y;

  return bg;
}

export function _drawTexture(token, color, bevelTexture) {
  const bg = new PIXI.Sprite(bevelTexture);

  bg.anchor.set(0.0, 0.0);
  bg.width = token.w;
  bg.height = token.h;
  bg.tint = color;
  // bg.x = token.x;
  // bg.y = token.y;

  return bg;
}

export function colorBorderFaction(token) {
  const colorFrom = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.COLOR_FROM);

  let color;

  if (colorFrom === "token-disposition") {
    const disposition = TokenFactions.dispositionKey(token);

    if (disposition) {
      color = TokenFactions.defaultColors[disposition];
    }
  } else if (colorFrom === "actor-folder-color") {
    if (token.actor && token.actor.folder && token.actor.folder) {
      color = token.actor.folder.color;
    }
  } else {
    // colorFrom === 'custom-disposition'
    // TODO PUT SOME NEW FLAG ON THE TOKEN
    const disposition = TokenFactions.dispositionKey(token);
    if (disposition) {
      color = game.settings.get(CONSTANTS.MODULE_ID, `custom-${disposition}-color`);
    }
  }

  const overrides = {
    CONTROLLED: {
      INT: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR)),
      EX: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX)),
      INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR)),
      EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX)),
    },
    FRIENDLY: {
      INT: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR)),
      EX: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX)),
      INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR)),
      EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX)),
    },
    NEUTRAL: {
      INT: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR)),
      EX: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX)),
      INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR)),
      EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX)),
    },
    HOSTILE: {
      INT: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR)),
      EX: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR_EX)),
      INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR)),
      EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR_EX)),
    },
    PARTY: {
      INT: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR)),
      EX: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR_EX)),
      INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR)),
      EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR_EX)),
    },
    ACTOR_FOLDER_COLOR: {
      INT: Color.fromString(color ? String(color) : CONSTANTS.DEFAULTS.ACTOR_FOLDER_COLOR_EX),
      EX: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX)),
      INT_S: color ? String(color) : CONSTANTS.DEFAULTS.ACTOR_FOLDER_COLOR_EX,
      EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX)),
    },
  };

  const isBorderCustom = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_BORDER) || false;

  if (isBorderCustom) {
    const customColorInt = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT);
    const customColorExt = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT);

    return {
      INT: Color.fromString(String(customColorInt)),
      EX: Color.fromString(String(customColorExt)),
      INT_S: String(customColorInt),
      EX_S: String(customColorExt),
    };
  } else if (colorFrom === "token-disposition") {
    const disPath = CONST.TOKEN_DISPOSITIONS;
    const disposition = parseInt(token.document.disposition);
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
      borderColor = overrides.HOSTILE;
    }

    return borderColor;
  } else if (colorFrom === "actor-folder-color") {
    return overrides.ACTOR_FOLDER_COLOR;
  } else {
    Logger.debug(`No color found for token ${token.document.name}`);
    return overrides.ACTOR_FOLDER_COLOR;
  }
}

function getTextureScale(token) {
  return game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.SCALE_BORDER)
    ? {
        textureScaleX: token.document.texture.scaleX,
        textureScaleY: token.document.texture.scaleY,
      }
    : { textureScaleX: 1, textureScaleY: 1 };
}

function getScaledOffsets(token, textureScaleX, textureScaleY) {
  return game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.SCALE_BORDER)
    ? {
        offsetX: (token.w * (1 - textureScaleX)) / 2,
        offsetY: (token.h * (1 - textureScaleY)) / 2,
      }
    : { offsetX: 0, offsetY: 0 };
}
