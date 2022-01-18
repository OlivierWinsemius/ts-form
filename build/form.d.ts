import { FormValues, FormProperties, FieldErrors } from "./types";
export declare class Form<V extends FormValues> {
    private fieldNames;
    private initialValues;
    private onSubmit;
    private validators;
    private touchedFields;
    private fieldErrors;
    values: V;
    protected afterValidate: (_: keyof V) => void | Promise<void>;
    constructor({ values, onSubmit, validators }: FormProperties<V>);
    get isValid(): boolean;
    reset: () => void;
    getFieldValue: <F extends keyof V>(field: F) => V[F];
    getFieldErrors: <F extends keyof V>(field: F) => FieldErrors<V>[F];
    getFieldIsTouched: <F extends keyof V>(field: F) => boolean;
    validateField: <F extends keyof V>(field: F) => Promise<void>;
    setFieldValue: <F extends keyof V>(field: F, value: V[F]) => Promise<void>;
    getField: <F extends keyof V>(field: F) => {
        readonly errors: FieldErrors<V>[F];
        readonly isValid: boolean;
        readonly isTouched: boolean;
        readonly value: V[F];
        setValue(value: V[F]): Promise<void>;
    };
    submit: () => Promise<void>;
}
