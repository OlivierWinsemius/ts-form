"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectFromKeys = void 0;
const objectFromKeys = (originalObject, getValue) => {
    const keys = Object.keys(originalObject);
    const entries = new Map(keys.map((key) => [key, getValue(key)]));
    return Object.fromEntries(entries);
};
exports.objectFromKeys = objectFromKeys;
