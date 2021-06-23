export function tightJsonStringify(obj: any) {
  return JSON.stringify(obj, null, 2)
    .replace(/^([\{\[])\n (\s+)/, "$1$2")
    .replace(/(\n[ ]+[\{\[])\n\s+/g, "$1 ")
    .replace(/\n\s*([\]\}])/g, " $1")
}
