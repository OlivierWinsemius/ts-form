import { Validator, FormValues } from "./types";
export declare class FieldValidator<Values extends FormValues> {
    protected allowUndefined: boolean;
    protected allowNull: boolean;
    protected validators: Validator<Values, keyof Values>[];
    custom: (validator: Validator<Values, keyof Values>) => this;
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
    oneOf: (...validators: (() => FieldValidator<Values>)[]) => this;
    maybe: () => this;
    nullable: () => this;
}
export declare class FormFieldValidator<Values extends FormValues> extends FieldValidator<Values> {
    private shouldValidate;
    private cleanupErrors;
    private getValidationErrors;
    validate: <Field extends keyof Values>(formValues: Values, fieldName: Field) => Promise<string[]>;
}
