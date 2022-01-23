"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneObjectWithDefaultValue = void 0;
const cloneObjectWithDefaultValue = (originalObject, getDefaultValue) => {
    const keys = Object.keys(originalObject);
    const entries = new Map(keys.map((key) => [key, getDefaultValue(key)]));
    return Object.fromEntries(entries);
};
exports.cloneObjectWithDefaultValue = cloneObjectWithDefaultValue;
