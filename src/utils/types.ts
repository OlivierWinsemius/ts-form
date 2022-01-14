/* eslint-disable @typescript-eslint/no-explicit-any */

type FormValue<V = any> = V;

export type FormValues = Record<string, FormValue>;

export class FieldError extends Error {
  name = "FieldError";
}

export type FieldErrors<V extends FormValues> = {
  [field in keyof V]?: FieldError[];
};

export type TouchedFields<V extends FormValues> = {
  [field in keyof V]?: boolean;
};

type FormValidator<V extends FormValues, F extends keyof V> = (
  value: V[F],
  values: V
) => Promise<FieldError | undefined> | FieldError | undefined;

export type FormValidators<V extends FormValues> = {
  [field in keyof V]?: FormValidator<V, field>[];
};

export type FormSubmit<V extends FormValues> = (
  values: V
) => void | Promise<void>;
