/*
  Clamp a number to a range.
*/
export function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num))
}

/*
  Convert degrees to radians.
*/
export function degreesToRadians(angle) {
  return (-angle * Math.PI) / 180.0
}

/*
  Convert radians to degrees.
*/
export function radiansToDegrees(angle) {
  return angle * (180 / Math.PI)
}

/*
  Convert a polar coordinate (r, θ) to cartesian (x, y).
*/
export function polarToCartesian(radius, theta) {
  const x = radius + radius * Math.cos(theta)
  const y = radius + radius * Math.sin(theta)

  return [x, y]
}

/*
  Convert a cartesian coordinate (x, y) to polar (r, θ).
*/
export function cartesianToPolar(x, y) {
  ;[x, y] = normalisePoint(x, y)

  const radius = Math.sqrt(x ** 2, y ** 2)
  const theta = Math.atan2(y, x)

  return [radius, theta]
}

/*
  "Normalises" a point, allowing functions to use:

  - Arrays     - `[1, 1]`
  - Vectors    - `new Vector2(1, 1)`
  - Objects    - `{ x: 1, y: 1 }`
  - Parameters - `x, y`
*/
export function normalisePoint(x, y) {
  if (Array.isArray(x)) {
    return x
  } else if (typeof x === "object") {
    if (x.x && x.y) {
      return [x.x, x.y]
    } else if (x.i && x.j) {
      return [x.i, x.j]
    } else {
      throw new Error("Invalid object.")
    }
  }

  return [x, y]
}

export class Vector2 {
  constructor(i, j) {
    this.i = i
    this.j = j
  }
}
