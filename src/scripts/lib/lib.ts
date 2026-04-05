import CONSTANTS from "../constants";
import Logger from "./Logger";
import { TokenFactions } from "../tokenFactions";

// =============================
// Module Generic function
// =============================

export function isGMConnected(): boolean {
  return Array.from(game.users).some((user) => user.isGM && user.active);
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function cleanUpString(stringToCleanUp: string | undefined): string | undefined {
  // regex expression to match all non-alphanumeric characters in string
  const regex = /[^A-Za-z0-9]/g;
  if (stringToCleanUp) {
    return Logger.i18n(stringToCleanUp)?.replace(regex, "").toLowerCase();
  } else {
    return stringToCleanUp;
  }
}

export function isStringEquals(stringToCheck1: string | undefined, stringToCheck2: string | undefined, startsWith = false): boolean {
  if (stringToCheck1 && stringToCheck2) {
    const s1 = cleanUpString(stringToCheck1) ?? "";
    const s2 = cleanUpString(stringToCheck2) ?? "";
    if (startsWith) {
      return s1.startsWith(s2) || s2.startsWith(s1);
    } else {
      return s1 === s2;
    }
  } else {
    return stringToCheck1 === stringToCheck2;
  }
}

export function getOwnedTokens(priorityToControlledIfGM: boolean): Token[] {
  const gm = game.user?.isGM;

  if (gm) {
    if (priorityToControlledIfGM) {
      const arr = canvas.tokens?.controlled;
      if (arr && arr.length > 0) {
        return arr;
      }
    }
    return canvas.tokens?.placeables || [];
  }

  if (priorityToControlledIfGM) {
    const arr = canvas.tokens?.controlled;
    if (arr && arr.length > 0) {
      return arr;
    }
  }
  let ownedTokens = canvas.tokens?.placeables.filter((token) => token.isOwner && (!(token.document as any).hidden || gm)) || [];

  if (ownedTokens.length === 0 && canvas.tokens?.controlled && canvas.tokens?.controlled.length === 0) { // Check if controlled is empty too
    ownedTokens = canvas.tokens?.placeables.filter(
      (token) => (token.observer || token.isOwner) && (!(token.document as any).hidden || gm),
    ) || [];
  }
  return ownedTokens;
}

export function performLOSTest(sourceToken: Token, token: Token, source: any): boolean { // Type for source?
  return advancedLosTestVisibility(sourceToken, token, source);
}

function advancedLosTestVisibility(sourceToken: Token, token: Token, source: any): boolean {
  const angleTest = testInAngle(sourceToken, token);
  if (!angleTest) return false;
  // Original code had dead code after return, removed it.
  // return !advancedLosTestInLos(sourceToken, token);
  const inLOS = !advancedLosTestInLos(sourceToken, token);
  if (sourceToken.vision?.los === source) return inLOS;
  const inRange = tokenInRange(sourceToken, token);
  return inLOS && inRange;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export function advancedLosTestInLos(sourceToken: Token, token: Token): boolean {
  const tol = 4;
  // Assuming CONFIG.Levels is available if used.
  if ((CONFIG as any).Levels && (CONFIG as any).Levels.settings.get("preciseTokenVisibility") === false)
    return checkCollision(sourceToken, token, "sight");

  const targetLOSH = (token as any).losHeight as number; // losHeight is not standard on Token
  const targetElevation = token.document.elevation + (targetLOSH - token.document.elevation) * 0.1;
  const sourceCenter: Point3D = {
    x: sourceToken.center.x,
    y: sourceToken.center.y,
    z: (sourceToken as any).losHeight as number, // losHeight is not standard on Token
  };
  const tokenCorners: Point3D[] = [
    { x: token.center.x, y: token.center.y, z: targetLOSH },
    { x: token.x + tol, y: token.y + tol, z: targetLOSH },
    { x: token.x + token.w - tol, y: token.y + tol, z: targetLOSH },
    { x: token.x + tol, y: token.y + token.h - tol, z: targetLOSH },
    {
      x: token.x + token.w - tol,
      y: token.y + token.h - tol,
      z: targetLOSH,
    },
  ];

  if ((CONFIG as any).Levels && (CONFIG as any).Levels.settings.get("exactTokenVisibility")) {
    const exactPoints: Point3D[] = [
      {
        x: token.center.x,
        y: token.center.y,
        z: targetElevation + (targetLOSH - targetElevation) / 2,
      },
      { x: token.center.x, y: token.center.y, z: targetElevation },
      { x: token.x + tol, y: token.y + tol, z: targetElevation },
      {
        x: token.x + token.w - tol,
        y: token.y + tol,
        z: targetElevation,
      },
      {
        x: token.x + tol,
        y: token.y + token.h - tol,
        z: targetElevation,
      },
      {
        x: token.x + token.w - tol,
        y: token.y + token.h - tol,
        z: targetElevation,
      },
    ];
    tokenCorners.push(...exactPoints);
  }
  for (const point of tokenCorners) {
    const collision = testCollision(sourceCenter, point, "sight");
    if (!collision) return false; // If any point is visible, token is visible
  }
  return true; // If all points are occluded, token is not visible
}

function testInAngle(sourceToken: Token, token: Token): boolean {
  const documentAngle = (sourceToken.document as any)?.sight?.angle ?? (sourceToken.document as any)?.config?.angle as number ?? 360;
  if (documentAngle == 360) return true;

  function normalizeAngle(angle: number): number {
    let normalized = angle % (Math.PI * 2);
    if (normalized < 0) normalized += Math.PI * 2;
    return normalized;
  }

  const angle = normalizeAngle(
    Math.atan2(token.center.y - sourceToken.center.y, token.center.x - sourceToken.center.x),
  );
  const rotation = (((sourceToken.document.rotation + 90) % 360) * Math.PI) / 180;
  const end = normalizeAngle(rotation + (documentAngle * Math.PI) / 180 / 2);
  const start = normalizeAngle(rotation - (documentAngle * Math.PI) / 180 / 2);
  if (start > end) return angle >= start || angle <= end;
  return angle >= start && angle <= end;
}

function tokenInRange(sourceToken: Token, token: Token): boolean {
  const range = sourceToken.vision?.radius ?? 0;
  if (range === 0) return false;
  if (range === Infinity) return true;
  const tokensSizeAdjust = (Math.min(token.w, token.h) || 0) / Math.SQRT2;
  const dist =
    (getUnitTokenDist(sourceToken, token) * (canvas.dimensions?.size || 0)) / (canvas.dimensions?.distance || 1) - tokensSizeAdjust;
  return dist <= range;
}

function getUnitTokenDist(token1: Token, token2: Token): number {
  const unitsToPixel = (canvas.dimensions?.size || 1) / (canvas.dimensions?.distance || 1);
  const x1 = token1.center.x;
  const y1 = token1.center.y;
  const z1 = ((token1 as any).losHeight as number) * unitsToPixel; // losHeight not standard
  const x2 = token2.center.x;
  const y2 = token2.center.y;
  const z2 = ((token2 as any).losHeight as number) * unitsToPixel; // losHeight not standard

  const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)) / unitsToPixel;
  return d;
}

