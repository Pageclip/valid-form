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
  return obj
}

export function insertAfter (refNode, nodeToInsert) {
  const sibling = refNode.nextSibling
  if (sibling) {
    const parent = refNode.parentNode
    parent.insertBefore(nodeToInsert, sibling)
  } else {
    parent.appendChild(nodeToInsert)
  }
}

export function insertBefore (refNode, nodeToInsert) {
  const parent = refNode.parentNode
  parent.insertBefore(nodeToInsert, refNode)
}
