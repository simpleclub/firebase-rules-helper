import {jest} from '@jest/globals';
// import {buildFile} from '../src/index.js';
import * as path from 'path';

// jest.mock('../src/build');

type TestedModule = typeof import('../src/build.js');
let buildFile: TestedModule['buildFile'] | jest.Mock;

global.console = {
  ...global.console,
  error: jest.fn(),
};

describe('CLI', () => {
  beforeEach(async () => {
    jest.unstable_mockModule('../src/build.js', () => ({
      buildFile: jest.fn(),
    }));
    const module = await import('../src/build.js');
    buildFile = module.buildFile;
  });
  afterEach(() => {
    jest.resetModules();
    (buildFile as jest.Mock).mockClear();
    (console.error as jest.Mock).mockClear();
  });

  it('should call build Firestore file', async () => {
    jest.unstable_mockModule('meow', () => {
      return {
        default: jest.fn().mockImplementation(() => {
          return {
            input: ['fixtures/index.rules'],
            flags: {
              sourceMap: true,
              output: 'fixtures/output/firestore.rules',
            },
          };
        }),
      };
    });
    await import('../src/cli.js');
    expect(buildFile).toBeCalledTimes(1);
    expect(buildFile).toBeCalledWith(
      path.resolve('fixtures/index.rules'),
      path.resolve('fixtures/output/firestore.rules'),
      true
    );
  });

  it('fails without input', async () => {
    jest.unstable_mockModule('meow', () => {
      return {
        default: jest.fn().mockImplementation(() => {
          return {
            input: [],
            flags: {
              sourceMap: true,
              output: 'fixtures/output/firestore.rules',
            },
          };
        }),
      };
    });
    await import('../src/cli.js');

    expect(buildFile).toBeCalledTimes(0);
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(`Missing required <input>
   Use: firebase-build-rules <input>`);
  });
});
