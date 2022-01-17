import { FieldValidator } from "fieldValidator";

type FormValue<V = unknown> = V;

export type FormValues = Record<string, FormValue>;

export type TouchedFields<V extends FormValues> = {
  [field in keyof V]?: boolean;
};

export type FormValidator<V extends FormValues, F extends keyof V> = (
  fieldValue: V[F],
  values: V
) => Promise<string | undefined> | string | undefined;

export type GenericFormValidator = FormValidator<FormValues, keyof FormValues>;

export type FormValidators<V extends FormValues> = {
  [field in keyof V]?: (validator: FieldValidator<V, field>) => FieldValidator<V, field>
};

export type FormSubmit<V extends FormValues> = (
  values: V
) => void | Promise<void>;
