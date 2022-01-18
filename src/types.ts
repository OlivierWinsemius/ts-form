import { Form } from "./form";
import { FieldValidator, FormFieldValidator } from "./field-validator";

type FormValue<V = unknown> = V;

export type FormValues = Record<string, FormValue>;

export type Validators<V extends FormValues> = {
  [field in keyof V]: FormFieldValidator<V, keyof V>;
};

export type TouchedFields<V extends FormValues> = {
  [field in keyof V]: boolean;
};

export type FieldErrors<V extends FormValues> = {
  [field in keyof V]: string[];
};

export type FormValidator<V extends FormValues, F extends keyof V> = (
  fieldValue: V[F],
  values: V
) => Promise<string | undefined> | string | undefined;

export type GenericFormValidator = FormValidator<FormValues, keyof FormValues>;

export type FormValidators<V extends FormValues> = {
  [field in keyof V]?: (
    validator: FieldValidator<V, field>
  ) => FieldValidator<V, field>;
};

export type FormSubmit<V extends FormValues> = (
  values: V,
  form: Form<V>
) => void | Promise<void>;

export interface FormProperties<V extends FormValues> {
  values: V;
  onSubmit: FormSubmit<V>;
  validators?: FormValidators<V>;
}
