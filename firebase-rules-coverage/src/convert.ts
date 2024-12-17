import * as fs from 'fs';
import * as path from 'path';
import {
  CoverageResults,
  FirebaseRulesCoverage,
  FirebaseRulesCoverageBranch,
} from './interfaces/index.js';
import {SourceMapConsumer} from 'source-map';

// todo: Firestore coverage reporting does not detect if: true/if: false statements, which might be critical for test coverage.
// todo: We might want to approach the Firebase team here if this can be added.

// todo: Branch coverage might not work properly also, function coverage would also be cool in the future.
// todo: For both of these the Firebase team might help.

export async function generateLcovFile(
  coverageFile: string,
  projectDir: string,
  rulesFile: string,
  outputDir: string,
) {
  const rulesCoverage = JSON.parse(fs.readFileSync(coverageFile).toString());

  if (!fs.existsSync(rulesFile)) {
    console.error(`Rules file does not exist at location ${rulesFile}.`);
    return;
  }
  const sourceMapFile = rulesFile + '.map';
  let sourceMap: SourceMapConsumer | undefined = undefined;
  if (fs.existsSync(sourceMapFile)) {
    const sourceMapJson = JSON.parse(fs.readFileSync(sourceMapFile).toString());
    sourceMap = await SourceMapConsumer.with(sourceMapJson, null, consumer => {
      return consumer;
    });
  }

  const lcovFile = firebaseCoverageToLcov(
    projectDir,
    rulesFile,
    rulesCoverage,
    sourceMap,
  );
  const lcovFilePath = path.join(outputDir, 'lcov.info');
  fs.mkdirSync(path.dirname(lcovFilePath), {recursive: true});
  fs.writeFileSync(lcovFilePath, lcovFile);
}

export function firebaseCoverageToLcov(
  projectDir: string,
  rulesFile: string,
  rulesCoverage: FirebaseRulesCoverage,
  sourceMap?: SourceMapConsumer,
): string {
  let coverageResult: CoverageResults = {
    files: {},
  };
  for (const branch of rulesCoverage.report) {
    coverageResult = mergeCoverageResults(
      coverageResult,
      getBranchCoverage(
        branch,
        projectDir,
        rulesFile,
        rulesCoverage.rules.files[0].content,
        sourceMap,
      ),
    );
  }

  const lcovFileLines = [];
  lcovFileLines.push('TN:');

  for (const [file, coverageFileResult] of Object.entries(
    coverageResult.files,
  )) {
    lcovFileLines.push(`SF:${file}`);

    let linesFound = 0;
    let linesCovered = 0;
    for (const [line, coverage] of Object.entries(coverageFileResult.lines)) {
      linesFound++;
      if (coverage.count > 0) linesCovered++;
      lcovFileLines.push('DA:' + [line, coverage.count].join(','));
    }

    let branchesFound = 0;
    let branchesCovered = 0;
    for (const [branchKey, coverage] of Object.entries(
      coverageFileResult.branches,
    )) {
      let i = 0;
      for (const branch of coverage) {
        branchesFound++;
        if (branch.count > 0) branchesCovered++;
        lcovFileLines.push(
          'BRDA:' + [branch.line, branchKey, i, branch.count].join(','),
        );
        i++;
      }
    }

    lcovFileLines.push(`LF:${linesFound}`);
    lcovFileLines.push(`LH:${linesCovered}`);

    lcovFileLines.push(`BRF:${branchesFound}`);
    lcovFileLines.push(`BRH:${branchesCovered}`);

    lcovFileLines.push('end_of_record');
  }

  return lcovFileLines.join('\n');
}

function getBranchCoverage(
  branch: FirebaseRulesCoverageBranch,
  projectDir: string,
  rulesFile: string,
  ruleFileContent: string,
  sourceMap: SourceMapConsumer | undefined,
  branchKey = 0,
): CoverageResults {
  let results: CoverageResults = {
    files: {},
  };

  // Get source location.
  let file: string;
  let line: number;
  if (sourceMap) {
    const originalPosition = sourceMap.originalPositionFor({
      line: branch.sourcePosition.line,
      column: getLineColumnForFileOffset(
        ruleFileContent,
        branch.sourcePosition.currentOffset,
      ),
    });
    if (originalPosition.source === null || originalPosition.line === null) {
      return results;
    }
    file = originalPosition.source;
    line = originalPosition.line;
  } else {
    file = rulesFile;
    line = branch.sourcePosition.line;
  }
  // Use file path relative to the project root directory.
  file = path.relative(projectDir, file);

  if (branch.children) {
    for (const child of branch.children) {
      results = mergeCoverageResults(
        results,
        getBranchCoverage(
          child,
          projectDir,
          rulesFile,
          ruleFileContent,
          sourceMap,
          branchKey++,
        ),
      );
    }
  } else if (branch.values) {
    for (const value of branch.values) {
      results = addLineCoverage(results, file, line, value.count);
      results = addBranchCoverage(results, file, line, branchKey, value.count);
    }
  } else {
    // todo: Check if we should add branch coverage here?
    results = addLineCoverage(results, file, line, 0);
  }

  return results;
}

function mergeCoverageResults(
  first: CoverageResults,
  second: CoverageResults,
): CoverageResults {
  let results: CoverageResults = {
    files: {},
  };

  for (const [file, fileResults] of Object.entries(first.files)) {
    for (const [line, coverage] of Object.entries(fileResults.lines)) {
      results = addLineCoverage(results, file, parseInt(line), coverage.count);
    }

    for (const [branchKey, coverage] of Object.entries(fileResults.branches)) {
      for (const branch of coverage) {
        results = addBranchCoverage(
          results,
          file,
          branch.line,
          parseInt(branchKey),
          branch.count,
        );
      }
    }
  }

  for (const [file, fileResults] of Object.entries(second.files)) {
    for (const [line, coverage] of Object.entries(fileResults.lines)) {
      results = addLineCoverage(results, file, parseInt(line), coverage.count);
    }

    for (const [branchKey, coverage] of Object.entries(fileResults.branches)) {
      for (const branch of coverage) {
        results = addBranchCoverage(
          results,
          file,
          branch.line,
          parseInt(branchKey),
          branch.count,
        );
      }
    }
  }

  return results;
}

function addLineCoverage(
  results: CoverageResults,
  file: string,
  line: number,
  count: number,
): CoverageResults {
  if (!results.files[file]) {
    results.files[file] = {
      lines: {},
      branches: {},
    };
  }
  if (!Object.keys(results.files[file].lines).includes(`${line}`)) {
    results.files[file].lines[line] = {count};
  } else {
    results.files[file].lines[line].count += count;
  }
  return results;
}

function addBranchCoverage(
  results: CoverageResults,
  file: string,
  line: number,
  key: number,
  count: number,
): CoverageResults {
  if (!results.files[file]) {
    results.files[file] = {
      lines: {},
      branches: {},
    };
  }
  if (!Object.keys(results.files[file].branches).includes(`${key}`)) {
    results.files[file].branches[key] = [{line, count}];
  } else {
    results.files[file].branches[key].push({line, count});
  }
  return results;
}

function getLineColumnForFileOffset(
  ruleFileContent: string,
  offset: number,
): number {
  return ruleFileContent.substr(0, offset).split('\n').pop()?.length ?? 0;
}
