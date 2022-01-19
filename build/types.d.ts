import { Form } from "./form";
import { FieldValidator, FormFieldValidator } from "./field-validator";
declare type FormValue<V = unknown> = V;
export declare type FormValues = Record<string, FormValue>;
export declare type FormValidators<V extends FormValues> = {
  [field in keyof V]: FormFieldValidator<V, keyof V>;
};
export declare type FormSubmit<V extends FormValues> = (
  values: V,
  form: Form<V>
) => void | Promise<void>;
export declare type TouchedFields<V extends FormValues> = {
  [field in keyof V]: boolean;
};
export declare type FormErrors<V extends FormValues> = {
  [field in keyof V]: string[];
};
export declare type Validator<V extends FormValues, F extends keyof V> = (
  fieldValue: V[F],
  values: V
) => Promise<string | undefined> | string | undefined;
export declare type GenericValidator = Validator<FormValues, keyof FormValues>;
export declare type ValidatorCreator<V extends FormValues> = {
  [field in keyof V]?: (
    validator: FieldValidator<V, field>
  ) => FieldValidator<V, field>;
};
export interface FormProperties<V extends FormValues> {
  values: V;
  onSubmit: FormSubmit<V>;
  validators?: ValidatorCreator<V>;
}
export interface FormField<V extends FormValues, F extends keyof V> {
  readonly errors: FormErrors<V>[F];
  readonly isValid: boolean;
  readonly isTouched: boolean;
  readonly value: V[F];
  setValue(value: V[F]): Promise<void>;
}
export {};
