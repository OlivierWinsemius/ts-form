import { FormErrors, FormValues } from "./types";

export class FormError<V extends FormValues> extends Error {
  name = "FormError";

  constructor(formErrors: FormErrors<V>) {
    super(
      Object.entries(formErrors)
        .flatMap(([fieldName, errors]) =>
          [fieldName, errors.map((e) => `\t- ${e}`).join("\n")].join(":\n")
        )
        .join("\n")
    );
  }
}
