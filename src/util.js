export function clone (obj) {
  const copy = {}
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr]
  }
  return copy
}

export function defaults (obj, defaultObject) {
  obj = clone(obj || {})
  for (const k in defaultObject) {
    if (obj[k] === undefined) obj[k] = defaultObject[k]
  }
}
