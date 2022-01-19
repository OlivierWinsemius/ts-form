import {
  FormValues,
  FormSubmit,
  TouchedFields,
  FormProperties,
  FormErrors,
  FormValidators,
  FormField,
} from "./types";
export declare class Form<V extends FormValues> {
  protected fieldNames: (keyof V)[];
  protected onSubmit: FormSubmit<V>;
  protected validators: FormValidators<V>;
  protected touchedFields: TouchedFields<V>;
  protected formErrors: FormErrors<V>;
  protected values: V;
  protected initialValues: V;
  protected afterSubmit: (form: this) => void;
  protected afterValidateForm: (form: this) => void;
  protected afterValidateField: (field: keyof V, form: this) => void;
  protected getFieldValue: <F extends keyof V>(field: F) => V[F];
  protected getFieldErrors: <F extends keyof V>(field: F) => FormErrors<V>[F];
  protected getFieldIsTouched: <F extends keyof V>(field: F) => boolean;
  protected validateField: <F extends keyof V>(field: F) => Promise<void>;
  protected validateAllFields: () => Promise<void>;
  protected setFieldValue: <F extends keyof V>(
    field: F,
    value: V[F]
  ) => Promise<void>;
  constructor({ values, onSubmit, validators }: FormProperties<V>);
  isSubmitting: boolean;
  get isValid(): boolean;
  getField: <F extends keyof V>(field: F) => FormField<V, F>;
  submit: () => Promise<void>;
  reset: () => Promise<void>;
}
