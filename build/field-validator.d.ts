import { Form } from "./form";
import { FormValidator, FormValues } from "./types";
export declare class FieldValidator<V extends FormValues, F extends keyof V> {
    protected allowUndefined: boolean;
    protected allowNull: boolean;
    protected validators: FormValidator<V, F>[];
    custom: (validator: FormValidator<V, F>) => this;
    string: () => this;
    number: () => this;
    boolean: () => this;
    date: () => this;
    minNumber: (min: number) => this;
    maxNumber: (max: number) => this;
    minDate: (min: Date) => this;
    maxDate: (max: Date) => this;
    oneOf: (...validators: (() => FieldValidator<V, F>)[]) => this;
    maybe: () => this;
    nullable: () => this;
}
export declare class FormFieldValidator<V extends FormValues, F extends keyof V> extends FieldValidator<V, F> {
    protected form: Form<V>;
    fieldName: F;
    constructor(form: Form<V>, fieldName: F);
    validate: () => Promise<string[]>;
}
