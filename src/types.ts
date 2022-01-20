import { Form } from "./form";
import { FieldValidator, FormFieldValidator } from "./field-validator";

type FormValue<V = unknown> = V;

export type FormValues = Record<string, FormValue>;

export type FormValidators<V extends FormValues> = {
  [field in keyof V]: FormFieldValidator<V>;
};

export type FormSubmit<V extends FormValues> = (
  values: V,
  form: Form<V>
) => void | Promise<void>;

export type FormErrors<V extends FormValues> = {
  [field in keyof V]: string[];
};

export type Validator<V extends FormValues, F extends keyof V> = (
  fieldValue: V[F],
  values: V
) => Promise<string | undefined> | string | undefined;

export type GenericValidator = Validator<FormValues, keyof FormValues>;

export type ValidatorCreator<V extends FormValues> = {
  [field in keyof V]?: (validator: FieldValidator<V>) => FieldValidator<V>;
};
export interface FormProperties<V extends FormValues> {
  values: V;
  onSubmit: FormSubmit<V>;
  validators?: ValidatorCreator<V>;
}

export interface FormField<V> {
  readonly errors: string[];
  readonly isValid: boolean;
  readonly isTouched: boolean;
  readonly value: V;
  setValue(value: V): Promise<void>;
}
