import {jest} from '@jest/globals';
import * as fs from 'fs';
import {buildFile, resolveImports} from '../src/index.js';
import {SourceMapGenerator} from 'source-map';

global.console = {
  ...global.console,
  error: jest.fn(),
};

describe('build file', () => {
  afterEach(() => {
    if (fs.existsSync('fixtures/output')) {
      fs.rmSync('fixtures/output', {
        recursive: true,
      });
    }
  });

  it('should generate a rules file', () => {
    buildFile('fixtures/index.rules', 'fixtures/output/firestore.rules', false);
    expect(
      fs.readFileSync('fixtures/output/firestore.rules').toString(),
    ).toEqual(fs.readFileSync('fixtures/firestore.rules').toString());
  });

  it('should generate a source map file', () => {
    buildFile('fixtures/index.rules', 'fixtures/output/firestore.rules');
    expect(
      fs.readFileSync('fixtures/output/firestore.rules.map').toString(),
    ).toEqual(fs.readFileSync('fixtures/firestore.rules.map').toString());
  });
});

describe('resolve imports', () => {
  afterEach(() => {
    if (fs.existsSync('fixtures/output')) {
      fs.rmSync('fixtures/output', {
        recursive: true,
      });
    }
  });

  it('should resolve imports', () => {
    const map = new SourceMapGenerator({
      file: 'fixtures/output/firestore.rules',
    });
    const result = resolveImports(map, 'fixtures/index.rules');
    expect(result.content).toEqual(
      fs.readFileSync('fixtures/firestore.rules').toString(),
    );
  });
});
