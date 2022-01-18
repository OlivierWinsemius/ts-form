import { FieldErrors, FormValues } from "./types";

export class FormError<V extends FormValues> extends Error {
  name = "FormError";

  constructor(fieldErrors: FieldErrors<V>) {
    super(
      Object.entries(fieldErrors)
        .flatMap(([fieldName, errors]) =>
          [fieldName, errors.map((e) => `\t- ${e}`).join("\n")].join(":\n")
        )
        .join("\n")
    );
  }
}
