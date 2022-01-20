import { Validator, FormValues } from "./types";
export declare class FieldValidator<V extends FormValues> {
    protected allowUndefined: boolean;
    protected allowNull: boolean;
    protected validators: Validator<V, keyof V>[];
    custom: (validator: Validator<V, keyof V>) => this;
    truthy: () => this;
    string: () => this;
    email: () => this;
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
    private shouldValidate;
    private shouldValidateAfter;
    private getValidationErrors;
    validate: <F extends keyof V>(formValues: V, fieldName: F) => Promise<string[]>;
}
