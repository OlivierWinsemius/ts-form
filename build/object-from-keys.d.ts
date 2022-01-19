export declare const objectFromKeys: <O extends Record<string, unknown>, V>(
  originalObject: O,
  getValue: (key: keyof O) => V
) => Record<keyof O, V>;
