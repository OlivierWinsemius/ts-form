import { FormValues, FormProperties, FieldErrors } from "./types";
export declare class Form<V extends FormValues> {
    private fieldNames;
    private initialValues;
    private onSubmit;
    private validators;
    private touchedFields;
    private fieldErrors;
    private values;
    protected afterSubmit: (form: this) => void;
    protected afterValidateForm: (form: this) => void;
    protected afterValidateField: (field: keyof V, form: this) => void;
    isSubmitting: boolean;
    constructor({ values, onSubmit, validators }: FormProperties<V>);
    get isValid(): boolean;
    reset: () => Promise<void>;
    getFieldValue: <F extends keyof V>(field: F) => V[F];
    getFieldErrors: <F extends keyof V>(field: F) => FieldErrors<V>[F];
    getFieldIsTouched: <F extends keyof V>(field: F) => boolean;
    validateField: <F extends keyof V>(field: F) => Promise<void>;
    validateAllFields: () => Promise<void>;
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
