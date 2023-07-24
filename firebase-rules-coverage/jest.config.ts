import type {JestConfigWithTsJest} from 'ts-jest';

// This configuration enables ESM
// and is inspired by
// https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/
const config: JestConfigWithTsJest = {
  roots: ['<rootDir>/src/', '<rootDir>/test/'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.[jt]sx?$',
  transform: {
    '^.+\\.(mt|t|cj|j)s$': ['ts-jest', {useESM: true}],
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageReporters: ['text', 'text-summary', ['lcov', {projectRoot: '../'}]],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;
