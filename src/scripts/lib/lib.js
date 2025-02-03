import CONSTANTS from "../constants.js";
import Logger from "./Logger.js";

// =============================
// Module Generic function
// =============================

export function isGMConnected() {
  return Array.from(game.users).find((user) => user.isGM && user.active) ? true : false;
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function cleanUpString(stringToCleanUp) {
  // regex expression to match all non-alphanumeric characters in string
  const regex = /[^A-Za-z0-9]/g;
  if (stringToCleanUp) {
    return Logger.i18n(stringToCleanUp).replace(regex, "").toLowerCase();
  } else {
    return stringToCleanUp;
  }
}

export function isStringEquals(stringToCheck1, stringToCheck2, startsWith = false) {
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
/*
export function buildButton(html, tooltip, iconClass) {
  const iconClass = 'fas fa-wind'; // TODO customize icon ???
  const button = $(
    `<div class="control-icon ${CONSTANTS.MODULE_ID}" title="${tooltip}"><i class="${iconClass}"></i></div>`,
  );
  const settingHudColClass = <string>game.settings.get(CONSTANTS.MODULE_ID, 'hudColumn') ?? 'left';
  const settingHudTopBottomClass = <string>game.settings.get(CONSTANTS.MODULE_ID, 'hudTopBottom') ?? 'top';

  const buttonPos = '.' + settingHudColClass.toLowerCase();

  const col = html.find(buttonPos);
  if (settingHudTopBottomClass.toLowerCase() === 'top') {
    col.prepend(button);
  } else {
    col.append(button);
  }
  return button;
}
*/
export function getOwnedTokens(priorityToControlledIfGM) {
  const gm = game.user?.isGM;

  if (gm) {
    if (priorityToControlledIfGM) {
      const arr = canvas.tokens?.controlled;
      if (arr && arr.length > 0) {
        return arr;
      } else {
        return canvas.tokens?.placeables;
      }
    } else {
      return canvas.tokens?.placeables;
    }
  }

  if (priorityToControlledIfGM) {
    const arr = canvas.tokens?.controlled;
    if (arr && arr.length > 0) {
      return arr;
    }
  }
  let ownedTokens = canvas.tokens?.placeables.filter((token) => token.isOwner && (!token.data.hidden || gm));

  if (ownedTokens.length === 0 || !canvas.tokens?.controlled[0]) {
    ownedTokens = canvas.tokens?.placeables.filter(
      (token) => (token.observer || token.isOwner) && (!token.data.hidden || gm),
    );
  }
  return ownedTokens;
}

export function performLOSTest(sourceToken, token, source) {
  return advancedLosTestVisibility(sourceToken, token, source);
}

function advancedLosTestVisibility(sourceToken, token, source) {
  const angleTest = testInAngle(sourceToken, token);
  if (!angleTest) return false;
  return !advancedLosTestInLos(sourceToken, token);
  const inLOS = !advancedLosTestInLos(sourceToken, token);
  if (sourceToken.vision.los === source) return inLOS;
  const inRange = tokenInRange(sourceToken, token);
  if (inLOS && inRange) return true;
  return false;
}

export function advancedLosTestInLos(sourceToken, token) {
  const tol = 4;

  if (CONFIG.Levels && CONFIG.Levels.settings.get("preciseTokenVisibility") === false)
    return checkCollision(sourceToken, token, "sight");
  const targetLOSH = token.losHeight;
  const targetElevation = token.document.elevation + (targetLOSH - token.document.elevation) * 0.1;
  const sourceCenter = {
    x: sourceToken.center.x,
    y: sourceToken.center.y,
    z: sourceToken.losHeight,
  };
  const tokenCorners = [
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

  if (CONFIG.Levels && CONFIG.Levels.settings.get("exactTokenVisibility")) {
    const exactPoints = [
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
  for (let point of tokenCorners) {
    let collision = testCollision(sourceCenter, point, "sight");
    if (!collision) return collision;
  }
  return true;
}

function testInAngle(sourceToken, token) {
  const documentAngle = sourceToken.document?.sight?.angle ?? sourceToken.document?.config?.angle;
  if (documentAngle == 360) return true;

  //normalize angle
  function normalizeAngle(angle) {
    let normalized = angle % (Math.PI * 2);
    if (normalized < 0) normalized += Math.PI * 2;
    return normalized;
  }

  //check angled vision
  const angle = normalizeAngle(
    Math.atan2(token.center.y - sourceToken.center.y, token.center.x - sourceToken.center.x),
  );
  const rotation = (((sourceToken.document.rotation + 90) % 360) * Math.PI) / 180;
  const end = normalizeAngle(rotation + (documentAngle * Math.PI) / 180 / 2);
  const start = normalizeAngle(rotation - (documentAngle * Math.PI) / 180 / 2);
  if (start > end) return angle >= start || angle <= end;
  return angle >= start && angle <= end;
}

function tokenInRange(sourceToken, token) {
  const range = sourceToken.vision.radius;
  if (range === 0) return false;
  if (range === Infinity) return true;
  const tokensSizeAdjust = (Math.min(token.w, token.h) || 0) / Math.SQRT2;
  const dist =
    (getUnitTokenDist(sourceToken, token) * canvas.dimensions?.size) / canvas.dimensions?.distance - tokensSizeAdjust;
  return dist <= range;
}

function getUnitTokenDist(token1, token2) {
  const unitsToPixel = canvas.dimensions?.size / canvas.dimensions?.distance;
  const x1 = token1.center.x;
  const y1 = token1.center.y;
  const z1 = token1.losHeight * unitsToPixel;
  const x2 = token2.center.x;
  const y2 = token2.center.y;
  const z2 = token2.losHeight * unitsToPixel;

  const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)) / unitsToPixel;
  return d;
}

/**
 * Check whether the given wall should be tested for collisions, based on the collision type and wall configuration
 * @param {Object} wall - The wall being checked
 * @param {Integer} collisionType - The collision type being checked: 0 for sight, 1 for movement
 * @returns {boolean} Whether the wall should be ignored
 */
function shouldIgnoreWall(wall, collisionType) {
  if (collisionType === 0) {
    return wall.document.sight === CONST.WALL_SENSE_TYPES.NONE || (wall.document.door != 0 && wall.document.ds === 1);
  } else if (collisionType === 1) {
    return wall.document.move === CONST.WALL_MOVEMENT_TYPES.NONE || (wall.document.door != 0 && wall.document.ds === 1);
  }
  return false;
}

/**
 * Perform a collision test between 2 point in 3D space
 * @param {Object} p0 - a point in 3d space {x:x,y:y,z:z} where z is the elevation
 * @param {Object} p1 - a point in 3d space {x:x,y:y,z:z} where z is the elevation
 * @param {String} type - "sight" or "collision" (defaults to "sight")
 * @returns {Boolean} returns the collision point if a collision is detected, flase if it's not
 **/
function testCollision(p0, p1, type = "sight") {
  if (canvas?.scene?.flags["levels-3d-preview"]?.object3dSight) {
    if (!game.Levels3DPreview?._active) return true;

    return game.Levels3DPreview.interactionManager.computeSightCollision(p0, p1);
  }
  //Declare points adjusted with token height to use in the loop
  const x0 = p0.x;
  const y0 = p0.y;
  const z0 = p0.z;
  const x1 = p1.x;
  const y1 = p1.y;
  const z1 = p1.z;
  const TYPE = type == "sight" ? 0 : 1;
  //If the point are on the same Z axis return the 3d wall test
  if (z0 == z1) {
    return walls3dTest.bind(this)();
  }

  //Check the background for collisions

  const bgElevation = canvas?.scene?.flags?.levels?.backgroundElevation ?? 0;
  const zIntersectionPointBG = getPointForPlane(bgElevation);
  if ((z0 < bgElevation && bgElevation < z1) || (z1 < bgElevation && bgElevation < z0)) {
    return {
      x: zIntersectionPointBG.x,
      y: zIntersectionPointBG.y,
      z: bgElevation,
    };
  }

  //Loop through all the planes and check for both ceiling and floor collision on each tile

  for (let tile of canvas.tiles?.placeables) {
    if (tile.document.flags?.levels?.noCollision) continue;
    const bottom = tile.document.flags?.levels?.rangeBottom ?? -Infinity;
    const top = tile.document.flags?.levels?.rangeTop ?? Infinity;
    if (bottom != -Infinity) {
      const zIntersectionPoint = getPointForPlane(bottom);
      if (
        ((z0 < bottom && bottom < z1) || (z1 < bottom && bottom < z0)) &&
        tile.containsPixel(zIntersectionPoint.x, zIntersectionPoint.y, 0.99)
      ) {
        return {
          x: zIntersectionPoint.x,
          y: zIntersectionPoint.y,
          z: bottom,
        };
      }
    }
  }

  //Return the 3d wall test if no collisions were detected on the Z plane
  return walls3dTest.bind(this)();

  //Get the intersection point between the ray and the Z plane
  function getPointForPlane(z) {
    const x = ((z - z0) * (x1 - x0) + x0 * z1 - x0 * z0) / (z1 - z0);
    const y = ((z - z0) * (y1 - y0) + z1 * y0 - z0 * y0) / (z1 - z0);
    const point = { x: x, y: y };
    return point;
  }
  //Check if a point in 2d space is betweeen 2 points
  function isBetween(a, b, c) {
    //test
    //return ((a.x<=c.x && c.x<=b.x && a.y<=c.y && c.y<=b.y) || (a.x>=c.x && c.x >=b.x && a.y>=c.y && c.y >=b.y))

    const dotproduct = (c.x - a.x) * (b.x - a.x) + (c.y - a.y) * (b.y - a.y);
    if (dotproduct < 0) return false;

    const squaredlengthba = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
    if (dotproduct > squaredlengthba) return false;

    return true;
  }
  //Get wall heights flags, avoid infinity, use arbitrary large number instead
  function getWallHeightRange3Dcollision(wall) {
    let { top, bottom } = getWallBounds(wall); // WallHeight
    if (bottom == -Infinity) bottom = -1e9;
    if (top == Infinity) top = 1e9;
    let wallRange = [bottom, top];
    if (!wallRange[0] && !wallRange[1]) return false;
    else return wallRange;
  }
  //Compute 3d collision for walls
  function walls3dTest() {
    const rectX = Math.min(x0, x1);
    const rectY = Math.min(y0, y1);
    const rectW = Math.abs(x1 - x0);
    const rectH = Math.abs(y1 - y0);
    const rect = new PIXI.Rectangle(rectX, rectY, rectW, rectH);

    const walls = canvas.walls.quadtree.getObjects(rect);
    let terrainWalls = 0;
    for (let wall of walls) {
      if (shouldIgnoreWall(wall, TYPE)) continue;

      let isTerrain = TYPE === 0 && wall.document.sight === CONST.WALL_SENSE_TYPES.LIMITED;

      //declare points in 3d space of the rectangle created by the wall
      const wallBotTop = getWallHeightRange3Dcollision(wall);

      const wx1 = wall.document.c[0];

      const wx2 = wall.document.c[2];

      const wx3 = wall.document.c[2];

      const wy1 = wall.document.c[1];

      const wy2 = wall.document.c[3];

      const wy3 = wall.document.c[3];
      const wz1 = wallBotTop[0];
      const wz2 = wallBotTop[0];
      const wz3 = wallBotTop[1];

      //calculate the parameters for the infinite plane the rectangle defines
      const A = wy1 * (wz2 - wz3) + wy2 * (wz3 - wz1) + wy3 * (wz1 - wz2);
      const B = wz1 * (wx2 - wx3) + wz2 * (wx3 - wx1) + wz3 * (wx1 - wx2);
      const C = wx1 * (wy2 - wy3) + wx2 * (wy3 - wy1) + wx3 * (wy1 - wy2);
      const D = -wx1 * (wy2 * wz3 - wy3 * wz2) - wx2 * (wy3 * wz1 - wy1 * wz3) - wx3 * (wy1 * wz2 - wy2 * wz1);

      //solve for p0 p1 to check if the points are on opposite sides of the plane or not
      const P1 = A * x0 + B * y0 + C * z0 + D;
      const P2 = A * x1 + B * y1 + C * z1 + D;

      //don't do anything else if the points are on the same side of the plane
      if (P1 * P2 > 0) continue;

      //Check for directional walls

      if (wall.direction !== null) {
        // Directional walls where the ray angle is not in the same hemisphere
        const rayAngle = Math.atan2(y1 - y0, x1 - x0);
        const angleBounds = [rayAngle - Math.PI / 2, rayAngle + Math.PI / 2];

        if (!wall.isDirectionBetweenAngles(...angleBounds)) continue;
      }

      // calculate intersection point
      const t = -(A * x0 + B * y0 + C * z0 + D) / (A * (x1 - x0) + B * (y1 - y0) + C * (z1 - z0)); //-(A*x0 + B*y0 + C*z0 + D) / (A*x1 + B*y1 + C*z1)
      const ix = x0 + (x1 - x0) * t;
      const iy = y0 + (y1 - y0) * t;
      const iz = Math.round(z0 + (z1 - z0) * t);

      // return true if the point is inisde the rectangle
      const isb = isBetween({ x: wx1, y: wy1 }, { x: wx2, y: wy2 }, { x: ix, y: iy });
      if (isTerrain && isb && iz <= wallBotTop[1] && iz >= wallBotTop[0] && terrainWalls == 0) {
        terrainWalls++;
        continue;
      }
      if (isb && iz <= wallBotTop[1] && iz >= wallBotTop[0]) return { x: ix, y: iy, z: iz };
    }
    return false;
  }
}

/**
 * Perform a collision test between 2 TOKENS in 3D space
 * @param {Object} token1 - a point in 3d space {x:x,y:y,z:z} where z is the elevation
 * @param {Object} token2 - a point in 3d space {x:x,y:y,z:z} where z is the elevation
 * @param {String} type - "sight" or "collision" (defaults to "sight")
 * @returns {Boolean} returns the collision point if a collision is detected, flase if it's not
 **/

function checkCollision(token1, token2, type = "sight") {
  const token1LosH = token1.losHeight;
  const token2LosH = token2.losHeight;
  const p0 = {
    x: token1.center.x,
    y: token1.center.y,
    z: token1LosH,
  };
  const p1 = {
    x: token2.center.x,
    y: token2.center.y,
    z: token2LosH,
  };
  return testCollision(p0, p1, type);
}

function getWallBounds(wall) {
  if (wall.document) wall = wall.document;
  const top = wall.flags["wall-height"]?.["top"] ?? Infinity;
  const bottom = wall.flags["wall-height"]?.["bottom"] ?? -Infinity;
  return { top, bottom };
}

export function isEmptyObject(obj) {
  // because Object.keys(new Date()).length === 0;
  // we have to do some additional check
  if (obj === null || obj === undefined) {
    return true;
  }
  if (isRealNumber(obj)) {
    return false;
  }
  if (obj instanceof Object && Object.keys(obj).length === 0) {
    return true;
  }
  if (obj instanceof Array && obj.length === 0) {
    return true;
  }
  if (obj && Object.keys(obj).length === 0) {
    return true;
  }
  return false;
}

export function isRealNumber(inNumber) {
  return !isNaN(inNumber) && typeof inNumber === "number" && isFinite(inNumber);
}

export function isRealBoolean(inBoolean) {
  return String(inBoolean) === "true" || String(inBoolean) === "false";
}

export function isRealBooleanOrElseNull(inBoolean) {
  return isRealBoolean(inBoolean) ? inBoolean : null;
}
