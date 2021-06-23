import * as z from "zod"
import { choiceType, ZodChoice } from "./zchoice"

export type ZodOption<T> =
  | {
      Some: T
    }
  | {
      /** `true` so a `if (!value.None)` check will make sense */
      None: true
    }

export function optionType<T extends z.ZodTypeAny>(
  some: T,
): ZodChoice<{
  Some: T
  None: true
}> {
  return choiceType({
    Some: some,
    None: z.literal(true),
  })
}
