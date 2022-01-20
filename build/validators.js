"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailValidator = exports.oneOf = exports.maxDateValidator = exports.minDateValidator = exports.maxNumberValidator = exports.minNumberValidator = exports.dateValidator = exports.nullValidator = exports.undefinedValidator = exports.booleanValidator = exports.numberValidator = exports.stringValidator = exports.truthyValidator = void 0;
const truthyValidator = (fieldValue) => !fieldValue ? "invalid_value_truthy" : undefined;
exports.truthyValidator = truthyValidator;
const typeValidator = (type) => (fieldValue) => type !== typeof fieldValue ? `invalid_type_${type}` : undefined;
exports.stringValidator = typeValidator("string");
exports.numberValidator = typeValidator("number");
exports.booleanValidator = typeValidator("boolean");
exports.undefinedValidator = typeValidator("undefined");
const nullValidator = (fieldValue) => fieldValue !== null ? "invalid_type_null" : undefined;
exports.nullValidator = nullValidator;
const dateValidator = (fieldValue) => !(fieldValue instanceof Date) ? "invalid_type_date" : undefined;
exports.dateValidator = dateValidator;
const minValueValidator = (minValue, type) => (fieldValue) => fieldValue < minValue ? `invalid_value_min_${type}` : undefined;
const maxValueValidator = (maxValue, type) => (fieldValue) => fieldValue > maxValue ? `invalid_value_max_${type}` : undefined;
const minNumberValidator = (minValue) => (fieldValue, formValues) => {
    var _a;
    return (_a = typeValidator("number")(fieldValue, formValues)) !== null && _a !== void 0 ? _a : minValueValidator(minValue, "number")(fieldValue, formValues);
};
exports.minNumberValidator = minNumberValidator;
const maxNumberValidator = (maxValue) => (fieldValue, formValues) => {
    var _a;
    return (_a = typeValidator("number")(fieldValue, formValues)) !== null && _a !== void 0 ? _a : maxValueValidator(maxValue, "number")(fieldValue, formValues);
};
exports.maxNumberValidator = maxNumberValidator;
const minDateValidator = (minValue) => (fieldValue, formValues) => {
    var _a;
    return (_a = (0, exports.dateValidator)(fieldValue, formValues)) !== null && _a !== void 0 ? _a : minValueValidator(minValue, "date")(fieldValue, formValues);
};
exports.minDateValidator = minDateValidator;
const maxDateValidator = (maxValue) => (fieldValue, formValues) => {
    var _a;
    return (_a = (0, exports.dateValidator)(fieldValue, formValues)) !== null && _a !== void 0 ? _a : maxValueValidator(maxValue, "date")(fieldValue, formValues);
};
exports.maxDateValidator = maxDateValidator;
const oneOf = (...validators) => (fieldValue, formValues) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = [];
    for (const validator of validators) {
        const validatorMessage = yield validator(fieldValue, formValues);
        if (!validatorMessage) {
            return;
        }
        messages.push(validatorMessage);
    }
    return messages.join(" / ");
});
exports.oneOf = oneOf;
const emailRegex = 
// eslint-disable-next-line
/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
const emailValidator = (fieldValue, formValues) => {
    const typeError = typeValidator("string")(fieldValue, formValues);
    if (typeError) {
        return typeError;
    }
    return !fieldValue.match(emailRegex)
        ? "invalid_value_email"
        : undefined;
};
exports.emailValidator = emailValidator;
