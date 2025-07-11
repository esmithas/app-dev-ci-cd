/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["<rootDir>/src/__tests__/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
}; 