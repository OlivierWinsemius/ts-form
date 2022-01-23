import { FormErrors, FormValues } from "./types";
export declare class FormError<Values extends FormValues> extends Error {
    name: string;
    formErrors: FormErrors<Values>;
    constructor(formErrors: FormErrors<Values>);
}
