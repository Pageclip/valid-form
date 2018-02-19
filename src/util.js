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

export function forEach (items, fn) {
  if (!items) return
  if (items.forEach) {
    items.forEach(fn)
  } else {
    for (let i = 0; i < items.length; i++) {
      fn(items[i], i, items)
    }
  }
}

export function debounce (ms, fn) {
  let timeout
  const debouncedFn = function () {
    clearTimeout(timeout)
    timeout = setTimeout(fn, ms)
  }
  return debouncedFn
}
