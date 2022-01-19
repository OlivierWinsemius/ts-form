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
  constructor({ values, onSubmit, validators }: FormProperties<V>);
  isSubmitting: boolean;
  get isValid(): boolean;
  reset: () => Promise<void>;
  getFieldValue: <F extends keyof V>(field: F) => V[F];
  getFieldErrors: <F extends keyof V>(field: F) => FormErrors<V>[F];
  getFieldIsTouched: <F extends keyof V>(field: F) => boolean;
  validateField: <F extends keyof V>(field: F) => Promise<void>;
  validateAllFields: () => Promise<void>;
  setFieldValue: <F extends keyof V>(field: F, value: V[F]) => Promise<void>;
  getField: <F extends keyof V>(field: F) => FormField<V, F>;
  submit: () => Promise<void>;
}
