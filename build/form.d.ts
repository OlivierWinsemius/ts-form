import { FormValues, FormSubmit, FormValidators } from "utils/types";
interface Properties<V extends FormValues> {
    values: V;
    onSubmit: FormSubmit<V>;
    validators?: FormValidators<V>;
}
export declare class Form<V extends FormValues> {
    private initialValues;
    private validators;
    private touchedFields;
    private onSubmit;
    values: V;
    constructor({ values, onSubmit, validators }: Properties<V>);
    get isValid(): boolean;
    reset: () => void;
    getFieldValue: <F extends keyof V>(field: F) => V[F];
    getFieldErrors: <F extends keyof V>(field: F) => string[];
    getFieldIsTouched: <F extends keyof V>(field: F) => boolean;
    setFieldValue: <F extends keyof V>(field: F, value: V[F]) => Promise<void>;
    getField: <F extends keyof V>(field: F) => {
        readonly errors: string[];
        readonly isValid: boolean;
        readonly isTouched: boolean;
        readonly value: V[F];
        setValue(value: V[F]): Promise<void>;
    };
    submit: () => Promise<void>;
}
export {};