function shouldIgnoreWall(wall: Wall, collisionType: 0 | 1): boolean {
  if (collisionType === 0) { // sight
    return wall.document.sight === CONST.WALL_SENSE_TYPES.NONE || (wall.document.door !== CONST.WALL_DOOR_TYPES.NONE && wall.document.ds === CONST.WALL_DOOR_STATES.CLOSED);
  } else if (collisionType === 1) { // move
    return wall.document.move === CONST.WALL_MOVEMENT_TYPES.NONE || (wall.document.door !== CONST.WALL_DOOR_TYPES.NONE && wall.document.ds === CONST.WALL_DOOR_STATES.CLOSED);
  }
  return false;
}

function testCollision(p0: Point3D, p1: Point3D, type: "sight" | "collision" = "sight"): boolean | Point3D {
  if ((canvas?.scene?.flags as any)["levels-3d-preview"]?.object3dSight) {
    if (!(game as any).Levels3DPreview?._active) return true;
    return (game as any).Levels3DPreview.interactionManager.computeSightCollision(p0, p1);
  }

  const x0 = p0.x;
  const y0 = p0.y;
  const z0 = p0.z;
  const x1 = p1.x;
  const y1 = p1.y;
  const z1 = p1.z;
  const TYPE: 0 | 1 = type === "sight" ? 0 : 1;

  if (z0 === z1) {
    return walls3dTest(); // `this` context might be an issue here
  }

  const bgElevation = (canvas?.scene?.flags as any)?.levels?.backgroundElevation ?? 0;
  const zIntersectionPointBG = getPointForPlane(bgElevation);
  if (zIntersectionPointBG && ((z0 < bgElevation && bgElevation < z1) || (z1 < bgElevation && bgElevation < z0))) {
    return {
      x: zIntersectionPointBG.x,
      y: zIntersectionPointBG.y,
      z: bgElevation,
    };
  }

  for (const tile of canvas.tiles?.placeables || []) {
    if ((tile.document.flags as any)?.levels?.noCollision) continue;
    const bottom = (tile.document.flags as any)?.levels?.rangeBottom ?? -Infinity;
    const top = (tile.document.flags as any)?.levels?.rangeTop ?? Infinity;
    if (bottom !== -Infinity) {
      const zIntersectionPoint = getPointForPlane(bottom);
      if (
        zIntersectionPoint &&
        ((z0 < bottom && bottom < z1) || (z1 < bottom && bottom < z0)) &&
        (tile as any).containsPixel(zIntersectionPoint.x, zIntersectionPoint.y, 0.99) // containsPixel not standard
      ) {
        return {
          x: zIntersectionPoint.x,
          y: zIntersectionPoint.y,
          z: bottom,
        };
      }
    }
  }
  return walls3dTest(); // `this` context might be an issue here

  function getPointForPlane(z: number): Point3D | null {
    if (z1 - z0 === 0) return null; // Avoid division by zero
    const x = ((z - z0) * (x1 - x0) + x0 * z1 - x0 * z0) / (z1 - z0);
    const y = ((z - z0) * (y1 - y0) + z1 * y0 - z0 * y0) / (z1 - z0);
    return { x: x, y: y, z: z }; // z was missing from original return
  }

  function walls3dTest(): boolean | Point3D {
    const rectX = Math.min(x0, x1);
    const rectY = Math.min(y0, y1);
    const rectW = Math.abs(x1 - x0);
    const rectH = Math.abs(y1 - y0);
    const rect = new PIXI.Rectangle(rectX, rectY, rectW, rectH);

    const walls = canvas.walls.quadtree.getObjects(rect);
    let terrainWalls = 0;
    for (const wall of walls) {
      if (shouldIgnoreWall(wall, TYPE)) continue;

      const isTerrain = TYPE === 0 && wall.document.sight === CONST.WALL_SENSE_TYPES.LIMITED;
      const wallBotTop = getWallHeightRange3Dcollision(wall);
      if (!wallBotTop) continue;

      const wx1 = wall.document.c[0];
      const wy1 = wall.document.c[1];
      const wx2 = wall.document.c[2];
      const wy2 = wall.document.c[3];
      // Assuming wz1, wz2, wz3 logic based on context, might need adjustment
      const wz1 = wallBotTop[0]; 
      const wz2 = wallBotTop[0]; 
      const wz3 = wallBotTop[1];

      const A = wy1 * (wz2 - wz3) + wy2 * (wz3 - wz1) + wy3 * (wz1 - wz2); // wy3, wz3 might be problematic if wall is just 2 points
      const B = wz1 * (wx2 - wx3) + wz2 * (wx3 - wx1) + wz3 * (wx1 - wx2); // wx3, wz3
      const C = wx1 * (wy2 - wy3) + wx2 * (wy3 - wy1) + wx3 * (wy1 - wy2); // wx3, wy3
      const D = -wx1 * (wy2 * wz3 - (wall.document.c[3]) * wz2) - wx2 * ((wall.document.c[3]) * wz1 - wy1 * wz3) - (wall.document.c[2]) * (wy1 * wz2 - wy2 * wz1); // wx3, wy3

      const P1 = A * x0 + B * y0 + C * z0 + D;
      const P2 = A * x1 + B * y1 + C * z1 + D;

      if (P1 * P2 > 0 && Math.abs(P1*P2) > 1e-6) continue; // Add tolerance for floating point comparison

      if (wall.document.dir !== null && wall.document.dir !== undefined) { // Check for dir property
        const rayAngle = Math.atan2(y1 - y0, x1 - x0);
        const angleBounds = [rayAngle - Math.PI / 2, rayAngle + Math.PI / 2];
        if (!(wall as any).isDirectionBetweenAngles(...angleBounds)) continue; // isDirectionBetweenAngles not standard
      }

      const denominator = (A * (x1 - x0) + B * (y1 - y0) + C * (z1 - z0));
      if (Math.abs(denominator) < 1e-6) continue; // Avoid division by zero or near-zero
      const t = -(A * x0 + B * y0 + C * z0 + D) / denominator;
      const ix = x0 + (x1 - x0) * t;
      const iy = y0 + (y1 - y0) * t;
      const iz = Math.round(z0 + (z1 - z0) * t);
      
      // Check if intersection point is within wall segment bounds
      const distSqWall = Math.pow(wx2 - wx1, 2) + Math.pow(wy2 - wy1, 2);
      const distSqIXToW1 = Math.pow(ix - wx1, 2) + Math.pow(iy - wy1, 2);
      const distSqIXToW2 = Math.pow(ix - wx2, 2) + Math.pow(iy - wy2, 2);
      const isb = distSqIXToW1 <= distSqWall && distSqIXToW2 <= distSqWall;

      if (isTerrain && isb && iz <= wallBotTop[1] && iz >= wallBotTop[0] && terrainWalls === 0) {
        terrainWalls++;
        continue;
      }
      if (isb && iz <= wallBotTop[1] && iz >= wallBotTop[0]) return { x: ix, y: iy, z: iz };
    }
    return false;
  }
}

