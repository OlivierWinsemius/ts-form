module.exports = {
  preset: "ts-jest",
  transform: {
    "src/tests/*.ts": ["ts-jest", { tsconfig: "./tsconfig.json" }],
  },
  moduleDirectories: ["node_modules", "src"],
  collectCoverage: true,
  collectCoverageFrom: ["src/*.ts"],
  coveragePathIgnorePatterns: ["index.ts"],
};
