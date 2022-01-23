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
  emailValidator,
} from "./validators";

export class FieldValidator<Values extends FormValues> {
  protected allowUndefined = false;
  protected allowNull = false;
  protected validators: Validator<Values, keyof Values>[] = [];

  custom = (validator: Validator<Values, keyof Values>) => {
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

  email = () => {
    this.validators.push(emailValidator);
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

  oneOf = (...validators: (() => FieldValidator<Values>)[]) => {
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
  Values extends FormValues
> extends FieldValidator<Values> {
  private shouldValidate = <Field extends keyof Values>(
    value: Values[Field]
  ) => {
    if (value === undefined) {
      return !this.allowUndefined;
    }

    if (value === null) {
      return !this.allowNull;
    }

    return true;
  };

  private cleanupErrors = (errors: string[]) => {
    const errorSet = new Set(errors);

    if (this.allowUndefined) {
      errorSet.delete("invalid_type_undefined");
    }

    if (this.allowNull) {
      errorSet.delete("invalid_type_null");
    }

    return [...errorSet];
  };

  private getValidationErrors = async <Field extends keyof Values>(
    value: Values[Field],
    formValues: Values
  ) => {
    const validationPromises = this.validators.map((v) => v(value, formValues));
    const validationMessages = await Promise.all(validationPromises);
    const messages = validationMessages.filter((m): m is string => !!m);

    return this.cleanupErrors(messages);
  };

  validate = <Field extends keyof Values>(
    formValues: Values,
    fieldName: Field
  ): Promise<string[]> => {
    const value = formValues[fieldName];

    if (!this.shouldValidate(value)) {
      return Promise.resolve([]);
    }

    return this.getValidationErrors(value, formValues);
  };
}
