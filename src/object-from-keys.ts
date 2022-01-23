export const cloneObjectWithDefaultValue = <
  Original extends Record<string, unknown>,
  Key extends keyof Original,
  Value
>(
  originalObject: Original,
  getDefaultValue: (key: Key) => Value
) => {
  const keys = Object.keys(originalObject) as Key[];
  const entries = new Map(keys.map((key) => [key, getDefaultValue(key)]));
  return Object.fromEntries(entries) as Record<Key, Value>;
};
