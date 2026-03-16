import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  collectCoverageFrom: [
    // Business-logic layer — all services, utils, and helpers
    "src/lib/core/**/*.{ts,tsx}",
    "src/app/checklist/utils.ts",
    "src/app/checklist/types.ts",
    "src/app/modules/progress.ts",
    "src/app/quizzes/passedQuizzes.ts",
    "!src/**/*.d.ts",
    "!src/**/*.test.{ts,tsx}",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "**/__tests__/**/*.{ts,tsx}",
    "**/*.test.{ts,tsx}",
    "**/*.integration.test.{ts,tsx}",
    "**/*.unit.test.{ts,tsx}",
  ],
};

export default createJestConfig(config);
