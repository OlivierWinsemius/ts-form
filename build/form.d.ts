import { FormField, FormErrors, FormSubmit, FormValues, FormProperties, FormValidators, FormSubmitState, FormEvents } from "./types";
export declare class Form<Values extends FormValues> {
    protected fieldNames: (keyof Values)[];
    protected formValues: Values;
    protected initialFormValues: Values;
    protected onSubmit: FormSubmit<Values>;
    protected formErrors: FormErrors<Values>;
    protected formEvents: FormEvents<Values>;
    protected formSubmitState: FormSubmitState;
    protected formValidators: FormValidators<Values>;
    constructor({ values, onSubmit, validators, events, }: FormProperties<Values>);
    protected getFieldValue: <Field extends keyof Values>(field: Field) => Values[Field];
    protected getFieldErrors: <Field extends keyof Values>(field: Field) => FormErrors<Values>[Field];
    protected getIsFieldTouched: <Field extends keyof Values>(field: Field) => boolean;
    protected getIsSubmitting: () => boolean | undefined;
    protected getIsSubmitted: () => boolean | undefined;
    protected getIsTouched: () => boolean;
    protected getIsValid: () => boolean;
    protected validateField: <Field extends keyof Values>(field: Field) => Promise<void>;
    protected validateAllFields: () => Promise<boolean>;
    protected setFieldValue: <Field extends keyof Values>(field: Field, value: Values[Field]) => Promise<void>;
    get isValid(): boolean;
    get isTouched(): boolean;
    get isSubmitting(): boolean | undefined;
    get isSubmitted(): boolean | undefined;
    getField: <Field extends keyof Values>(field: Field) => FormField<Values[Field]>;
    submit: () => Promise<void>;
    reset: () => Promise<void>;
}
