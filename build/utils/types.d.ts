import { FieldValidator } from "../field-validator";
declare type FormValue<V = unknown> = V;
export declare type FormValues = Record<string, FormValue>;
export declare type TouchedFields<V extends FormValues> = {
    [field in keyof V]?: boolean;
};
export declare type FormValidator<V extends FormValues, F extends keyof V> = (fieldValue: V[F], values: V) => Promise<string | undefined> | string | undefined;
export declare type GenericFormValidator = FormValidator<FormValues, keyof FormValues>;
export declare type FormValidators<V extends FormValues> = {
    [field in keyof V]?: (validator: FieldValidator<V, field>) => FieldValidator<V, field>;
};
export declare type FormSubmit<V extends FormValues> = (values: V) => void | Promise<void>;
export {};
