import { FieldErrors, FormValues } from "./types";
export declare class FormError<V extends FormValues> extends Error {
    name: string;
    constructor(fieldErrors: FieldErrors<V>);
}