function checkCollision(token1: Token, token2: Token, type: "sight" | "collision" = "sight"): boolean | Point3D {
  const token1LosH = (token1 as any).losHeight as number; // losHeight not standard
  const token2LosH = (token2 as any).losHeight as number; // losHeight not standard
  const p0: Point3D = {
    x: token1.center.x,
    y: token1.center.y,
    z: token1LosH,
  };
  const p1: Point3D = {
    x: token2.center.x,
    y: token2.center.y,
    z: token2LosH,
  };
  return testCollision(p0, p1, type);
}

interface WallBounds {
    top: number;
    bottom: number;
}

function getWallBounds(wall: Wall): WallBounds {
  // Ensure wall.document is accessed if wall is a PlaceableObject
  const wallDoc = wall.document ?? wall;
  const top = (wallDoc.flags as any)["wall-height"]?.["top"] ?? Infinity;
  const bottom = (wallDoc.flags as any)["wall-height"]?.["bottom"] ?? -Infinity;
  return { top, bottom };
}

export function isEmptyObject(obj: any): boolean {
  if (obj === null || obj === undefined) {
    return true;
  }
  if (isRealNumber(obj)) {
    return false;
  }
  // Consider that `Object.keys(new Date()).length === 0` is true. 
  // If Date objects should not be considered empty, add a check for `obj instanceof Date`.
  if (obj instanceof Object && Object.keys(obj).length === 0 && !(obj instanceof Date)) {
    return true;
  }
  if (obj instanceof Array && obj.length === 0) {
    return true;
  }
  // This last check seems redundant given the previous ones.
  // if (obj && Object.keys(obj).length === 0) {
  //   return true;
  // }
  return false;
}

