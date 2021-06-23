/**
 * Static check "identity" function which should be used to indicate
 * that this function is passed in purely for the benefit of having a
 * static checkable value.
 * 
 * Static checking means that this function will not have any effect
 * during runtime.
 */
export function staticCheck<T>(x: T): T {
  return x
}
