import { Form } from "./form";
import { FieldValidator, FormFieldValidator } from "./field-validator";

type FormValue<Value = unknown> = Value;

export type FormValues = {
  [key: string]: FormValue;
};

export type FormValidators<Values extends FormValues> = {
  [field in keyof Values]: FormFieldValidator<Values>;
};

export type FormSubmit<Values extends FormValues> = <ReturnValue>(
  values: Values,
  form: Form<Values>
) => ReturnValue | Promise<ReturnValue>;

export interface FormSubmitState {
  isSubmitted?: boolean;
  isSubmitting?: boolean;
}

export interface FormEvents<Values extends FormValues> {
  afterReset: (form: Form<Values>) => void;
  beforeSubmit: (form: Form<Values>) => void;
  afterSubmit: (form: Form<Values>) => void;
  afterValidate: (field: keyof Values, form: Form<Values>) => void;
}

export type FormErrors<Values extends FormValues> = {
  [field in keyof Values]: string[];
};

export type Validator<Values extends FormValues, Field extends keyof Values> = (
  fieldValue: Values[Field],
  values: Values
) => Promise<string | undefined> | string | undefined;

export type GenericValidator = Validator<FormValues, keyof FormValues>;

export type ValidatorCreator<Values extends FormValues> = {
  [field in keyof Values]?: (
    validator: FieldValidator<Values>
  ) => FieldValidator<Values>;
};
export interface FormProperties<Values extends FormValues> {
  values: Values;
  onSubmit: FormSubmit<Values>;
  validators?: ValidatorCreator<Values>;
  events?: FormEvents<Values>;
}

export interface FormField<Values> {
  readonly errors: string[];
  readonly isValid: boolean;
  readonly isTouched: boolean;
  readonly value: Values;
  setValue(value: Values): Promise<void>;
}
