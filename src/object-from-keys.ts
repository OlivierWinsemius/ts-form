export const objectFromKeys = <O extends Record<string, unknown>, V>(
  originalObject: O,
  getValue: (key: keyof O) => V
): Record<keyof O, V> => {
  const keys = Object.keys(originalObject);

  const entries = new Map(
    keys.map<[keyof O, V]>((key) => [key, getValue(key)])
  );

  return Object.fromEntries(entries) as Record<keyof O, V>;
};