export function isRealNumber(inNumber: any): boolean {
  return !isNaN(inNumber) && typeof inNumber === "number" && isFinite(inNumber);
}

export function isRealBoolean(inBoolean: any): boolean {
  return String(inBoolean) === "true" || String(inBoolean) === "false";
}

export function isRealBooleanOrElseNull(inBoolean: any): boolean | null {
  return isRealBoolean(inBoolean) ? Boolean(inBoolean) : null; // Ensure it returns an actual boolean
}

// =======================================================================================

/**
 * Returns the first token object from the canvas based on the token ID
 * @param {string} tokenId The ID of the token to look for
 * @returns {Token|null} The token object, or null if not found
 */
export function getToken(tokenId: string): Token | null {
  if (!canvas || !canvas.tokens) {
    return null;
  }
  // Simplified for V13
  const token = (canvas.tokens as any).get(tokenId);
  return token || null;
}

/**
 * Returns the first token object from the canvas based on the token ID
 * @param {string} tokenId The ID of the token to look for
 * @returns {TokenDocument|null} The token document, or null if not found
 */
export function getTokenDocument(tokenId: string): TokenDocument | null {
	const token = getToken(tokenId);
	if (token) {
		return token.document ?? null;
	}
	const td = game.scenes?.current?.tokens?.find((t: TokenDocument) => t.id === tokenId);
	if (td) {
		return td;
	}
	const actor = game.actors?.get(tokenId);
	if (actor && actor.token) {
		return actor.token;
	}
	if (actor && actor.getActiveTokens()?.length > 0) {
		return actor.getActiveTokens()[0]?.document ?? null;
	}
	return null;
}

/**
 * Returns the first token object from the canvas based on the token Name
 * @param {string} tokenName The Name of the token to look for
 * @param {object} [options] Optional parameters
 * @param {boolean} [options.caseSensitive=false] Consider case sensitivity (default: false)
 * @returns {Token|null} The token object, or null if not found
 */
