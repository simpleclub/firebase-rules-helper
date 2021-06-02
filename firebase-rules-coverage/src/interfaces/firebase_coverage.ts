export interface FirebaseRulesCoverage {
  rules: FirebaseRulesCoverageRules;
  report: FirebaseRulesCoverageBranch[];
}

export interface FirebaseRulesCoverageRules {
  files: FirebaseRulesCoverageFiles[];
}
export interface FirebaseRulesCoverageFiles {
  content: string;
}

export interface FirebaseRulesCoverageBranch {
  sourcePosition: FirebaseRulesCoverageSourcePosition;
  values?: FirebaseRulesCoverageCoverageValue[];
  children?: FirebaseRulesCoverageBranch[];
}

export interface FirebaseRulesCoverageSourcePosition {
  line: number;
  column: number;
  currentOffset: number;
  endOffset: number;
}

export interface FirebaseRulesCoverageCoverageValue {
  count: number;
  value: FirebaseRulesCoverageValue;
}

export interface FirebaseRulesCoverageValue {
  // todo: Use proper types for unknown.
  nullValue?: null;
  boolValue?: boolean;
  intValue?: string;
  floatValue?: unknown;
  stringValue?: boolean;
  bytesValue?: unknown;
  durationValue?: unknown;
  timestampValue?: string;
  latlngValue?: unknown;
  pathValue?: FirebaseRulesCoveragePathValue;

  mapValue?: FirebaseRulesCoverageMapValue;
  listValue?: unknown;
  constraintValue?: unknown;
}

export interface FirebaseRulesCoveragePathValue {
  segments: FirebaseRulesCoveragePathSegmentValue[];
}
export interface FirebaseRulesCoveragePathSegmentValue {
  simple: string;
}

export interface FirebaseRulesCoverageMapValue {
  fields: {[key: string]: FirebaseRulesCoverageCoverageValue};
}
