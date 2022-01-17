import { Form } from "./form";
import { FormValidator, FormValues } from "./utils/types";
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
export declare class ActionableFieldValidator<V extends FormValues, F extends keyof V> extends FieldValidator<V, F> {
    protected form: Form<V>;
    fieldName: F;
    errors: string[];
    constructor(form: Form<V>, fieldName: F);
    get isValid(): boolean;
    validate: () => Promise<string[] | undefined>;
}
