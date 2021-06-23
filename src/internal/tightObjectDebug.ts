export function tightObjectDebug(obj: any) {
  return JSON.stringify(
    obj,
    (key, value) => {
      if (value instanceof Map) {
        return Object.fromEntries(value.entries())
      }
      if (value instanceof Set) {
        return Array.from(value.values())
      }
      return value
    },
    2,
  )
    .replace(/^([\{\[])\n (\s+)/, "$1$2")
    .replace(/(\n[ ]+[\{\[])\n\s+/g, "$1 ")
    .replace(/\n\s*([\]\}])/g, " $1")
}
