import { GenericFormValidator } from "utils/types";

type PrimitiveType = "string" | "number" | "boolean";
type MinMaxValueType = "number" | "date"

const typeValidator = <T extends PrimitiveType>(type: T): GenericFormValidator => (fieldValue) => type !== typeof fieldValue ? `invalid_type_${type}` : undefined
export const stringValidator = typeValidator("string")
export const numberValidator = typeValidator("number")
export const booleanValidator = typeValidator("boolean")
export const dateValidator: GenericFormValidator = (fieldValue) => (!(fieldValue instanceof Date)) ? "invalid_type_date" : undefined
const minValueValidator = <V>(minValue: V, type: MinMaxValueType): GenericFormValidator => (fieldValue) => ((fieldValue as V) < minValue) ? `invalid_value_min_${type}` : undefined
const maxValueValidator = <V>(maxValue: V, type: MinMaxValueType): GenericFormValidator => (fieldValue) => fieldValue as V > maxValue ? `invalid_value_max_${type}` : undefined
export const minNumberValidator = (minValue: number): GenericFormValidator => (fieldValue, formValues) => typeValidator("number")(fieldValue,formValues) ?? minValueValidator(minValue, "number")(fieldValue,formValues);
export const maxNumberValidator = (maxValue: number): GenericFormValidator => (fieldValue, formValues) => typeValidator("number")(fieldValue,formValues) ?? maxValueValidator(maxValue, "number")(fieldValue,formValues);
export const minDateValidator = (minValue: Date): GenericFormValidator => (fieldValue, formValues) => dateValidator(fieldValue,formValues) ?? minValueValidator(minValue, "date")(fieldValue,formValues);
export const maxDateValidator = (maxValue: Date): GenericFormValidator => (fieldValue, formValues) => dateValidator(fieldValue,formValues) ?? maxValueValidator(maxValue, "date")(fieldValue,formValues);
