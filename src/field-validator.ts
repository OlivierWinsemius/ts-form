import { Form } from "./form";
import { Validator, FormValues, GenericValidator } from "./types";
import {
  truthyValidator,
  booleanValidator,
  dateValidator,
  maxDateValidator,
  maxNumberValidator,
  minDateValidator,
  minNumberValidator,
  nullValidator,
  numberValidator,
  oneOf,
  stringValidator,
  undefinedValidator,
} from "./validators";

export class FieldValidator<V extends FormValues, F extends keyof V> {
  protected allowUndefined = false;
  protected allowNull = false;
  protected validators: Validator<V, F>[] = [];

  custom = (validator: Validator<V, F>) => {
    this.validators.push(validator);
    return this;
  };

  truthy = () => {
    this.validators.push(truthyValidator);
    return this;
  };

  string = () => {
    this.validators.push(stringValidator);
    return this;
  };

  number = () => {
    this.validators.push(numberValidator);
    return this;
  };

  boolean = () => {
    this.validators.push(booleanValidator);
    return this;
  };

  date = () => {
    this.validators.push(dateValidator);
    return this;
  };

  minNumber = (min: number) => {
    this.validators.push(minNumberValidator(min));
    return this;
  };

  maxNumber = (max: number) => {
    this.validators.push(maxNumberValidator(max));
    return this;
  };

  minDate = (min: Date) => {
    this.validators.push(minDateValidator(min));
    return this;
  };

  maxDate = (max: Date) => {
    this.validators.push(maxDateValidator(max));
    return this;
  };

  oneOf = (...validators: (() => FieldValidator<V, F>)[]) => {
    validators.forEach((v) => v());

    const validations = this.validators.splice(
      -validators.length
    ) as GenericValidator[];

    this.validators.push(oneOf(...validations));
    return this;
  };

  maybe = () => {
    this.allowUndefined = true;
    this.validators.push(undefinedValidator);
    return this;
  };

  nullable = () => {
    this.allowNull = true;
    this.validators.push(nullValidator);
    return this;
  };
}

export class FormFieldValidator<
  V extends FormValues,
  F extends keyof V
> extends FieldValidator<V, F> {
  protected form: Form<V>;
  fieldName: F;

  constructor(form: Form<V>, fieldName: F) {
    super();
    this.fieldName = fieldName;
    this.form = form;
  }

  validate = async (formValues: V) => {
    const { fieldName, validators, allowNull, allowUndefined } = this;
    const value = formValues[fieldName];

    if (
      (allowUndefined && value === undefined) ||
      (allowNull && value === null)
    ) {
      return [];
    }

    const errorValidations = await Promise.all(
      validators.map((validate) => validate(value, formValues))
    );

    const errors = new Set(
      errorValidations.filter((message): message is string => !!message)
    );

    if (allowUndefined && errors.size === 1) {
      errors.delete("invalid_type_undefined");
    }

    if (allowNull && errors.size === 1) {
      errors.delete("invalid_type_null");
    }

    return [...errors];
  };
}
