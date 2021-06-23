import { tightObjectDebug } from "./tightObjectDebug"

export function stringify(input: any, prettyObj: boolean = true): string {
  try {
    const stringed: string =
      typeof input === "string"
        ? input
        : typeof input === "function"
        ? input.toString()
        : prettyObj
        ? tightObjectDebug(input)
        : JSON.stringify(input)
    if (prettyObj && stringed.includes("\n")) return `\n${stringed}`
    else return stringed
  } catch (err) {
    return input?.name || String(input)
  }
}
