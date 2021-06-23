import { stringify } from "./stringify"
import { t } from "./t"
import { z } from "./z"

type accepts = string | number | object
export function invariant<T>(cond: T, message: (() => accepts) | accepts, found?: any): asserts cond is NonNullable<T>
export function invariant(
  cond: any,
  /** Pass a message or function producing a message */
  message: (() => accepts) | accepts,
  /** Pass a value for what we found instead */
  found?: any,
) {
  if (!cond) {
    throw new InvariantError(
      "Invariant: " +
        stringify(typeof message === "function" ? message() : message) +
        (arguments.length > 2 ? `\nInstead found: ${stringify(found)}` : ""),
      found,
    )
  }
}

/** Plain old throw with a never return to help the type system */
export function invariantThrow(
  /** Pass a message or function producing a message */
  message: (() => accepts) | accepts,
  /** Pass a value for what we found instead */
  found?: any,
): never {
  throw new InvariantError(
    "Invariant: " +
      stringify(typeof message === "function" ? message() : message) +
      (arguments.length > 1 ? `\nInstead found: ${stringify(found)}` : ""),
    found,
  )
}

/** Used with our (Story.ai) custom ZodChoice */
export function invariantChoiceIs<TVariants extends Record<string, any>, VariantName extends keyof TVariants>(
  choice: z.ZodChoiceContainer<TVariants>,
  key: VariantName,
  name = "choice",
): TVariants[VariantName] {
  // @ts-ignore
  return choice.matchPartial({ [key]: identity }, (other) => {
    invariantThrow(`Expected ${name} to be "${key}"`, other)
  })
}

function identity<T>(x: T): T {
  return x
}

/** Asserts that the `left` strict equals the `right` */
export function invariantEq(
  left: any,
  /** Pass a value for comparison */
  right: any,
  /** Pass a message or function producing a message */
  message?: (() => accepts) | accepts,
  found?: any,
) {
  if (left !== right)
    throw new InvariantError(
      `Invariant expected ${stringify(left, false)} = ${stringify(right, false)}` +
        optionalMessageSuffix(message) +
        (arguments.length > 3 ? `\nInstead found: ${stringify(found)}` : ""),
      found,
    )
}

/** Asserts that the `value` conforms to the `codec` type */
export function invariantT<T>(
  value: unknown,
  /** Pass a validation */
  codec: t.Type<T>,
  /** Pass a message or function producing a message */
  message?: accepts,
): asserts value is T
export function invariantT(
  value: any,
  /** Pass a validation */
  codec: t.Type<any>,
  /** Pass a message or function producing a message */
  message?: accepts,
) {
  let decode = codec.decode(value)
  if (decode._tag === "Left") {
    console.error("Invariant failed to type check", message, "in", value, "with errors", ...decode.left)
    throw new InvariantError(
      `Invariant expected ${stringify(value)} is ${stringify(codec)}` + optionalMessageSuffix(message),
      value,
    )
  }
}

export function invariantUnreachable(x: never): never {
  invariantThrow("invariantUnreachable encountered value which was supposed to be never", x)
}

export function invariantNever(
  x: never /** Pass a message or function producing a message */,
  message?: accepts,
): never {
  invariantThrow("invariantNever encountered value which was supposed to be never" + optionalMessageSuffix(message), x)
}

function optionalMessageSuffix(message?: accepts): string {
  return message ? " in " + stringify(typeof message === "function" ? message() : message) : ""
}

// remove these lines from thrown errors
const AT_NODE_INTERNAL_RE = /^\s*at.+node:internal.+/gm
const AT_TYPES_INTERNAL_RE = /^\s*at.+\/types\/src\/.+/gm
const AT_INVARIANT_MORE_RE = /^\s*at.+invariant.+/gm
const AT_INVARIANT_RE = /^\s*at (?:Object\.)?invariant.+/gm
const AT_TEST_HELPERS_RE = /^\s*at.+test\-helpers.+/gm

/** `InvariantError` removes the invariant line from the `Error.stack` */
class InvariantError extends Error {
  found: any
  constructor(message: string, found?: any) {
    super(message)
    if (found) {
      this.found = found
    }
    // prettier-ignore
    this.stack = this.stack
      ?.replace(AT_INVARIANT_RE, "")
      .replace(AT_INVARIANT_MORE_RE, "")
      .replace(AT_TYPES_INTERNAL_RE, "")
      .replace(AT_TEST_HELPERS_RE, "")
      .replace(AT_NODE_INTERNAL_RE, "")
  }
}
