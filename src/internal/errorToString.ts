import { z } from "./z";

export function errorToString(err: z.ZodError | any) {
  if (err instanceof z.ZodError) {
    if (err.errors.length === 1) {
      const firstError = err.errors[0]!;
      if (firstError.code === z.ZodIssueCode.invalid_union) {
        return (
          "\nEvery choice of union failed:\n * " +
          firstError.unionErrors.map((a) => a.toString()).join("\n * ")
        );
      }
    }

    return err.toString();
  }

  return err.message ?? err.name ?? "?";
}
