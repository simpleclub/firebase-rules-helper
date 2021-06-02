import {buildFile} from '../src';
import * as path from 'path';

jest.mock('../src/build');

global.console = {
  ...global.console,
  error: jest.fn(),
};

describe('CLI', () => {
  afterEach(() => {
    jest.resetModules();
    (buildFile as jest.Mock).mockClear();
    (console.error as jest.Mock).mockClear();
  });

  it('should call build Firestore file', async () => {
    jest.mock('meow', () => {
      return jest.fn().mockImplementation(() => {
        return {
          input: ['fixtures/index.rules'],
          flags: {
            sourceMap: true,
            output: 'fixtures/output/firestore.rules',
          },
        };
      });
    });
    await import('../src/cli');
    expect(buildFile).toBeCalledTimes(1);
    expect(buildFile).toBeCalledWith(
      path.resolve('fixtures/index.rules'),
      path.resolve('fixtures/output/firestore.rules'),
      true
    );
  });

  it('fails without input', async () => {
    jest.mock('meow', () => {
      return jest.fn().mockImplementation(() => {
        return {
          input: [],
          flags: {
            sourceMap: true,
            output: 'fixtures/output/firestore.rules',
          },
        };
      });
    });
    await import('../src/cli');

    expect(buildFile).toBeCalledTimes(0);
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(`Missing required <input>
   Use: firebase-build-rules <input>`);
  });
});
