/** Ideally this would be TS, but ts-jest seems to have trouble with ESM at the moment
 * this guide for example doesn't work with Typescript >5.1: https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/
 * the latest ts-jest should have fixed this, but it appears to have been re-opened: https://github.com/kulshekhar/ts-jest/issues/4198
 *  note: some suggestions were to change tsconfig noEmitOnError to false
 *    Whilst that didn't change our build now, I didn't want to enable that in case it masks future errors.
 *  note: others suggestions were to change to target esnext
 *    but that loses the native module support in node
 */
module.exports = {
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
