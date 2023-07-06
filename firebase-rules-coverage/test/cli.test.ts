import {generateLcovFile} from '../src/index.js';
import * as path from 'path';

jest.mock('../src/convert.js');

global.console = {
  ...global.console,
  error: jest.fn(),
};

describe('CLI', () => {
  afterEach(() => {
    jest.resetModules();
    (generateLcovFile as jest.Mock).mockClear();
    (console.error as jest.Mock).mockClear();
  });

  it('should call generate lcov file', async () => {
    jest.mock('meow', () => {
      return jest.fn().mockImplementation(() => {
        return {
          input: ['fixtures/firestore-coverage.json'],
          flags: {
            projectRoot: '.',
            rulesFile: 'fixtures/firestore.rules',
            output: 'coverage',
          },
        };
      });
    });
    await import('../src/cli.js');
    expect(generateLcovFile).toBeCalledTimes(1);
    expect(generateLcovFile).toBeCalledWith(
      'fixtures/firestore-coverage.json',
      path.resolve('.'),
      path.resolve('fixtures/firestore.rules'),
      'coverage'
    );
  });

  it('fails without input', async () => {
    jest.mock('meow', () => {
      return jest.fn().mockImplementation(() => {
        return {
          input: [],
          flags: {
            projectRoot: '.',
            rulesFile: 'fixtures/firestore.rules',
            output: 'coverage',
          },
        };
      });
    });
    await import('../src/cli.js');

    expect(generateLcovFile).toBeCalledTimes(0);
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(`Missing required <input>
   Use: firebase-rules-coverage <input>`);
  });
});