export function getTokenByTokenName(tokenName: string, { caseSensitive = false }: { caseSensitive?: boolean } = {}): Token | null {
	if (!canvas || !canvas.tokens) {
		return null;
	}
  const token = canvas.tokens.placeables.find((t: Token) => {
    if (caseSensitive) {
      return t.name === tokenName;
    } else {
      return t.name?.toLowerCase() === tokenName?.toLowerCase();
    }
  });
  return token || null;
}

/**
 * Returns the first token object from the canvas based on the actor ID
 * @param {string} actorId The ID of the actor to look for
 * @returns {Token|null} The token object, or null if not found
 */
export function getTokenByActorId(actorId: string): Token | null {
	if (!canvas || !canvas.tokens) {
		return null;
	}
	const tokens = canvas.tokens.placeables.filter((t: Token) => t.actor?.id === actorId);
	if (tokens && tokens.length > 0) {
		return tokens[0] || null;
	}
	return null;
}

// ============================================================================================================

/**
 * Get the type of the grid
 * @returns {number} The type of the grid (GRID_TYPES)
 */
export function getGridType(): number {
	if (canvas?.scene) {
		return canvas.scene.grid.type;
	}
	return CONST.GRID_TYPES.SQUARE;
}

/**
 * Get the center of a token
 * @param {Token|PlaceableObject} token The token object
 * @returns {{x:number, y:number}} The coordinates of the center of the token
 */
export function getCenter(token: Token | PlaceableObject): { x: number; y: number } {
  // Simplified for V13: properties are direct
  const xOffset = (token as any).w / 2;
  const yOffset = (token as any).h / 2;
  return { x: token.x + xOffset, y: token.y + yOffset };
}

/**
 * Get the center of a grid cell
 * @param {{x:number, y:number}} {x,y} The coordinates of a point in the grid cell
 * @returns {{x:number, y:number}} The coordinates of the center of the grid cell
 */
export function getGridCenter({ x, y }: { x: number; y: number }): { x: number; y: number } {
	const s = canvas?.scene?.grid?.size ?? 100;
	const xOffset = s / 2;
	const yOffset = s / 2;
	if (!canvas?.grid) {
		return { x: x - xOffset, y: y - yOffset };
	}
	return canvas.grid.getCenterPoint({x, y});
}

/**
 * Get the top left corner of a grid cell
 * @param {{x:number, y:number}} {x,y} The coordinates of a point in the grid cell
 * @returns {{x:number, y:number}} The coordinates of the top left corner of the grid cell
 */
export function getGridOffset({ x, y }: { x: number; y: number }): { x: number; y: number } {
	if (!canvas?.grid) {
		return { x: x, y: y };
	}
	return canvas.grid.getTopLeftPoint({x, y});
}

/**
 * Get the coordinates of the center of the grid cell that contains the given point
 * @param {number} x0 The x-coordinate of the point
 * @param {number} y0 The y-coordinate of the point
 * @returns {{x:number, y:number}} The coordinates of the center of the grid cell
 */
export function getGridPoint({ x, y }: { x: number; y: number }): { x: number; y: number } {
	const s = canvas?.scene?.grid?.size ?? 100;
	const xOffset = s / 2;
	const yOffset = s / 2;
	if (!canvas?.grid) {
		return { x: x - xOffset, y: y - yOffset };
	}
	return canvas.grid.getCenterPoint({x, y});
}

// ============================================================================================================

/**
 * Get the layer of the grid
 * @returns {GridLayer|null} The layer of the grid, or null if not found
 */
export function getGridLayer(): GridLayer | null {
	if (!canvas || !canvas.grid) {
		return null;
	}
	return canvas.grid;
}

/**
 * Get the layer of the tokens
 * @returns {TokenLayer|null} The layer of the tokens, or null if not found
 */
export function getTokenLayer(): PlaceablesLayer<Token> | null {
	if (!canvas || !canvas.tokens) {
		return null;
	}
	return canvas.tokens;
}

// ============================================================================================================

/**
 * check if the key is a property of the object
 * @param {object} obj The object to check
 * @param {string} key The key to check
 * @returns {boolean} True if the key is a property of the object, false otherwise
 */
export function hasProperty(obj: object, key: string): boolean {
	return foundry.utils.hasProperty(obj, key);
}

/**
 * check if the key is a property of the object data
 * @param {object} obj The object to check
 * @param {string} key The key to check
 * @returns {boolean} True if the key is a property of the object, false otherwise
 */
export function hasDataProperty(obj: any, key: string): boolean {
  return hasProperty(obj, key);
}

