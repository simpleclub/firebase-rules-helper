export interface CoverageResults {
  files: {[path: string]: CoverageFileResults};
}

export interface CoverageFileResults {
  lines: {[key: number]: LineCoverageResult};
  branches: {[key: number]: BranchCoverageResult[]};
}

export interface LineCoverageResult {
  count: number;
}

export interface BranchCoverageResult {
  line: number;
  count: number;
}
