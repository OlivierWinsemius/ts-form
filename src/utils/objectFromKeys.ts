/* eslint-disable @typescript-eslint/no-explicit-any */

export const objectFromKeys = <O extends Record<string, any>, V>(
  originalObject: O,
  value: V
): Record<keyof O, V> => {
  const keys = Object.keys(originalObject);
  const entries = new Map(keys.map<[keyof O, V]>((key) => [key, value]));
  return Object.fromEntries(entries) as Record<keyof O, V>;
};
