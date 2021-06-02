import * as fs from 'fs';
import * as path from 'path';
import {SourceMapGenerator} from 'source-map';

interface ResolveResult {
  content: string;
  line: number;
  column: number;
}

export function resolveImports(
  map: SourceMapGenerator,
  filePath: string,
  line = 1,
  column = 0
): ResolveResult {
  const rulesFile = fs.readFileSync(filePath).toString();
  // Every second element in the array will have the file name to the imported file
  const fileElements = rulesFile.split(/include "([A-Za-z0-9/.]+\.rules)";/);
  // Resolve imports
  let resolvedRulesFile = '';
  let isImport = false;
  let generatedLine = line;
  let generatedColumn = column;
  let originalLine = 1;
  let originalColumn = 0;
  for (const elem of fileElements) {
    if (isImport) {
      const importPath = path.join(filePath, '..', elem);
      const result = resolveImports(
        map,
        importPath,
        generatedLine,
        generatedColumn
      );
      resolvedRulesFile += result.content;
      generatedLine = result.line;
      generatedColumn = result.column;
    } else {
      resolvedRulesFile += elem;

      const updated = generateSourceMap(
        map,
        filePath,
        elem,
        generatedLine,
        generatedColumn,
        originalLine,
        originalColumn
      );
      generatedLine = updated.generatedLine;
      generatedColumn = updated.generatedColumn;
      originalLine = updated.originalLine;
      originalColumn = updated.originalColumn;
    }
    isImport = !isImport;
  }
  return {
    content: resolvedRulesFile,
    line: generatedLine,
    column: generatedColumn,
  };
}

function generateSourceMap(
  map: SourceMapGenerator,
  filePath: string,
  code: string,
  generatedLine: number,
  generatedColumn: number,
  originalLine: number,
  originalColumn: number
): {
  generatedLine: number;
  generatedColumn: number;
  originalLine: number;
  originalColumn: number;
} {
  const characters = code.split('');
  for (const char of characters) {
    map.addMapping({
      generated: {
        line: generatedLine,
        column: generatedColumn,
      },
      source: filePath,
      original: {
        line: originalLine,
        column: originalColumn,
      },
    });
    if (char === '\n') {
      generatedLine++;
      originalLine++;
      generatedColumn = 0;
      originalColumn = 0;
    } else {
      generatedColumn++;
      originalColumn++;
    }
  }

  return {
    generatedLine,
    generatedColumn,
    originalLine,
    originalColumn,
  };
}

export function buildFile(srcPath: string, destPath: string, sourceMap = true) {
  const map = new SourceMapGenerator({
    file: destPath,
  });
  fs.mkdirSync(path.dirname(destPath), {recursive: true});
  fs.writeFileSync(destPath, resolveImports(map, srcPath).content);
  if (sourceMap) {
    fs.writeFileSync(
      path.join(path.dirname(destPath), path.basename(destPath) + '.map'),
      map.toString()
    );
  }
}
