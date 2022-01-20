import { Validator, FormValues } from "./types";
export declare class FieldValidator<V extends FormValues> {
    protected allowUndefined: boolean;
    protected allowNull: boolean;
    protected validators: Validator<V, keyof V>[];
    custom: (validator: Validator<V, keyof V>) => this;
    truthy: () => this;
    string: () => this;
    number: () => this;
    boolean: () => this;
    date: () => this;
    minNumber: (min: number) => this;
    maxNumber: (max: number) => this;
    minDate: (min: Date) => this;
    maxDate: (max: Date) => this;
    oneOf: (...validators: (() => FieldValidator<V>)[]) => this;
    maybe: () => this;
    nullable: () => this;
}
export declare class FormFieldValidator<V extends FormValues> extends FieldValidator<V> {
    fieldName: keyof V;
    constructor(fieldName: keyof V);
    private shouldValidate;
    private shouldValidateAfter;
    private getValidationErrors;
    validate: (formValues: V) => Promise<string[]>;
}