/**
 * A debounced function.
 * @param {Function} func The function to debounce.
 * @param {number} delay The delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export function debounce(func: (...args: any[]) => void, delay: number): (...args: any[]) => void {
	let timeoutId: NodeJS.Timeout;
	return (...args: any[]) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func(...args);
		}, delay);
	};
}

/**
 * Converts degrees to radians.
 * @param {number} degrees The angle in degrees.
 * @returns {number} The angle in radians.
 */
export function degreesToRadians(degrees: number): number {
	return degrees * (Math.PI / 180);
}

/**
 * Converts radians to degrees.
 * @param {number} radians The angle in radians.
 * @returns {number} The angle in degrees.
 */
export function radiansToDegrees(radians: number): number {
	return radians * (180 / Math.PI);
}

// ===========================================================================================================
// Generic utility functions
// ===========================================================================================================

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 * @param {number} min The minimum value.
 * @param {number} max The maximum value.
 * @returns {number} A random integer between min and max.
 */
export function getRandomInt(min: number, max: number): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random float between min (inclusive) and max (exclusive).
 * @param {number} min The minimum value.
 * @param {number} max The maximum value.
 * @returns {number} A random float between min and max.
 */
export function getRandomFloat(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

/**
 * Returns a random boolean value.
 * @returns {boolean} A random boolean value.
 */
export function getRandomBool(): boolean {
	return Math.random() >= 0.5;
}

/**
 * Returns a random item from an array.
 * @param {Array<T>} arr The array to choose from.
 * @returns {T} A random item from the array.
 */
export function getRandomItem<T>(arr: T[]): T | undefined {
	if (!arr || arr.length === 0) {
		return undefined;
	}
	return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Remove undefined items from array
 * @param {*[]} arr
 * @returns {*[]}
 */
export function removeUndefinedItems<T>(arr: (T | undefined)[]): T[] {
	return arr.filter((el): el is T => {
		return typeof el !== "undefined";
	});
}

/**
 * Remove duplicates from array
 * @param {*[]} arr
 * @returns {*[]}
 */
export function removeDuplicates<T>(arr: T[]): T[] {
	return [...new Set(arr)];
}

/**
 * Retrieve the color for a given string
 * @param {string} colorName            The string to retrieve a color for
 * @returns {Color}                     The Color object
 */
export function getColor(colorName: string): Color | undefined {
    if (!colorName) {
        return undefined;
    }

    // 1. Handle direct hex
    if (colorName.startsWith("#")) {
        try {
            return Color.from(colorName);
        } catch (e) {
            Logger.warn(`Invalid hex color: ${colorName}`, e);
            return undefined;
        }
    }

    // 2. Check our custom defaults (case-insensitive for keys)
    // Ensure TokenFactions and its defaultColors property are available
    if (typeof TokenFactions !== 'undefined' && TokenFactions.defaultColors) {
        const lcColorName = colorName.toLowerCase();
        const colorHexFromDefaults = TokenFactions.defaultColors[lcColorName];
        if (colorHexFromDefaults) {
            try {
                return Color.from(colorHexFromDefaults); // Assuming these are hex strings
            } catch (e) {
                Logger.warn(`Invalid color string '${colorHexFromDefaults}' from defaults for key '${lcColorName}'.`, e);
                // Fall through to general name parsing if default is invalid
            }
        }
    }

    // 3. Try to parse as a named color (e.g., CSS colors "red", "blue")
    try {
        const color = Color.from(colorName);
        // Check if Color.from successfully parsed a known color or if it defaulted.
        // A common issue is Color.from("unknown string") returning black (0x000000).
        const isBlack = color.valueOf() === 0;
        const inputIsBlack = colorName.toLowerCase() === "black" || /^#0{3}(?:0{3})?$/i.test(colorName);
        // Check against Foundry's known named colors (keys are uppercase)
        const isNamedColor = !!Color.NAMED_COLORS[colorName.toUpperCase() as keyof typeof Color.NAMED_COLORS];

        if (isBlack && !inputIsBlack && !isNamedColor) {
             // It parsed to black, but input wasn't black and not a known named color.
             Logger.debug(`Color.from parsed '${colorName}' as black, but it's not recognized as black or a standard named color.`);
             return undefined;
        }
        return color;
    } catch (e) {
        // This catch block might be hit if Color.from truly fails for some inputs.
        Logger.debug(`'${colorName}' could not be parsed by Color.from().`, e);
        return undefined;
    }
}

/**
 * Get the color string for a given color
 */ 