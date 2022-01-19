import { GenericValidator } from "./types";
export declare const truthyValidator: GenericValidator;
export declare const stringValidator: GenericValidator;
export declare const numberValidator: GenericValidator;
export declare const booleanValidator: GenericValidator;
export declare const undefinedValidator: GenericValidator;
export declare const nullValidator: GenericValidator;
export declare const dateValidator: GenericValidator;
export declare const minNumberValidator: (minValue: number) => GenericValidator;
export declare const maxNumberValidator: (maxValue: number) => GenericValidator;
export declare const minDateValidator: (minValue: Date) => GenericValidator;
export declare const maxDateValidator: (maxValue: Date) => GenericValidator;
export declare const oneOf: <V extends GenericValidator>(
  ...validators: V[]
) => GenericValidator;
