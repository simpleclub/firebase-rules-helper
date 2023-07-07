import * as fs from 'fs';
import {firebaseCoverageToLcov, generateLcovFile} from '../src/index.js';

const expectedLcovOutput = `TN:
SF:fixtures/firestore.rules
DA:5,6
DA:8,0
BRDA:5,0,0,1
BRDA:5,0,1,1
BRDA:5,1,0,1
BRDA:5,1,1,1
BRDA:5,1,2,1
BRDA:5,1,3,1
LF:2
LH:1
BRF:6
BRH:6
end_of_record`;

global.console = {
  ...global.console,
  error: jest.fn(),
};

describe('generate lcov file', () => {
  afterEach(() => {
    if (fs.existsSync('fixtures/coverage')) {
      fs.rmSync('fixtures/coverage', {
        recursive: true,
      });
    }
  });

  it('should generate an lcov file', async () => {
    await generateLcovFile(
      'fixtures/firestore-coverage.json',
      '.',
      'fixtures/firestore.rules',
      'fixtures/coverage'
    );
    expect(fs.readFileSync('fixtures/coverage/lcov.info').toString()).toEqual(
      expectedLcovOutput
    );
  });

  it('fails if rules file does not exist', async () => {
    await generateLcovFile(
      'fixtures/firestore-coverage.json',
      '.',
      'fixtures/non-existing.rules',
      'fixtures/coverage'
    );
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(
      'Rules file does not exist at location fixtures/non-existing.rules.'
    );
    expect(fs.existsSync('fixtures/coverage/lcov.info')).toBe(false);
  });
});

describe('firebase coverage to lcov', () => {
  it('should generate an lcov file', () => {
    const rulesCoverage = JSON.parse(
      fs.readFileSync('fixtures/firestore-coverage.json').toString()
    );
    const lcov = firebaseCoverageToLcov(
      '.',
      'fixtures/firestore.rules',
      rulesCoverage
    );
    expect(lcov).toEqual(expectedLcovOutput);
    expect(lcov.length).toBeGreaterThan(0);
  });
});
