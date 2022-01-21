import { GenericValidator } from "./types";

export const truthyValidator: GenericValidator = (fieldValue) =>
  !fieldValue ? "invalid_value_truthy" : undefined;

type PrimitiveType = "string" | "number" | "boolean" | "undefined";

const typeValidator =
  <T extends PrimitiveType>(type: T): GenericValidator =>
  (fieldValue) =>
    type !== typeof fieldValue ? `invalid_type_${type}` : undefined;

export const stringValidator = typeValidator("string");

export const numberValidator = typeValidator("number");

export const booleanValidator = typeValidator("boolean");

export const undefinedValidator = typeValidator("undefined");

export const nullValidator: GenericValidator = (fieldValue) =>
  fieldValue !== null ? "invalid_type_null" : undefined;

export const dateValidator: GenericValidator = (fieldValue) =>
  !(fieldValue instanceof Date) ? "invalid_type_date" : undefined;

type MinMaxValueType = "number" | "date";
const minValueValidator =
  <V>(minValue: V, type: MinMaxValueType): GenericValidator =>
  (fieldValue) =>
    (fieldValue as V) < minValue ? `invalid_value_min_${type}` : undefined;

const maxValueValidator =
  <V>(maxValue: V, type: MinMaxValueType): GenericValidator =>
  (fieldValue) =>
    (fieldValue as V) > maxValue ? `invalid_value_max_${type}` : undefined;

export const minNumberValidator =
  (minValue: number): GenericValidator =>
  (fieldValue, formValues) =>
    typeValidator("number")(fieldValue, formValues) ??
    minValueValidator(minValue, "number")(fieldValue, formValues);

export const maxNumberValidator =
  (maxValue: number): GenericValidator =>
  (fieldValue, formValues) =>
    typeValidator("number")(fieldValue, formValues) ??
    maxValueValidator(maxValue, "number")(fieldValue, formValues);

export const minDateValidator =
  (minValue: Date): GenericValidator =>
  (fieldValue, formValues) =>
    dateValidator(fieldValue, formValues) ??
    minValueValidator(minValue, "date")(fieldValue, formValues);

export const maxDateValidator =
  (maxValue: Date): GenericValidator =>
  (fieldValue, formValues) =>
    dateValidator(fieldValue, formValues) ??
    maxValueValidator(maxValue, "date")(fieldValue, formValues);

const emailRegex =
  // eslint-disable-next-line
  /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

export const emailValidator: GenericValidator = (fieldValue, formValues) => {
  const typeError = typeValidator("string")(fieldValue, formValues);

  if (typeError) {
    return typeError;
  }

  return !(fieldValue as string).match(emailRegex)
    ? "invalid_value_email"
    : undefined;
};

export const oneOf =
  <V extends GenericValidator>(...validators: V[]): GenericValidator =>
  async (fieldValue, formValues) => {
    const messages: string[] = [];

    for (const validator of validators) {
      const validatorMessage = await validator(fieldValue, formValues);

      if (!validatorMessage) {
        return;
      }

      messages.push(validatorMessage);
    }

    return messages.join(" / ");
  };
