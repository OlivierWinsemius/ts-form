module.exports = {
  preset: "ts-jest",
  globals: { "ts-jest": { tsconfig: "./tsconfig.json" } },
  moduleDirectories: ["node_modules", "src"],
  collectCoverage: true,
  collectCoverageFrom: ["src/*.ts"],
  coveragePathIgnorePatterns: ["index.ts"],
};
