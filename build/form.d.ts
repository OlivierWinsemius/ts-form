import { FormValues, FormSubmit, FormProperties, FormErrors, FormValidators, FormField } from "./types";
export declare class Form<V extends FormValues> {
    protected onSubmitForm: FormSubmit<V>;
    protected fieldNames: (keyof V)[];
    protected formValidators: FormValidators<V>;
    protected formErrors: FormErrors<V>;
    protected formValues: V;
    protected initialFormValues: V;
    protected isFormSubmitting: boolean;
    protected afterSubmitForm: (form: this) => void;
    protected afterValidateForm: (form: this) => void;
    protected afterValidateField: (field: keyof V, form: this) => void;
    protected getFieldValue: <F extends keyof V>(field: F) => V[F];
    protected getFieldErrors: <F extends keyof V>(field: F) => FormErrors<V>[F];
    protected getIsFieldTouched: <F extends keyof V>(field: F) => boolean;
    protected getIsSubmitting: () => boolean;
    protected getIsTouched: () => boolean;
    protected getIsValid: () => boolean;
    protected validateField: <F extends keyof V>(field: F) => Promise<void>;
    protected validateAllFields: () => Promise<void>;
    protected setFieldValue: <F extends keyof V>(field: F, value: V[F]) => Promise<void>;
    constructor({ values, onSubmit, validators }: FormProperties<V>);
    get isValid(): boolean;
    get isTouched(): boolean;
    get isSubmitting(): boolean;
    getField: <F extends keyof V>(field: F) => FormField<V[F]>;
    submit: () => Promise<void>;
    reset: () => Promise<void>;
}
