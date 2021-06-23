export * from "zod"
import * as z from "zod"
import { staticCheck } from "../staticCheck"

// Custom Zod types
export { ZodChoice, choiceType as choice } from "./zchoice"
export { ZodChoiceContainer, ZodChoiceVariantsToValue, ZodChoiceFactory, inferChoiceContainer } from "./zchoice"
export { optionType as option } from "./zoption"
export { ZodOption } from "./zoption"

export const obj: typeof z.object = z.object.bind(z)

/**
 * Enables creating a zod type which works purely during static
 * type checking, and during runtime, it will skip any checking.
 *
 * @returns a "custom" zod type which parses all inputs.
 */
export function unchecked<T>() {
  return z.custom<T>(staticCheck)
}

/**
 * A more permissive version of `z.union`.
 *
 * @param items multiple args; one or more zod types
 * @returns
 */
export function or<T extends Array<z.ZodTypeAny>>(...items: T): z.ZodType<T[number]["_type"]> {
  // @ts-ignore
  if (items.length > 1) return z.union([items[0], items[1], ...items.slice(2).map((vOrR) => vOrR)])
  // @ts-ignore
  else return items[0]
}
