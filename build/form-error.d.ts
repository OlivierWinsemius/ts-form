import { FormErrors, FormValues } from "./types";
export declare class FormError<V extends FormValues> extends Error {
    name: string;
    constructor(formErrors: FormErrors<V>);
}
